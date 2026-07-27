import { useState, type FormEvent } from 'react';
import { stripNonDigits, validatePhone } from './phone';
import type { CartItem } from '../components/CartProvider';

interface UseCheckoutProps {
  items: CartItem[];
  totalAmount: number;
  sellerId: string;
  sellerName: string;
  whatsappUrl: string;
  clearCart: () => void;
  onClose: () => void;
}

interface CheckoutState {
  name: string;
  phone: string;
  errors: { name?: string; phone?: string };
  loading: boolean;
  submitError: string;
}

export function useCheckout(props: UseCheckoutProps) {
  const { items, totalAmount, sellerId, sellerName, whatsappUrl, clearCart, onClose } = props;

  const [state, setState] = useState<CheckoutState>({
    name: '',
    phone: '',
    errors: {},
    loading: false,
    submitError: '',
  });

  const setName = (name: string) => setState(s => ({ ...s, name, errors: { ...s.errors, name: undefined }, submitError: '' }));
  const setPhone = (phone: string) => setState(s => ({ ...s, phone, errors: { ...s.errors, phone: undefined }, submitError: '' }));

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!state.name.trim() || state.name.trim().length < 3) {
      newErrors.name = 'Ingresá tu nombre completo';
    }

    if (!validatePhone(state.phone)) {
      newErrors.phone = 'Ingresá un número de teléfono válido (mínimo 8 dígitos)';
    }

    setState(s => ({ ...s, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(s => ({ ...s, submitError: '' }));

    if (!validate()) return;
    if (items.length === 0) {
      setState(s => ({ ...s, submitError: 'Tu carrito está vacío. Agregá productos antes de enviar el pedido.' }));
      return;
    }

    setState(s => ({ ...s, loading: true }));

    try {
      const cleanPhone = stripNonDigits(state.phone);

      // Send checkout via API (server-side validation + insert)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
          customerName: state.name.trim(),
          customerPhone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      // Build WhatsApp message
      const itemsList = items
        .map((item) => `• ${item.productName} x${item.quantity} — L ${(item.price * item.quantity).toFixed(2)}`)
        .join('\n');

      const message = `¡Hola! Soy *${state.name.trim()}*. Quiero hacer este pedido:\n\n` +
        `*Mi pedido:*\n${itemsList}\n\n` +
        `*Total: L ${totalAmount.toFixed(2)}*\n\n` +
        `Mi telefono: ${cleanPhone}`;

      window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      clearCart();
      onClose();
      setState({
        name: '',
        phone: '',
        errors: {},
        loading: false,
        submitError: '',
      });
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        submitError: err instanceof Error ? err.message : 'Ocurrió un error al enviar tu pedido. Intentá de nuevo.',
      }));
    }
  };

  return {
    ...state,
    setName,
    setPhone,
    handleSubmit,
  };
}
