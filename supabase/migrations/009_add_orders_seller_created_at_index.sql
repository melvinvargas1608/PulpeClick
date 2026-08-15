-- Speed up "Más vendido" badge calculation:
-- orders by seller, ordered by created_at (last 30 days window)
CREATE INDEX IF NOT EXISTS idx_orders_seller_created_at
ON orders(seller_id, created_at DESC);
