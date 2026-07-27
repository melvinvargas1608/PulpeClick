-- Add is_active flag to sellers for catalog visibility control
ALTER TABLE sellers ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Index for active seller queries (catalog page filters on this)
CREATE INDEX idx_sellers_is_active ON sellers(is_active);
