import { type ChangeEvent } from 'react';
import { useCart } from './CartProvider';
import { useCheckout } from '../lib/useCheckout';
import CloseIcon from './icons/CloseIcon';
import CartIcon from './icons/CartIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  whatsappUrl: string;
}

export default function CartDrawer({ isOpen, onClose, sellerId, sellerName, whatsappUrl }: Props) {
  const { items, removeItem, updateQuantity, itemCount, totalAmount, clearCart } = useCart();

  const { name, phone, errors, loading, submitError, setName, setPhone, handleSubmit } = useCheckout({
    items,
    totalAmount,
    sellerId,
    sellerName,
    whatsappUrl,
    clearCart,
    onClose,
  });

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9+\-()\s]/g, '');
    setPhone(filtered);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
    setName(filtered);
  };

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
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Tu pedido
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Cerrar carrito"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center space-y-4">
              <CartIcon size={48} className="text-gray-300" />
              <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={onClose}
                className="text-brand text-sm font-medium hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-4">
                    {/* Image */}
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        L {item.price.toFixed(2)} c/u
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="text-gray-600 hover:bg-gray-200 px-2 py-0.5 text-sm font-bold transition-colors"
                            aria-label={`Reducir cantidad de ${item.productName}`}
                          >
                            −
                          </button>
                          <span className="text-gray-900 text-sm font-medium min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="text-gray-600 hover:bg-gray-200 px-2 py-0.5 text-sm font-bold transition-colors"
                            aria-label={`Aumentar cantidad de ${item.productName}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            L {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label={`Eliminar ${item.productName}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    L {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout form */}
              <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-3">
                {/* Name */}
                <div>
                  <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className={`w-full px-3 py-3 border rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ej: María López"
                    disabled={loading}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-3 py-3 border rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+504 9999-9999"
                    disabled={loading}
                    autoComplete="tel"
                  />
                  {phone && phone.replace(/\D|^\+/g, '').length > 0 && (
                    <p className="text-gray-400 text-xs mt-1">
                      Se enviará como: {phone.trim()}
                    </p>
                  )}
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Submit error */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {submitError}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-hot hover:bg-hot-dark disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <WhatsAppIcon size={22} />
                      Enviar pedido por WhatsApp
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
