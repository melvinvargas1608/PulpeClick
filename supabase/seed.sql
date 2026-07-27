-- Test client
INSERT INTO clients (name, phone, whatsapp_url, slug) VALUES
  ('María García', '+504 1234-5678', 'https://wa.me/50412345678', 'maria-garcia'),
  ('Carlos López', '+504 8765-4321', 'https://wa.me/50487654321', 'carlos-lopez');

-- Test products
INSERT INTO products (client_id, name, description, price, category) 
SELECT id, 'Mochila Escolar', 'Mochila resistente ideal para estudiantes', 350.00, 'Útiles Escolares'
FROM clients WHERE slug = 'maria-garcia';

INSERT INTO products (client_id, name, description, price, category) 
SELECT id, 'Lapiceros de Colores', 'Set de 12 lapiceros de gel', 120.00, 'Útiles Escolares'
FROM clients WHERE slug = 'maria-garcia';

INSERT INTO products (client_id, name, description, price, category) 
SELECT id, 'Torta de Chocolate', 'Torta casera para cumpleaños', 250.00, 'Repostería'
FROM clients WHERE slug = 'carlos-lopez';
