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
  is_available?: boolean;
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
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  const isAvailable = product.is_available !== false;
  const hasDiscount =
    product.original_price != null &&
    product.price != null &&
    product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price!) / product.original_price!) * 100)
    : 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Ver detalle de ${product.name}`}
    >
      {product.image_url && (
        <div className="relative aspect-square w-full overflow-hidden p-2 bg-gray-50">
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover rounded-md ${isAvailable ? '' : 'grayscale opacity-60'}`}
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
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-3">
              {product.name}
            </h3>
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl font-bold text-hot whitespace-nowrap">
                {formatPrice(product.price, currency)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through whitespace-nowrap">
                  {formatPrice(product.original_price, currency)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-xs font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full shrink-0">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full shrink-0 ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className={`text-xs ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
              {isAvailable ? 'En stock' : 'Agotado'}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <CartQuantityButton
              productId={product.id}
              productName={product.name}
              price={product.price || 0}
              imageUrl={product.image_url}
              isAvailable={isAvailable}
            />
          </div>

          <p className="text-xs text-gray-400 text-center">Más detalle →</p>
        </div>
      </div>
    </div>
  );
}
