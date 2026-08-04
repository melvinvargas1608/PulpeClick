import CatalogFilters from './CatalogFilters';
import CartButton from './CartButton';
import { getCountryFlag } from '../lib/countryFlags';

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  country: string;
}

export default function CartNavbar({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onCartClick,
  country,
}: Props) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-3">
        <a href="/" class="shrink-0" aria-label="PulpeClick — Inicio">
          <img src="/logo-512.png" alt="PulpeClick" class="h-12 w-auto" />
        </a>

        <CatalogFilters
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={onCategoryChange}
          onSearchChange={onSearchChange}
        />

        {country && (
          <span className="hidden sm:inline-flex items-center text-sm text-gray-500 shrink-0" title={country}>
            {getCountryFlag(country)}
          </span>
        )}

        <CartButton onClick={onCartClick} />
      </div>
    </nav>
  );
}
