import type { ChangeEvent } from 'react';

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
}

export default function CatalogFilters({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: Props) {
  return (
    <div className="flex-1 flex items-center gap-0 min-w-0">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 px-1 py-2 border border-gray-600 rounded-l-lg text-sm bg-gray-800 text-white focus:ring-2 focus:ring-hot focus:border-hot outline-none shrink-0 max-w-16 sm:max-w-24 truncate"
        aria-label="Filtrar por categoría"
      >
        <option value="">Todas</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex flex-1 min-w-0 items-stretch">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            placeholder="Buscar en el catálogo"
            className="w-full h-10 pl-3 pr-3 py-2 border border-gray-600 border-l-0 rounded-none text-sm bg-white text-gray-900 focus:ring-2 focus:ring-hot focus:border-hot outline-none"
            aria-label="Buscar productos"
          />
        </div>
        <button
          type="button"
          className="h-10 w-11 shrink-0 flex items-center justify-center bg-hot hover:bg-hot-dark text-white rounded-r-lg transition-colors"
          aria-label="Buscar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>
  );
}
