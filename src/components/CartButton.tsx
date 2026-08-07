import { useCart } from './CartProvider';
import CartIcon from './icons/CartIcon';

interface Props {
  onClick: () => void;
}

export default function CartButton({ onClick }: Props) {
  const { itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-2 text-white hover:text-hot transition-colors shrink-0"
      aria-label="Abrir carrito"
    >
      <CartIcon size={28} />

      <span className="absolute -top-0.5 -right-0.5 bg-hot text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 leading-none">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    </button>
  );
}
