-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients (teachers who sell)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_client_id ON products(client_id);
CREATE INDEX idx_posts_product_id ON posts(product_id);
CREATE INDEX idx_clients_slug ON clients(slug);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: public read for catalog, admin write
CREATE POLICY "Public read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (true);

CREATE POLICY "Admin full access clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access posts" ON posts FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for product images
-- Note: Storage buckets must be created via Supabase dashboard or API.
-- Run this SQL to create the bucket policy after creating bucket "products" in dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Storage policies for products bucket
CREATE POLICY "Public read product images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admin upload product images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admin update product images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'products');

CREATE POLICY "Admin delete product images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'products');
