import { useState } from 'react';
import CartProvider from './CartProvider';
import CartNavbar from './CartNavbar';
import CartDrawer from './CartDrawer';
import CartQuantityButton from './CartQuantityButton';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { formatPrice } from '../lib/format';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  categories?: { name: string } | null;
  category_id?: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  sellerName: string;
  sellerId: string;
  whatsappUrl: string;
  products: Product[];
  categories: Category[];
}

function SellerCatalogContent({ sellerName, sellerId, whatsappUrl, products, categories }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hasActiveFilters = selectedCategory !== '' || searchQuery !== '';

  const whatsappMessage = '¡Hola! Vi tu catálogo en PulpeClick. Quiero hacer una consulta.';

  return (
    <>
      <CartNavbar
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        onCartClick={() => setDrawerOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-2 py-6">
        {/* Header tipo perfil */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{sellerName}</h1>
          <p className="text-gray-500 text-sm">Catálogo de productos</p>
        </div>

        {/* Resultados de búsqueda */}
        {hasActiveFilters && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="text-sm text-brand hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Productos */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {product.image_url && (
                  <div className="aspect-square w-full overflow-hidden p-3 group">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
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
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xl font-bold text-hot">
                      {formatPrice(product.price)}
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
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 text-sm">
              {hasActiveFilters
                ? 'No se encontraron productos con esos filtros.'
                : 'Este vendedor aún no tiene productos publicados. ¡Volvé pronto!'}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 mb-2">Catálogo creado con PulpeClick</p>
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
      <a
        href={`${whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-40 bg-hot hover:bg-hot-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 px-4 py-3 sm:px-5"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon size={22} />
        <span className="hidden sm:inline text-sm font-semibold">Contactar por WhatsApp</span>
      </a>

      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sellerId={sellerId}
        sellerName={sellerName}
        whatsappUrl={whatsappUrl}
      />
    </>
  );
}

export default function SellerCatalog({ sellerName, sellerId, whatsappUrl, products, categories }: Props) {
  return (
    <CartProvider>
      <SellerCatalogContent
        sellerName={sellerName}
        sellerId={sellerId}
        whatsappUrl={whatsappUrl}
        products={products}
        categories={categories}
      />
    </CartProvider>
  );
}
