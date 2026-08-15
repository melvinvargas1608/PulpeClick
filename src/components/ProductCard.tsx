import { type KeyboardEvent } from 'react';
import CartQuantityButton from './CartQuantityButton';
import { formatPrice } from '../lib/format';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  original_price: number | null;
  image_url: string | null;
  categories?: { name: string } | null;
  category_id?: string | null;
}

interface Props {
  product: Product;
  currency: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({ product, currency, isNew = false, isBestSeller = false, onProductClick }: Props) {
  const handleOpen = () => onProductClick?.(product);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {product.image_url && (
        <div
          className="relative aspect-square w-full overflow-hidden p-2 group bg-gray-50 cursor-pointer"
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`Ver detalle de ${product.name}`}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {isBestSeller && (
            <span className="absolute top-2 left-2 bg-hot text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Más vendido
            </span>
          )}
          {isNew && (
            <span className="absolute top-2 right-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Nuevo
            </span>
          )}
        </div>
      )}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-gray-900 mb-1 line-clamp-3 cursor-pointer hover:text-brand transition-colors"
              onClick={handleOpen}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              {product.name}
            </h3>
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-gray-100 space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-hot">
              {formatPrice(product.price, currency)}
            </span>
            {product.original_price != null && product.original_price > (product.price ?? 0) && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.original_price, currency)}
              </span>
            )}
          </div>
          <CartQuantityButton
            productId={product.id}
            productName={product.name}
            price={product.price || 0}
            imageUrl={product.image_url}
          />
        </div>
      </div>
    </div>
  );
}
