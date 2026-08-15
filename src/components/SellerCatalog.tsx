import { useEffect, useState } from 'react';
import CartProvider from './CartProvider';
import CartNavbar from './CartNavbar';
import CartDrawer from './CartDrawer';
import ProductDetailModal from './ProductDetailModal';
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
  newProductIds: string[];
  bestSellerIds: string[];
  categories: Category[];
}

function SellerCatalogContent({ sellerName, sellerId, whatsappUrl, bannerUrl, country, products, newProductIds, bestSellerIds, categories }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const PRODUCTS_PER_PAGE = 20;

  const filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Keep current page in range if results shrink
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const hasActiveFilters = selectedCategory !== '' || searchQuery !== '';

  const newProductIdSet = new Set(newProductIds);
  const bestSellerIdSet = new Set(bestSellerIds);

  const currency = getCurrencySymbol(country);

  const whatsappMessage = '¡Hola! Vi tu catálogo en PulpeClick. Quiero hacer una consulta.';

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeProduct = () => {
    setModalOpen(false);
  };

  // Clear the selected product once the closing animation finishes
  useEffect(() => {
    if (!modalOpen && selectedProduct) {
      const t = setTimeout(() => setSelectedProduct(null), 300);
      return () => clearTimeout(t);
    }
  }, [modalOpen, selectedProduct]);

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isNew={newProductIdSet.has(product.id)}
                  isBestSeller={bestSellerIdSet.has(product.id)}
                  onProductClick={openProduct}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      page === currentPage
                        ? 'bg-brand text-white'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : hasActiveFilters ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 text-sm">
              No se encontraron productos con esos filtros.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 text-sm">
              Este vendedor aún no tiene productos publicados. ¡Volvé pronto!
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

      <ProductDetailModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={closeProduct}
        currency={currency}
      />
    </>
  );
}

export default function SellerCatalog({ sellerName, sellerId, whatsappUrl, bannerUrl, country, products, newProductIds, bestSellerIds, categories }: Props) {
  return (
    <CartProvider>
      <SellerCatalogContent
        sellerName={sellerName}
        sellerId={sellerId}
        whatsappUrl={whatsappUrl}
        bannerUrl={bannerUrl}
        country={country}
        products={products}
        newProductIds={newProductIds}
        bestSellerIds={bestSellerIds}
        categories={categories}
      />
    </CartProvider>
  );
}
