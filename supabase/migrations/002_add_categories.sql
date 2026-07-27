-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
