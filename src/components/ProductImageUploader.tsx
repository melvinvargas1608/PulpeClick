import { useState, useId, type ChangeEvent } from 'react';

interface Props {
  imagePreview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

export default function ProductImageUploader({ imagePreview, onImageChange, disabled }: Props) {
  const inputId = useId();
  const [error, setError] = useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato de imagen no válido. Usá JPG, PNG, WebP o GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange(null, null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Imagen del producto
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-brand/40 transition-colors">
        {imagePreview ? (
          <div className="space-y-3">
            <img
              src={imagePreview}
              alt="Vista previa"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Quitar imagen
            </button>
          </div>
        ) : (
          <>
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              disabled={disabled}
            />
            <label
              htmlFor={inputId}
              className="cursor-pointer block py-4"
            >
              <p className="text-gray-500 text-sm">📸 Tocá para seleccionar una imagen</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP o GIF (máx. 5MB)</p>
              <p className="text-xs text-amber-600 mt-1">⚠️ Recomendación: usá imágenes cuadradas (1:1) para que se vean mejor en el catálogo</p>
            </label>
          </>
        )}
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
