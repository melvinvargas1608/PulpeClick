import { useState, useId, type ChangeEvent } from 'react';

interface Props {
  imagePreview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
  existingUrl?: string | null;
}

export default function BannerUploader({ imagePreview, onImageChange, disabled, existingUrl }: Props) {
  const inputId = useId();
  const [error, setError] = useState('');
  const [showExisting, setShowExisting] = useState(!!existingUrl && !imagePreview);

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
    setShowExisting(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange(null, null);
    setShowExisting(false);
  };

  const previewUrl = imagePreview || (showExisting ? existingUrl : null);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Banner de la tienda <span className="text-gray-400 font-normal">(opcional)</span>
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-brand/40 transition-colors">
        {previewUrl ? (
          <div className="relative">
            <div className="aspect-[5/1] w-full bg-gray-100">
              <img
                src={previewUrl}
                alt="Vista previa del banner"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              Quitar banner
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
              className="cursor-pointer block py-6 px-4 text-center"
            >
              <p className="text-gray-500 text-sm">📸 Tocá para seleccionar un banner</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP o GIF (máx. 5MB)</p>
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Recomendación: 1920×384px para que se vea bien en todos los dispositivos
              </p>
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
