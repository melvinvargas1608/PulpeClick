-- Add optional original price for discount/offer display
ALTER TABLE products
ADD COLUMN original_price NUMERIC DEFAULT NULL;
