import CatalogFilters from './CatalogFilters';
import CartButton from './CartButton';

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
}

export default function CartNavbar({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onCartClick,
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

        <CartButton onClick={onCartClick} />
      </div>
    </nav>
  );
}
