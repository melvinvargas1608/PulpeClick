import { useCart } from './CartProvider';

interface Props {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string | null;
}

export default function CartQuantityButton({ productId, productName, price, imageUrl }: Props) {
  const { items, addItem } = useCart();
  const cartItem = items.find((i) => i.productId === productId);
  const inCart = cartItem && cartItem.quantity > 0;

  if (inCart) {
    return (
      <span className="inline-flex items-center gap-1 bg-brand-light text-brand text-xs font-semibold px-2.5 py-1.5 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        En carrito
      </span>
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
