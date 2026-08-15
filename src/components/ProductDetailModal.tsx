import { useEffect } from 'react';
import { type Product } from './ProductCard';
import { formatPrice } from '../lib/format';
import CartQuantityButton from './CartQuantityButton';
import CloseIcon from './icons/CloseIcon';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

export default function ProductDetailModal({ product, isOpen, onClose, currency }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const hasOffer = product != null && product.original_price != null && product.original_price > (product.price ?? 0);
  const isAvailable = product?.is_available !== false;
  const discountPercent = hasOffer
    ? Math.round(((product!.original_price! - (product!.price ?? 0)) / product!.original_price!) * 100)
    : 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isOpen ? '' : 'pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={product?.name ?? 'Detalle del producto'}
      >
        <div
          className={`relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {product && (
            <>
              {/* Floating close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-md text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
                aria-label="Cerrar"
              >
                <CloseIcon size={20} />
              </button>

              {/* Body — scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center shrink-0">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className={`w-full h-64 sm:h-80 md:h-auto md:max-h-[70vh] object-contain ${isAvailable ? '' : 'grayscale opacity-60'}`}
                      />
                    ) : (
                      <div className="w-full h-64 sm:h-80 flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col">
                    {/* Name */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 pr-8">
                      {product.name}
                    </h2>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                        {product.description}
                      </p>
                    )}

                    {/* Price + Add to cart */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-2xl sm:text-3xl font-bold text-hot">
                          {formatPrice(product.price, currency)}
                        </span>
                        {hasOffer && (
                          <span className="text-base text-gray-400 line-through">
                            {formatPrice(product.original_price, currency)}
                          </span>
                        )}
                        {hasOffer && (
                          <span className="text-sm font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      {hasOffer && (
                        <span className="inline-block bg-hot-light text-hot text-xs font-semibold px-2 py-0.5 rounded-full mb-3">
                          Oferta
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                          {isAvailable ? 'En stock' : 'Agotado'}
                        </span>
                      </div>

                      <CartQuantityButton
                        productId={product.id}
                        productName={product.name}
                        price={product.price || 0}
                        imageUrl={product.image_url}
                        isAvailable={isAvailable}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
