-- Add availability flag to products (disponible/agotado)
ALTER TABLE products
ADD COLUMN is_available BOOLEAN DEFAULT true;
