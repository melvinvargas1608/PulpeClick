import { useState, useEffect, type FormEvent } from 'react';
import { supabaseClient } from '../lib/supabase-client';
import { uploadProductImage, deleteProductImage } from '../lib/storage';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import ConfirmDialog from './ui/ConfirmDialog';
import SellerBanner from './SellerBanner';
import ProductBasicFields from './ProductBasicFields';

interface SellerInfo {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  editId: string;
}

export default function ProductEditForm({ editId }: Props) {
  // Seller info
  const [sellerSlug, setSellerSlug] = useState('');
  const [seller, setSeller] = useState<SellerInfo | null>(null);

  // Form state
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [formError, setFormError] = useState('');

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Loading state
  const [editLoading, setEditLoading] = useState(false);
  const [editLoadError, setEditLoadError] = useState('');

  // Load product for editing
  useEffect(() => {
    setEditLoading(true);
    setEditLoadError('');

    const loadProduct = async () => {
      const { data: product, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('id', editId)
        .single();

      if (error || !product) {
        setEditLoadError('Producto no encontrado.');
        setEditLoading(false);
        return;
      }

      // Populate form fields
      setProductName(product.name);
      setCategoryId(product.category_id || '');
      setPrice(product.price != null ? product.price.toString() : '');
      setOriginalPrice(product.original_price != null ? product.original_price.toString() : '');
      setProductDetails(product.details || '');
      setOldImageUrl(product.image_url);
      setImagePreview(product.image_url);
      setIsAvailable(product.is_available !== false);

      // Fetch seller info
      const { data: sellerData } = await supabaseClient
        .from('sellers')
        .select('id, name, slug')
        .eq('id', product.seller_id)
        .single();

      if (sellerData) {
        setSeller(sellerData);
        setSellerSlug(sellerData.slug);
      }

      setEditLoading(false);
    };

    loadProduct();
  }, [editId]);

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
    setFormError('');
    if (!file && !preview) {
      setOldImageUrl(null);
    }
  };

  // Save changes
  const handleEditSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setSaveError('');

    if (!productName.trim()) {
      setFormError('El nombre del producto es obligatorio');
      return;
    }

    if (originalPrice && price && parseFloat(originalPrice) <= parseFloat(price)) {
      setFormError('El precio original debe ser mayor que el precio actual.');
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = oldImageUrl;

      // If user selected a new image, upload it and delete old one
      if (imageFile) {
        const newUrl = await uploadProductImage(imageFile, sellerSlug);
        if (newUrl) {
          if (oldImageUrl) {
            await deleteProductImage(oldImageUrl);
          }
          finalImageUrl = newUrl;
        }
      } else if (imagePreview === null && oldImageUrl) {
        // User removed the image
        await deleteProductImage(oldImageUrl);
        finalImageUrl = null;
      }

      const { error } = await supabaseClient
        .from('products')
        .update({
          name: productName.trim(),
          category_id: categoryId || null,
          price: price ? parseFloat(price) : null,
          original_price: originalPrice ? parseFloat(originalPrice) : null,
          details: productDetails.trim() || null,
          image_url: finalImageUrl,
          is_available: isAvailable,
        })
        .eq('id', editId);

      if (error) throw error;

      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Error al guardar los cambios'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    setShowDeleteDialog(false);
    setDeleting(true);
    setSaveError('');

    try {
      const res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: editId }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al eliminar');
      }

      window.location.href = '/admin';
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Error al eliminar el producto'
      );
      setDeleting(false);
    }
  };

  // ---- RENDER ----

  if (editLoading) {
    return <Spinner />;
  }

  if (editLoadError) {
    return (
      <Alert variant="warning">
        <p className="mb-3">{editLoadError}</p>
        <a
          href="/admin"
          className="inline-block text-brand text-sm font-medium hover:underline"
        >
          ← Volver al panel
        </a>
      </Alert>
    );
  }

  return (
    <>
      {seller && <SellerBanner sellerName={seller.name} action="Editando producto de" />}

      <form onSubmit={handleEditSave} className="space-y-4">
        <ProductBasicFields
          productName={productName}
          categoryId={categoryId}
          price={price}
          originalPrice={originalPrice}
          productDetails={productDetails}
          imagePreview={imagePreview}
          isAvailable={isAvailable}
          onNameChange={setProductName}
          onCategoryChange={setCategoryId}
          onPriceChange={setPrice}
          onOriginalPriceChange={setOriginalPrice}
          onDetailsChange={setProductDetails}
          onImageChange={handleImageChange}
          onAvailabilityChange={setIsAvailable}
          disabled={saving}
          showPriceHint={false}
        />

        {formError && <Alert variant="error">{formError}</Alert>}
        {saveError && <Alert variant="error">{saveError}</Alert>}

        {saved ? (
          <Alert variant="success">
            <p className="mb-3 font-semibold">✅ Cambios guardados exitosamente</p>
            <a
              href="/admin"
              className="inline-block bg-brand text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-brand-dark transition-colors"
            >
              Volver al panel
            </a>
          </Alert>
        ) : (
          <div className="space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand hover:bg-brand-dark disabled:bg-brand-light text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-11"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-11"
            >
              {deleting ? 'Eliminando...' : 'Eliminar producto'}
            </button>
          </div>
        )}
      </form>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        loading={deleting}
      />
    </>
  );
}
