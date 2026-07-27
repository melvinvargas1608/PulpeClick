import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { extractStoragePath } from '../../lib/storage';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const productId: string | undefined = body?.productId;

    if (!productId) {
      return new Response(JSON.stringify({ error: 'productId requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get product to find image URL
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('image_url')
      .eq('id', productId)
      .single();

    // Delete from storage if image exists
    if (product?.image_url) {
      const filePath = extractStoragePath(product.image_url);
      if (filePath) {
        await supabaseAdmin.storage.from('products').remove([filePath]);
      }
    }

    // Delete product (CASCADE will handle order_items)
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Error al eliminar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
