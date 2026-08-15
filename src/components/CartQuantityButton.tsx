import { useCart } from './CartProvider';

interface Props {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  isAvailable?: boolean;
}

export default function CartQuantityButton({ productId, productName, price, imageUrl, isAvailable = true }: Props) {
  const { items, addItem } = useCart();
  const cartItem = items.find((i) => i.productId === productId);
  const inCart = cartItem && cartItem.quantity > 0;

  if (!isAvailable) {
    return (
      <span className="flex items-center justify-center gap-1.5 bg-gray-200 text-gray-500 text-sm font-semibold py-2 px-3 rounded-full w-full cursor-not-allowed">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Agotado
      </span>
    );
  }

  if (inCart) {
    return (
      <span className="flex items-center justify-center gap-1.5 bg-brand-light text-brand text-sm font-semibold py-2 px-3 rounded-full w-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      className="bg-brand hover:bg-brand-dark text-white font-semibold py-2 px-3 rounded-full text-sm transition-colors flex items-center justify-center gap-1.5 w-full"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Agregar al carrito
    </button>
  );
}
