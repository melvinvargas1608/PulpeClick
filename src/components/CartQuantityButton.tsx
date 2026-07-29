import { useCart } from './CartProvider';

interface Props {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string | null;
}

export default function CartQuantityButton({ productId, productName, price, imageUrl }: Props) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.productId === productId);
  const inCart = cartItem && cartItem.quantity > 0;

  if (inCart && cartItem) {
    return (
      <div className="flex items-center gap-1 bg-brand rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => updateQuantity(productId, cartItem.quantity - 1)}
          className="text-white hover:bg-brand-dark px-2 py-1.5 text-sm font-bold transition-colors"
          aria-label={`Reducir cantidad de ${productName}`}
        >
          −
        </button>
        <span className="text-white text-sm font-semibold min-w-6 text-center">
          {cartItem.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(productId, cartItem.quantity + 1)}
          className="text-white hover:bg-brand-dark px-2 py-1.5 text-sm font-bold transition-colors"
          aria-label={`Aumentar cantidad de ${productName}`}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem({ productId, productName, price, imageUrl })}
      className="bg-brand hover:bg-brand-dark text-white font-semibold py-1.5 px-3 rounded-lg text-sm transition-colors inline-flex items-center gap-1.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Agregar
    </button>
  );
}
