import { useCategories, type Category } from '../lib/useCategories';
import ProductImageUploader from './ProductImageUploader';

export interface ProductFieldsData {
  productName: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  productDetails: string;
  imagePreview: string | null;
}

interface ProductBasicFieldsProps extends ProductFieldsData {
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onOriginalPriceChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onImageChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
  showPriceHint?: boolean;
}

export default function ProductBasicFields({
  productName,
  categoryId,
  price,
  originalPrice,
  productDetails,
  imagePreview,
  onNameChange,
  onCategoryChange,
  onPriceChange,
  onOriginalPriceChange,
  onDetailsChange,
  onImageChange,
  disabled = false,
  showPriceHint = true,
}: ProductBasicFieldsProps) {
  const categories = useCategories();

  return (
    <>
      {/* Product Name */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del producto *
        </label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none"
          placeholder="Ej: Mochila Escolar"
          required
          disabled={disabled}
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none bg-white"
          disabled={disabled}
        >
          <option value="">Sin categoría</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Product Details */}
      <div>
        <label htmlFor="productDetails" className="block text-sm font-medium text-gray-700 mb-1">
          Detalles del producto <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="productDetails"
          value={productDetails}
          onChange={(e) => onDetailsChange(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none resize-none"
          placeholder="Ejemplo: material, tamaño, color, usos, etc."
          rows={3}
          disabled={disabled}
        />
        <p className="text-xs text-gray-400 mt-1">
          La IA usará estos datos para generar una descripción más precisa
        </p>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Precio (Lempiras)
        </label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none"
          placeholder={showPriceHint ? "Dejá en blanco para que la IA lo sugiera" : "0.00"}
          min="0"
          step="0.01"
          disabled={disabled}
        />
        {showPriceHint && !price && (
          <p className="text-xs text-gray-400 mt-1">
            Si no ponés precio, la IA te sugerirá uno
          </p>
        )}
      </div>

      {/* Original Price */}
      <div>
        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
          Precio original <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          id="originalPrice"
          type="number"
          value={originalPrice}
          onChange={(e) => onOriginalPriceChange(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-brand focus:border-brand outline-none"
          placeholder="Ej: 15000.00"
          min="0"
          step="0.01"
          disabled={disabled}
        />
        <p className="text-xs text-gray-400 mt-1">
          Si querés mostrar una oferta, poné aquí el precio anterior (se mostrará tachado)
        </p>
      </div>

      {/* Image Upload */}
      <ProductImageUploader
        imagePreview={imagePreview}
        onImageChange={onImageChange}
        disabled={disabled}
      />
    </>
  );
}
