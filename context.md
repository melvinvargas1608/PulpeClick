# PulpeClick — Contexto del Proyecto

## ¿Qué es?

Servicio de **catálogos digitales con IA** para emprendedores de Honduras que venden por WhatsApp.

## ¿Quién lo usa?

- **Administrador**: vos, que operás el panel y generás contenido para los vendedores.
- **Vendedores emprendedores**: reciben su catálogo digital listo para WhatsApp.
- **Compradores**: ven el catálogo público, agregan productos al carrito y envían pedidos por WhatsApp.

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Astro (SSR) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (mobile-first) |
| Base de datos | Supabase (PostgreSQL) con tipos generados |
| Almacenamiento | Supabase Storage (bucket `products`) |
| Autenticación admin | Cookie `admin_auth` + PIN en .env |
| IA | Gemini API (`gemini-3.5-flash-lite`) |
| Hosting | Vercel |
| Package manager | pnpm 11.1.1 |

## Base de datos (Supabase)

### Tablas

- **sellers**: vendedores registrados (name, phone, whatsapp_url, slug) — antes llamada `clients`
- **products**: productos cargados (seller_id, name, description, price, image_url, category_id, details)
- **categories**: categorías de productos (name)
- **customers**: compradores (name, phone)
- **orders**: pedidos (seller_id, customer_id, customer_name, customer_phone, total_amount, status)
- **order_items**: ítems del pedido (order_id, product_id, product_name, quantity, unit_price, subtotal)

### Relaciones clave

- `products.seller_id` → `sellers.id`
- `products.category_id` → `categories.id`
- `orders.seller_id` → `sellers.id`
- `orders.customer_id` → `customers.id`

### RLS

- Lectura pública en todas las tablas
- Inserción pública en `orders`, `order_items`, `customers`
- Escritura total (admin)

### Migraciones

- `001_initial_schema.sql` — clients (ahora sellers), products, posts, RLS, storage
- `002_add_categories.sql` — tabla categories + RLS
- `003_add_product_details.sql` — columna details en products
- `004_add_orders.sql` — orders + order_items + RLS
- `005_refactor_sellers_customers.sql` — clients→sellers, category_id FK, customers, orders.customer_id, elimina posts.image_url
- `007_remove_posts_table.sql` — elimina tabla posts

### Storage

- Bucket `products` — público, políticas lectura pública + escritura admin

## Funcionalidades

### Panel Admin (`/admin`)

- **AdminLayout.astro**: layout compartido con auth check, header "← Volver" + "Cerrar sesión", y slot de contenido. Todas las páginas admin lo usan excepto login/logout y el index (que tiene layout especial).
- **Nuevo Vendedor**: `/admin/nuevo-vendedor` — SellerForm.tsx
- **Vendedores**: `/admin/vendedores` — SellerList.tsx con "Ver catálogo", "Ver productos", "+ Producto", "Editar"
- **Productos**: `/admin/productos?seller=SLUG` — lista de productos con editar/eliminar
- **Agregar Producto**: `/admin/nuevo-producto` — SelectSeller → ProductCreateForm (wizard IA)
- **Editar Producto**: `/admin/editar-producto?id=UUID` — ProductEditForm
- **Eliminar Producto**: confirmación → `/api/delete-product` → elimina producto, imagen, cascada
- **Categorías**: `/admin/categorias` — CategoryManager.tsx (CRUD inline)

### Generación con IA

1. Admin sube producto: nombre, categoría (UUID FK), detalles, precio opcional, foto
2. Gemini genera: descripción (100 palabras, tono factual) + precio sugerido (si no se especificó)
3. Se guarda en `products` con `category_id` (FK) y `details`
4. Se genera tarjeta PNG descargable (PostImageGenerator) con descripción generada

### Catálogo Público (`/catalogo/[slug]`)

- SSR: fetch seller + products + categorías del vendedor
- **Navbar**: logo "PulpeClick" + CatalogFilters (dropdown categorías + buscador) + CartButton
- Filtros combinados: categoría + nombre. "Limpiar filtros" + contador de resultados
- Header tipo perfil: nombre del vendedor + "Catálogo de productos"
- Grid responsive: 1/2/4 columnas, images 1:1 con object-cover
- CartQuantityButton por producto
- Botón flotante WhatsApp (abajo derecha) para contactar al vendedor
- Footer: "Catálogo creado con PulpeClick"

### Carrito y Pedidos

- **CartProvider**: React Context + localStorage (`pulpeclick-cart`)
- **CartDrawer**: panel lateral con productos, cantidades, total + formulario checkout inline
- Checkout validaciones: nombre (solo letras, min 3), teléfono (dígitos/+-()/espacios, min 8)
- **useCheckout hook**: lógica de checkout extraída (find-or-create customer, insert order/items, WhatsApp message)
- Mensaje WhatsApp: sin emojis, formato `*negrita*`, `encodeURIComponent`

### Tarjeta WhatsApp

- Cuadrada 1:1 (320px/400px), object-contain
- Nombre, descripción IA, precio, footer
- Descargable como PNG (html-to-image)

### API Endpoints

- `/api/generate-description` — Gemini: descripción de producto
- `/api/suggest-price` — Gemini: precio sugerido
- `/api/verify-pin` — verifica PIN admin
- `/api/delete-product` — elimina producto + imagen storage

## Estructura de archivos

```
src/
├── components/
│   ├── ui/                    # Componentes compartidos
│   │   ├── Spinner.tsx        # Spinner de carga (sm/md/lg)
│   │   ├── Alert.tsx          # Alertas (error/warning/success)
│   │   └── EmptyState.tsx     # Estado vacío con CTA opcional
│   ├── CartButton.tsx         # Botón carrito con badge
│   ├── CartDrawer.tsx         # Panel lateral + checkout (usa useCheckout)
│   ├── CartNavbar.tsx         # Navbar: logo + CatalogFilters + CartButton
│   ├── CartProvider.tsx       # Contexto React carrito (localStorage)
│   ├── CartQuantityButton.tsx # Botón agregar/cantidad en productos
│   ├── CatalogFilters.tsx     # Dropdown categorías + buscador
│   ├── CategoryManager.tsx    # CRUD de categorías
│   ├── DeleteProductButton.tsx # Botón eliminar con ConfirmDialog
│   ├── PostImageGenerator.tsx # Tarjeta WhatsApp descargable
│   ├── ProductCreateForm.tsx  # Wizard crear producto (2 pasos + IA)
│   ├── ProductEditForm.tsx    # Formulario editar producto
│   ├── ProductForm.tsx        # Wrapper: elige create/edit según editId
│   ├── ProductImageUploader.tsx # Upload de imagen reutilizable
│   ├── SellerCatalog.tsx      # Catálogo completo (filtros, grid, WhatsApp)
│   ├── SellerForm.tsx         # Formulario crear/editar vendedor
│   ├── SellerList.tsx         # Lista de vendedores
│   └── SelectSeller.tsx       # Selector de vendedor
├── layouts/
│   ├── Layout.astro           # Layout base (HTML, meta, footer)
│   └── AdminLayout.astro      # Layout admin (auth check, header común)
├── lib/
│   ├── gemini.ts              # Cliente Gemini + prompts + parseGeminiResponse
│   ├── phone.ts               # stripNonDigits, formatPhone, buildWhatsAppUrl, validatePhone
│   ├── slug.ts                # generateSlug
│   ├── storage.ts             # deleteProductImage
│   ├── supabase.ts            # Cliente Supabase server (service role, tipado)
│   ├── supabase-client.ts     # Cliente Supabase browser (anon key, tipado)
│   └── useCheckout.ts         # Hook de checkout (customer, order, WhatsApp)
├── types/
│   └── database.ts            # Tipos Database de Supabase (6 tablas)
├── pages/
│   ├── catalogo/[slug].astro  # Catálogo público (SSR)
│   ├── index.astro            # Landing page
│   ├── admin/
│   │   ├── index.astro, login.astro, logout.astro
│   │   ├── vendedores.astro, nuevo-vendedor.astro
│   │   ├── nuevo-producto.astro, productos.astro, editar-producto.astro
│   │   └── categorias.astro
│   └── api/
│       ├── generate-description.ts, suggest-price.ts
│       ├── verify-pin.ts, delete-product.ts
└── styles/
    └── global.css             # Tailwind v4 base
```

## Variables de entorno (`.env`)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
PUBLIC_APP_URL=
ADMIN_PIN=
```

## Comandos

```bash
pnpm run dev          # Desarrollo
pnpm run build        # Build para producción
```

## Aprendizajes del desarrollo

1. **Gemini API**: `gemini-2.5-flash` no disponible. Usar `gemini-3.5-flash-lite`. Respuesta tipada con `parseGeminiResponse`.
2. **Auth**: Cookie-based en Astro. AdminLayout centraliza el auth check.
3. **Imágenes**: `object-cover` en catálogo, `object-contain` en tarjeta WhatsApp. Recomendación: subir 1:1.
4. **Tailwind v4**: `@import "tailwindcss"` en CSS. Clases arbitrarias con `w-[320px]`.
5. **Prompts**: Español neutro, tono Amazon factual. Audiencia: "compradores en Honduras".
6. **pnpm**: v11.1.1. Requiere `pnpm approve-builds esbuild`.
7. **Mensajes WhatsApp**: Sin emojis (rompen URL). Formato `*negrita*`, `encodeURIComponent`.
8. **Carrito**: Context + localStorage (`pulpeclick-cart`). Errores siempre salen del spinner con try/catch.
9. **Navbar**: No fija, `h-20`. Logo `text-xl sm:text-2xl`. Badge siempre visible (incluye 0).
10. **Validaciones**: nombre solo letras, teléfono dígitos/+-()/espacios. Honduras +504.
11. **Refactor sellers/customers**: `clients`→`sellers`, tabla `customers` para compradores. `category` TEXT→`category_id` FK.
12. **Supabase tipado**: `src/types/database.ts` con 6 tablas. Clientes `createClient<Database>()`. Cero `any`.
13. **ProductForm dividido**: 1 componente de 1000 líneas → 4 componentes (ProductForm wrapper, ProductCreateForm, ProductEditForm, ProductImageUploader).
14. **Checkout extraído**: `useCheckout` hook con find-or-create customer, insert order/items, WhatsApp message.
15. **Componentes UI**: Spinner, Alert, EmptyState compartidos. AdminLayout para páginas admin.
16. **Utilidades**: `lib/phone.ts`, `lib/slug.ts`, `lib/storage.ts` evitan duplicación.
17. **'use client' en Astro**: No usar `'use client'` en componentes React cuando se usa `client:load` en las páginas `.astro`. Causa que el componente no se hidrate. Solo se necesita uno de los dos.
18. **ConfirmDialog**: Modal de confirmación reutilizable (eliminar producto, eliminar categoría). Reemplaza `window.confirm()` en todos lados. Responsive, cierra al hacer clic fuera, loading state.
19. **Íconos consistentes**: Lápiz SVG (no emoji ✏️) para editar, basurero SVG para eliminar. Mismos íconos en categorías, productos y vendedores.
20. **PIN seguro**: `lib/pin.ts` con `isValidPin()`. Requisitos: >8 caracteres, 1 mayúscula, 1 número, 1 carácter especial. Login ya no fuerza solo números. Default: `Admin123!`.

## Próximos pasos

- Deploy a Vercel con el nombre "PulpeClick"
- Ejecutar migraciones 004, 005, 007 en Supabase
- Agregar logo real de PulpeClick (reemplazar texto)
- Probar con vendedores reales
- Posible mejora: eliminación de fondo online + compresión

## Assets visuales requeridos

| Asset | Tamaño | Formato | Uso |
|---|---|---|---|
| `favicon.svg` | 128×128 viewBox | SVG | Favicon principal, adaptativo |
| `favicon.ico` | 32×32 (con 16×16) | ICO | Fallback navegadores antiguos |
| `apple-touch-icon.png` | 180×180 | PNG | iOS / Safari |
| `icon-192.png` | 192×192 | PNG | PWA Android |
| `icon-512.png` | 512×512 | PNG | PWA splash screen |
| `logo.svg` | altura 40px | SVG | Navbar, footer |
| `logo-dark.svg` | altura 40px | SVG | Dark mode |
| `logo-512.png` | 512×512 | PNG | Fallback + OG |
| `og-image.png` | 1200×630 | PNG | WhatsApp / Facebook / LinkedIn |
| `twitter-image.png` | 1200×675 | PNG | Twitter / X |
| Productos (original) | 1200×1200 (1:1) | JPG/WEBP | Subida por vendedor |
| Productos (optimizada) | 600×600 | WEBP | Catálogo |
| WhatsApp card | 1080×1080 | PNG | PostImageGenerator |

### Notas
- `favicon.ico` y `favicon.svg` existen en `public/` pero **no están linkeados en `Layout.astro`**.
- El SVG actual es el favicon por defecto de Astro, debe reemplazarse por el logo de PulpeClick.
- Las imágenes de producto deben ser **1:1 (cuadradas)** para funcionar con `aspect-square` + `object-cover` en las cards.
