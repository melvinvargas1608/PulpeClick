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
    <nav className="bg-navbar border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-3">
        <div className="shrink-0">
          <img src="/logo-blanco-512.png" alt="PulpeClick" className="h-12 w-auto" />
        </div>

        <CatalogFilters
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={onCategoryChange}
          onSearchChange={onSearchChange}
        />

        {country && (
          <span className="inline-flex items-center text-sm text-white shrink-0" title={country}>
            {getCountryFlag(country)}
          </span>
        )}

        <CartButton onClick={onCartClick} />
      </div>
    </nav>
  );
}
