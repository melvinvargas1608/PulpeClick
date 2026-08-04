import { supabaseClient } from './supabase-client';

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL or null on failure.
 */
export async function uploadProductImage(
  file: File,
  sellerSlug: string,
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${sellerSlug}/${fileName}`;

  const { error } = await supabaseClient.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: urlData } = supabaseClient.storage
    .from('products')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const filePath = extractStoragePath(imageUrl);
    if (filePath) {
      await supabaseClient.storage.from('products').remove([filePath]);
    }
  } catch (err) {
    console.error('Error deleting product image:', err);
  }
}

/**
 * Upload a seller banner image to Supabase Storage (banners bucket).
 * Recommended dimensions: 1920×384px (5:1 ratio).
 * Returns the public URL or null on failure.
 */
export async function uploadBannerImage(
  file: File,
  sellerSlug: string,
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${sellerSlug}/${fileName}`;

  const { error } = await supabaseClient.storage
    .from('banners')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Banner upload error:', error);
    return null;
  }

  const { data: urlData } = supabaseClient.storage
    .from('banners')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Delete a banner image from Supabase Storage by its public URL.
 */
export async function deleteBannerImage(imageUrl: string): Promise<void> {
  try {
    const urlParts = imageUrl.split('/');
    const bannersIdx = urlParts.indexOf('banners');
    if (bannersIdx !== -1) {
      const filePath = urlParts.slice(bannersIdx + 1).join('/');
      if (filePath) {
        await supabaseClient.storage.from('banners').remove([filePath]);
      }
    }
  } catch (err) {
    console.error('Error deleting banner image:', err);
  }
}

/**
 * Extract the storage path from a Supabase public URL.
 * Example: https://xxx.supabase.co/storage/v1/object/public/products/slug/file.jpg → slug/file.jpg
 */
export function extractStoragePath(imageUrl: string): string | null {
  const urlParts = imageUrl.split('/');
  const productIdx = urlParts.indexOf('products');
  if (productIdx !== -1) {
    return urlParts.slice(productIdx + 1).join('/') || null;
  }
  return null;
}
