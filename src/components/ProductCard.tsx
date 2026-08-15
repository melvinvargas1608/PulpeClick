import CartQuantityButton from './CartQuantityButton';
import { formatPrice } from '../lib/format';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  categories?: { name: string } | null;
  category_id?: string | null;
}

interface Props {
  product: Product;
  currency: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function ProductCard({ product, currency, isNew = false, isBestSeller = false }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {product.image_url && (
        <div className="relative aspect-square w-full overflow-hidden p-3 group bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
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
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate">
              {product.name}
            </h3>
            {product.categories?.name && (
              <span className="inline-block bg-brand-light text-brand text-xs px-2 py-0.5 rounded-full mb-2">
                {product.categories.name}
              </span>
            )}
            {product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {product.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-hot">
            {formatPrice(product.price, currency)}
          </span>
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
