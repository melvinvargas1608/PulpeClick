import { useState } from 'react';
import CartProvider from './CartProvider';
import CartNavbar from './CartNavbar';
import CartDrawer from './CartDrawer';
import WhatsAppIcon from './icons/WhatsAppIcon';
import ProductCard, { type Product } from './ProductCard';
import { getCurrencySymbol } from '../lib/countryFlags';

interface Category {
  id: string;
  name: string;
}

interface Props {
  sellerName: string;
  sellerId: string;
  whatsappUrl: string;
  bannerUrl?: string | null;
  country: string;
  products: Product[];
  newProducts: Product[];
  bestSellers: Product[];
  categories: Category[];
}

function SellerCatalogContent({ sellerName, sellerId, whatsappUrl, bannerUrl, country, products, newProducts, bestSellers, categories }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hasActiveFilters = selectedCategory !== '' || searchQuery !== '';

  const currency = getCurrencySymbol(country);

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
        country={country}
      />

      <div className="max-w-7xl mx-auto px-2 py-6">
        {/* Banner de la tienda */}
        {bannerUrl ? (
          <div className="rounded-2xl overflow-hidden mb-6 h-48 sm:h-64">
            <img
              src={bannerUrl}
              alt={sellerName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden mb-6 h-48 sm:h-64">
            <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-dark" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-center">{sellerName}</h1>
              <p className="text-sm text-white/80 mt-1">Catálogo de productos</p>
            </div>
          </div>
        )}

        {/* Novedades — carrusel horizontal de productos recientes */}
        {newProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Lo más nuevo</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-2 px-2">
              {newProducts.map((product) => (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-56 sm:w-64"
                >
                  <ProductCard product={product} currency={currency} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Destacados — top más vendidos */}
        {bestSellers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Los más vendidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} currency={currency} />
              ))}
            </div>
          </section>
        )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} currency={currency} />
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
        currency={currency}
      />
    </>
  );
}

export default function SellerCatalog({ sellerName, sellerId, whatsappUrl, bannerUrl, country, products, newProducts, bestSellers, categories }: Props) {
  return (
    <CartProvider>
      <SellerCatalogContent
        sellerName={sellerName}
        sellerId={sellerId}
        whatsappUrl={whatsappUrl}
        bannerUrl={bannerUrl}
        country={country}
        products={products}
        newProducts={newProducts}
        bestSellers={bestSellers}
        categories={categories}
      />
    </CartProvider>
  );
}
