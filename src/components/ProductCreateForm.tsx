import { useState, useEffect, type FormEvent } from 'react';
import { supabaseClient } from '../lib/supabase-client';
import { uploadProductImage } from '../lib/storage';
import { useCategories } from '../lib/useCategories';
import PostImageGenerator from './PostImageGenerator';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import EmptyState from './ui/EmptyState';
import SellerBanner from './SellerBanner';
import ProductBasicFields from './ProductBasicFields';

interface SellerInfo {
  id: string;
  name: string;
  slug: string;
}

export default function ProductCreateForm() {
  // Seller (loaded from URL params)
  const [sellerSlug, setSellerSlug] = useState('');
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);
  const [sellerError, setSellerError] = useState('');

  // Step 1 form state
  const [step, setStep] = useState<1 | 2>(1);
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // AI generation state
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const categories = useCategories();

  // Load seller from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('client') || '';
    setSellerSlug(slug);

    if (!slug) {
      setSellerError('No se especificó un vendedor. Volvé y seleccioná uno.');
      setLoadingSeller(false);
      return;
    }

    fetchSeller(slug);
  }, []);

  const fetchSeller = async (slug: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('sellers')
        .select('id, name, slug')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setSellerError('Vendedor no encontrado. Verificá el enlace.');
        setLoadingSeller(false);
        return;
      }

      setSeller(data);
      setLoadingSeller(false);
    } catch (err) {
      console.error('Error al cargar vendedor:', err);
      setSellerError('Error al cargar el vendedor. Verificá tu conexión.');
      setLoadingSeller(false);
    }
  };

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
    setFormError('');
  };

  // Step 1 submit: generate AI content
  const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setGenError('');

    if (!productName.trim()) {
      setFormError('El nombre del producto es obligatorio');
      return;
    }

    setGenerating(true);
    setStep(2);

    const categoryName = categoryId
      ? categories.find((c) => c.id === categoryId)?.name || 'General'
      : 'General';

    try {
      // A: Upload image (parallel, non-blocking)
      const imagePromise = imageFile ? uploadProductImage(imageFile, sellerSlug) : Promise.resolve(null);

      // B: Generate description FIRST
      const descResponse = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          category: categoryName,
          price: price ? parseFloat(price) : undefined,
          details: productDetails.trim() || undefined,
        }),
      });
      const descData = await descResponse.json();

      if (descData.error) {
        throw new Error('La IA no pudo generar la descripción. Verificá tu conexión.');
      }

      const generatedDescription = descData.description || '';
      setDescription(generatedDescription);

      // C: Generate price and upload image IN PARALLEL
      const [priceResult, imageUrl] = await Promise.allSettled([
        price
          ? Promise.resolve({ price: parseFloat(price) })
          : fetch('/api/suggest-price', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productName: productName.trim(),
                category: categoryName,
                description: generatedDescription,
              }),
            }).then((r) => r.json()),

        imagePromise,
      ]);

      if (priceResult.status === 'fulfilled' && !priceResult.value.error) {
        setSuggestedPrice(priceResult.value.price || null);
      }

      if (imageUrl.status === 'fulfilled' && imageUrl.value) {
        sessionStorage.setItem(`product-image-${productName.trim()}`, imageUrl.value);
        setUploadedImageUrl(imageUrl.value);
      }
    } catch (err) {
      if (err instanceof Error) {
        setGenError(err.message);
      } else {
        setGenError('Ocurrió un error al generar el contenido. Intentá de nuevo.');
      }
    } finally {
      setGenerating(false);
    }
  };

  // Save product to Supabase
  const handleSave = async () => {
    if (!seller) return;

    if (!description) {
      setSaveError('Primero generá el contenido con IA antes de guardar.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const imageUrl = sessionStorage.getItem(`product-image-${productName.trim()}`) || null;

      const { data: productData, error: productError } = await supabaseClient
        .from('products')
        .insert({
          seller_id: seller.id,
          name: productName.trim(),
          description: description || null,
          price: suggestedPrice || null,
          category_id: categoryId || null,
          image_url: imageUrl,
          details: productDetails.trim() || null,
        })
        .select('id')
        .single();

      if (productError || !productData) {
        throw new Error(productError?.message || 'Error al guardar el producto');
      }

      setSaved(true);
      sessionStorage.removeItem(`product-image-${productName.trim()}`);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Error al guardar el producto'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleNewProduct = () => {
    setStep(1);
    setProductName('');
    setCategoryId('');
    setPrice('');
    setProductDetails('');
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setDescription('');
    setSuggestedPrice(null);
    setSaved(false);
    setSaveError('');
    setGenError('');
    setFormError('');
  };

  // ---- RENDER ----

  if (loadingSeller) {
    return <Spinner />;
  }

  if (sellerError) {
    return (
      <EmptyState message={sellerError}>
        <a
          href="/admin/vendedores"
          className="inline-block text-brand text-sm font-medium hover:underline mt-2"
        >
          ← Volver a vendedores
        </a>
      </EmptyState>
    );
  }

  // Step 1: Product form
  if (step === 1) {
    return (
      <>
        {seller && <SellerBanner sellerName={seller.name} action="Agregando producto para" />}

        <form onSubmit={handleGenerate} className="space-y-4">
          <ProductBasicFields
            productName={productName}
            categoryId={categoryId}
            price={price}
            productDetails={productDetails}
            imagePreview={imagePreview}
            onNameChange={setProductName}
            onCategoryChange={setCategoryId}
            onPriceChange={setPrice}
            onDetailsChange={setProductDetails}
            onImageChange={handleImageChange}
            disabled={generating}
            showPriceHint
          />

          {formError && <Alert variant="error">{formError}</Alert>}

          <button
            type="submit"
            disabled={generating}
            className="w-full bg-brand hover:bg-brand-dark disabled:bg-brand-light text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-11"
          >
            {generating ? 'Generando...' : 'Generar Contenido con IA ✨'}
          </button>
        </form>
      </>
    );
  }

  // Step 2: AI Results & Save
  return (
    <div className="space-y-6">
      {seller && <SellerBanner sellerName={seller.name} action="Producto para" />}

      {generating && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center space-y-3">
          <div className="animate-spin h-12 w-12 border-2 border-brand border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600 text-sm">
            La IA está generando el contenido para <strong>{productName}</strong>...
          </p>
          <p className="text-xs text-gray-400">
            Esto puede tomar unos segundos
          </p>
        </div>
      )}

      {genError && (
        <Alert variant="error">
          <p>{genError}</p>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setGenError('');
            }}
            className="mt-2 text-brand underline text-sm"
          >
            Volver e intentar de nuevo
          </button>
        </Alert>
      )}

      {!generating && !genError && (
        <>
          {/* Product summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{productName}</h3>
            {categoryId && (
              <span className="inline-block bg-brand-light text-brand text-xs px-2 py-0.5 rounded-full mb-2">
                {categories.find((c) => c.id === categoryId)?.name}
              </span>
            )}
            {suggestedPrice && (
              <p className="text-xl font-bold text-hot mt-2">
                L {suggestedPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Descripción
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Post Image Generator */}
          {description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">📱 Imagen para WhatsApp</h3>
              <PostImageGenerator
                productName={productName}
                price={(suggestedPrice ?? Number(price)) || 0}
                imageUrl={uploadedImageUrl || undefined}
                postText=""
                description={description}
                sellerName={seller?.name}
              />
            </div>
          )}

          {saveError && <Alert variant="error">{saveError}</Alert>}

          {saved ? (
            <Alert variant="success">
              <p className="mb-3 font-semibold">✅ Producto guardado exitosamente</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleNewProduct}
                  className="bg-brand text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-brand-dark transition-colors"
                >
                  Agregar otro producto
                </button>
                <a
                  href={`/catalogo/${sellerSlug}`}
                  className="bg-gray-100 text-gray-700 text-sm font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors inline-block"
                >
                  Ver catálogo
                </a>
              </div>
            </Alert>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-brand hover:bg-brand-dark disabled:bg-brand-light text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-11"
              >
                {saving ? 'Guardando...' : '💾 Guardar Producto'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setGenError('');
                }}
                disabled={saving}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors min-h-11"
              >
                ← Volver y editar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
