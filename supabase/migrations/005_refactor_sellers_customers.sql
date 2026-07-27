-- 1. Renombrar clients a sellers
ALTER TABLE clients RENAME TO sellers;
ALTER INDEX idx_clients_slug RENAME TO idx_sellers_slug;

DROP POLICY IF EXISTS "Public read clients" ON sellers;
DROP POLICY IF EXISTS "Admin full access clients" ON sellers;

CREATE POLICY "Public read sellers" ON sellers FOR SELECT USING (true);
CREATE POLICY "Admin full access sellers" ON sellers FOR ALL USING (true) WITH CHECK (true);

-- 2. Renombrar FK client_id -> seller_id en products
ALTER TABLE products RENAME COLUMN client_id TO seller_id;
ALTER INDEX idx_products_client_id RENAME TO idx_products_seller_id;

-- Renombrar FK client_id -> seller_id en orders
ALTER TABLE orders RENAME COLUMN client_id TO seller_id;
ALTER INDEX idx_orders_client_id RENAME TO idx_orders_seller_id;

-- 3. products.category TEXT -> category_id UUID FK
ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE p.category = c.name;

ALTER TABLE products DROP COLUMN category;
CREATE INDEX idx_products_category_id ON products(category_id);

-- 4. Eliminar posts.image_url (no se usa)
ALTER TABLE posts DROP COLUMN IF EXISTS image_url;

-- 5. Nueva tabla customers (compradores)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access customers" ON customers FOR ALL USING (true) WITH CHECK (true);

-- 6. Vincular orders con customers
ALTER TABLE orders ADD COLUMN customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;

INSERT INTO customers (name, phone)
SELECT DISTINCT customer_name, customer_phone
FROM orders
WHERE customer_name IS NOT NULL AND customer_phone IS NOT NULL;

UPDATE orders o
SET customer_id = c.id
FROM customers c
WHERE o.customer_name = c.name AND o.customer_phone = c.phone;
