import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

interface CheckoutRequest {
  sellerId: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  customerName: string;
  customerPhone: string;
}

function isValidCheckoutBody(body: unknown): body is CheckoutRequest {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;

  if (typeof b.sellerId !== 'string' || !b.sellerId) return false;
  if (!Array.isArray(b.items) || b.items.length === 0) return false;
  if (typeof b.customerName !== 'string' || b.customerName.trim().length < 3) return false;
  if (typeof b.customerPhone !== 'string' || b.customerPhone.trim().length < 8) return false;

  for (const item of b.items) {
    if (
      typeof item.productId !== 'string' || !item.productId ||
      typeof item.productName !== 'string' || !item.productName ||
      typeof item.quantity !== 'number' || item.quantity < 1 ||
      typeof item.price !== 'number' || item.price < 0
    ) return false;
  }

  return true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!isValidCheckoutBody(body)) {
      return new Response(JSON.stringify({ error: 'Datos del pedido inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { sellerId, items, customerName, customerPhone } = body;

    // Verify seller is active
    const { data: seller } = await supabaseAdmin
      .from('sellers')
      .select('id, name')
      .eq('id', sellerId)
      .eq('is_active', true)
      .single();

    if (!seller) {
      return new Response(JSON.stringify({ error: 'Vendedor no disponible' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find or create customer
    let customerId: string | null = null;
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('phone', customerPhone)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer } = await supabaseAdmin
        .from('customers')
        .insert({ name: customerName.trim(), phone: customerPhone })
        .select('id')
        .single();

      if (newCustomer) customerId = newCustomer.id;
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Insert order
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        seller_id: sellerId,
        customer_name: customerName.trim(),
        customer_phone: customerPhone,
        customer_id: customerId,
        total_amount: totalAmount,
        status: 'completed',
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      throw new Error(orderError?.message || 'Error al guardar el pedido');
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
    }));

    await supabaseAdmin.from('order_items').insert(orderItems);

    return new Response(JSON.stringify({ success: true, orderId: orderData.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Error al procesar el pedido' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
