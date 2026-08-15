# PulpeClick — Contexto del Proyecto

## ¿Qué es?

Servicio de **catálogos digitales con IA** para emprendedores de Centroamérica y Latinoamérica que venden por WhatsApp.

## ¿Quién lo usa?

- **Administrador**: vos, que operás el panel y generás contenido para los vendedores.
- **Vendedores emprendedores**: reciben su catálogo digital listo para WhatsApp.
- **Compradores**: ven el catálogo público, agregan productos al carrito y envían pedidos por WhatsApp.

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Astro (SSR) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (mobile-first) con design tokens de marca |
| Tipografía | Inter (Google Fonts) — pesos 400, 500, 600, 700 |
| Base de datos | Supabase (PostgreSQL) con tipos generados |
| Almacenamiento | Supabase Storage (buckets `products`, `banners`) |
| Autenticación admin | Cookie `admin_auth` + PIN en .env |
| IA | Gemini API (`gemini-3.5-flash-lite`) |
| Hosting | Vercel (adapter `@astrojs/vercel`) |
| Package manager | npm (lock file) |

## Design Tokens (marca)

Definidos en `src/styles/global.css` con `@theme` de Tailwind v4.

| Token | Color | Uso |
|---|---|---|
| `brand` | `#17877F` turquesa | Navegación, header, categorías, iconos, botones secundarios |
| `brand-dark` | `#136B65` | Hover de brand |
| `brand-light` | `#E8F5F4` | Fondos sutiles, badges |
| `hot` | `#FF8E00` naranja | Precios, promociones, CTA, WhatsApp |
| `hot-dark` | `#E67E00` | Hover de hot |
| `hot-light` | `#FFF3E0` | Fondos de promociones |
| `deep` | `#0F4C81` azul | Footer, badges premium, estadísticas |
| `deep-dark` | `#0B3D66` | Hover de deep |
| `deep-light` | `#E8EFF6` | Fondos institucionales |
| `navbar` | `#131921` azul oscuro | Navbar catálogo + footer (estilo Amazon) |
| `navbar-dark` | `#0F141A` | Hover/focus del navbar |

**Reglas de marca** (de `marca.txt`):
- 60% blanco / 25% turquesa / 10% naranja / 5% azul
- Naranja SOLO para: precios, descuentos, promociones, botones CTA, indicadores
- Turquesa: header, categorías, botones secundarios, iconos, links
- Azul SOLO para: footer, estadísticas, badges premium
- NUNCA fondos negros ni botones negros
- Bordes redondeados 16px, sombras muy suaves, animaciones discretas
- Mobile-first, menos de 3 clics para pedir

## Componentes UI base

| Componente | Archivo | Variantes |
|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | `primary`, `cta`, `secondary`, `ghost`, `whatsapp` |
| `Card` | `src/components/ui/Card.tsx` | Hover con elevación, opcionalmente clickeable |
| `Price` | `src/components/ui/Price.tsx` | `sm`, `md`, `lg`, `xl` — siempre color `hot` |
| `Badge` | `src/components/ui/Badge.tsx` | `category`, `premium`, `promo`, `info`, `success`, `warning` |
| `Switch` | `src/components/ui/Switch.tsx` | Toggle con animación |
| `ConfirmDialog` | `src/components/ui/ConfirmDialog.tsx` | Modal de confirmación (`danger`/`default`) |
| `Spinner` | `src/components/ui/Spinner.tsx` | `sm`, `md`, `lg` |
| `Alert` | `src/components/ui/Alert.tsx` | `error`, `warning`, `success` |
| `EmptyState` | `src/components/ui/EmptyState.tsx` | Mensaje + acción opcional |

## Logos

| Ubicación | Archivo | Tamaño |
|---|---|---|
| Navbar catálogo | `/logo-blanco-512.png` | `h-12` (48px), **sin link** (estático, no saca al cliente de la tienda) |
| Landing page | `/logo-512.png` | `h-24` (96px) |
| Footer | `/logo-blanco-512.png` | `h-12` (48px), **sin link**, sobre fondo `navbar` |
| Favicon SVG | `/favicon.svg` | Link en `<head>` |
| Favicon ICO | `/favicon.ico` | Fallback |
| Apple touch | `/apple-touch-icon.png` | iOS |
| PWA 192 | `/icon-192.png` | Android |
| PWA 512 | `/icon-512.png` | Splash |

## Base de datos (Supabase)

### Tablas

- **sellers**: vendedores registrados (name, phone, whatsapp_url, slug, banner_url, country, is_active)
- **products**: productos cargados (seller_id, name, description, price, original_price, image_url, category_id, details)
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
- `008_add_sellers_is_active.sql` — columna is_active en sellers (activar/desactivar catálogo)
- `009_add_sellers_banner_url.sql` — columna banner_url en sellers (banner de tienda desde Canva)
- `010_add_sellers_country.sql` — columna country en sellers (obligatorio, default Honduras)
- `009_add_orders_seller_created_at_index.sql` — índice `idx_orders_seller_created_at` para cálculo de "Más vendido" (pedidos últimos 30 días)
- `010_add_product_original_price.sql` — columna original_price en products (precio original opcional para ofertas, tachado)

### Storage

- Bucket `products` — público, políticas lectura pública + escritura admin
- Bucket `banners` — público, imágenes de banner de vendedores. Políticas: lectura pública + escritura autenticada (INSERT, DELETE). Formato recomendado: 1920×384px.

## Funcionalidades

### Panel Admin (`/admin`)

- **AdminLayout.astro**: layout compartido con auth check, header "← Volver" + "Cerrar sesión", y slot de contenido. Todas las páginas admin lo usan excepto login/logout y el index (que tiene layout especial).
- **Nuevo Vendedor**: `/admin/nuevo-vendedor` — SellerForm.tsx (name, phone, country, slug, banner opcional)
- **Vendedores**: `/admin/vendedores` — SellerList.tsx con bandera del país, "Ver catálogo", "Ver productos", "+ Producto", "Editar"
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
- **Navbar**: fondo azul oscuro `navbar` (#131921 estilo Amazon) con **logo blanco** (`h-12`, estático sin link) + CatalogFilters (dropdown categorías + buscador) + bandera del país (visible en mobile) + CartButton (icono blanco)
- Filtros combinados: categoría + nombre. "Limpiar filtros" + contador de resultados
- **CatalogFilters**: select categorías (`max-w-16 sm:max-w-24`, `px-1`, fondo `#D4D4D4`, texto gris oscuro) + input blanco "Buscar en el catálogo" + botón lupa naranja (`bg-hot`, `rounded-r`). Bordes redondeados 4px (`rounded`/`rounded-l`/`rounded-r`). Foco del input → ring naranja envuelve TODO el filtro. Foco del select → borde naranja `border-2 border-hot` solo en el select (usar `border` no `ring` para evitar desborde debajo del buscador). Línea separadora select/buscador siempre gris (`border-gray-600`)
- Banner de tienda: si el vendedor tiene banner (Canva, 1920×384px) se muestra solo la imagen. Si no tiene, gradiente verde de marca con nombre centrado + "Catálogo de productos"
- Grid responsive: 1/2/5 columnas, images 1:1 con object-cover + **zoom hover `scale-105`** (solo la imagen, no la card). Card compactada (padding `p-3`, imagen `p-2`, descripción `line-clamp-2`), esquinas `rounded-md` (6px), fondo de imagen `bg-gray-50`
- **Badges sobre la imagen**: "Más vendido" (arriba-izquierda, `bg-hot`) = top 20% de productos más vendidos en los últimos 30 días (sin tope máximo). "Nuevo" (arriba-derecha, `bg-brand`) = producto con `created_at` en los últimos 7 días. Ambos dinámicos, se recalculan en cada carga
- **Precio original**: si `original_price` > `price`, se muestra tachado a la derecha del precio de venta (text-sm gris `line-through`)
- Botón "Agregar al carrito" ancho completo (`w-full`), verde marca (`bg-brand`), bordes `rounded-full`, debajo del precio
- **Paginación cliente**: 20 productos por página, controles abajo de la grilla, reinicio a página 1 al filtrar
- CartQuantityButton: solo botón "Agregar" (1 unidad) en tarjeta. Una vez en carrito → badge "En carrito". Cantidades se ajustan en el carrito.
- Botón flotante WhatsApp (`bg-hot`, abajo derecha) para contactar al vendedor
- Footer: "Catálogo creado con PulpeClick"
### Carrito y Pedidos

- **CartProvider**: React Context + localStorage (`pulpeclick-cart`)
- **CartDrawer**: panel lateral con productos, cantidades, total + formulario checkout inline
- Checkout validaciones: nombre (solo letras, min 3), teléfono (solo dígitos/+-()/espacios, min 8 dígitos)
- **Teléfono internacional**: si el número empieza con `+` (ej. `+503`), se usa el código de país directamente. Si no, se asume Honduras (`+504`). Todos los países soportados.
- **Moneda automática**: se deriva del país del vendedor. Honduras=L, Guatemala=Q, El Salvador/México/Colombia=\$, Costa Rica=₡, Nicaragua=C\$, Panamá=B/.
- Cantidad mínima en carrito: el botón `−` se deshabilita en 1 unidad. Para eliminar, usar el icono de basura.
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
│   │   ├── Alert.tsx           # Alertas (error/warning/success)
│   │   ├── Badge.tsx           # Badges (category/premium/promo/info/success/warning)
│   │   ├── Button.tsx          # Botón (primary/cta/secondary/ghost/whatsapp)
│   │   ├── Card.tsx            # Tarjeta con sombra y hover
│   │   ├── ConfirmDialog.tsx   # Modal de confirmación (danger/default)
│   │   ├── EmptyState.tsx      # Estado vacío con CTA opcional
│   │   ├── Price.tsx           # Precio formateado en color hot
│   │   ├── Spinner.tsx         # Spinner de carga (sm/md/lg)
│   │   └── Switch.tsx          # Toggle con animación
│   ├── CartButton.tsx         # Botón carrito con badge
│   ├── CartDrawer.tsx         # Panel lateral + checkout (usa useCheckout)
│   ├── CartNavbar.tsx         # Navbar: logo + CatalogFilters + bandera país + CartButton
│   ├── CartProvider.tsx       # Contexto React carrito (localStorage)
│   ├── CartQuantityButton.tsx # Botón "Agregar" + badge "En carrito"
│   ├── CatalogFilters.tsx     # Dropdown categorías + buscador
│   ├── CategoryManager.tsx    # CRUD de categorías
│   ├── DeleteProductButton.tsx # Botón eliminar con ConfirmDialog
│   ├── BannerUploader.tsx     # Upload de banner (max 5MB, 1920×384px)
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
│   ├── countryFlags.ts        # Banderas emoji y símbolos de moneda por país
│   ├── format.ts               # formatPrice(price, currency)
│   ├── gemini.ts               # Cliente Gemini + prompts + parseGeminiResponse
│   ├── phone.ts                # stripNonDigits, sanitizePhoneInput, formatPhone, buildWhatsAppUrl, validatePhone (internacional)
│   ├── slug.ts                 # generateSlug
│   ├── storage.ts              # uploadProductImage, deleteProductImage, uploadBannerImage, deleteBannerImage
│   ├── supabase.ts            # Cliente Supabase server (service role, tipado)
│   ├── supabase-client.ts     # Cliente Supabase browser (anon key, tipado)
│   └── useCheckout.ts         # Hook de checkout (customer, order, WhatsApp)
├── types/
│   └── database.ts            # Tipos Database de Supabase (6 tablas)
├── pages/
│   ├── 404.astro              # Página 404 custom con logo de PulpeClick
│   ├── catalogo/[slug].astro  # Catálogo público (SSR)
│   ├── index.astro            # Landing page con logo grande
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
21. **Design tokens Tailwind v4**: `@theme` en CSS genera utilidades como `bg-brand`, `text-hot`, `shadow-card` automáticamente. No requiere `tailwind.config.js`.
22. **Google Fonts + Tailwind v4**: `@import url()` en CSS con `@theme` genera warning. Mejor cargar la fuente con `<link>` en el `<head>` HTML.
23. **Adapter Vercel**: `@astrojs/node` (standalone) NO funciona en Vercel serverless. Usar `@astrojs/vercel` para deploy en Vercel.
24. **Vercel + repo privado**: El plan Hobby bloquea deploys desde repos privados con colaboradores. Solución: hacer el repo público.
25. **Vercel + variables de entorno**: Faltan variables → build falla con ❌ en GitHub. Configurarlas en Vercel Dashboard → Settings → Environment Variables.
26. **Zoom solo en imagen**: Usar `group` en contenedor + `group-hover:scale-105` en `<img>`. No aplicar zoom a toda la card. `overflow-hidden` en el contenedor recorta el excedente.
27. **Favicons anti-cache**: Agregar `?v=2` a los href de favicons para forzar recarga en navegadores que cachearon un favicon anterior (ej. el de Vercel).
28. **PWA manifest**: `theme_color` en `site.webmanifest` debe coincidir con el color de marca (`#17877f`).
29. **Banner de tienda**: Subida desde admin con BannerUploader. Bucket `banners` público. Formato recomendado 1920×384px. Si el banner ya tiene el nombre, no se muestra overlay con texto duplicado.
30. **Teléfono internacional**: Si el número empieza con `+`, se usa el código de país completo para WhatsApp. Si no, se asume Honduras (+504). Validación: solo dígitos, `+`, `-`, ` ` y `()`. Backward compatible con números locales.
31. **País del vendedor**: Campo obligatorio en SellerForm. Dropdown con 8 países + "Otro" (texto libre). Se muestra bandera emoji en catálogo y admin. Helper `countryFlags.ts` centraliza banderas y monedas.
32. **Moneda por país**: Derivada automáticamente del campo `country`. `formatPrice(price, currency)` acepta parámetro de moneda. Sin migración — todo en runtime.
33. **Carrito UX**: Botón `−` no elimina (se deshabilita en 1). Eliminación solo con icono de basura. La tarjeta de producto solo muestra "Agregar" → luego "En carrito". Cantidades se ajustan solo en el carrito.
34. **Logo no-link en catálogo**: El logo del navbar del catálogo NO debe llevar a `/` porque la home solo tiene el botón "Panel Admin" y saca al cliente de la tienda. Logo estático con `<div>` (no `<a>`). En JSX usar `className`, no `class`.
35. **Navbar oscuro estilo Amazon**: `bg-navbar` (#131921) con logo blanco. Select oscuro con texto blanco; input de búsqueda blanco destacado; botón naranja contrasta. `hidden sm:inline-flex` oculta en mobile — usar solo `inline-flex` para mostrar en todos los tamaños.
36. **Ring vs border en focus**: `ring` es box-shadow que se dibuja POR FUERA del elemento y se desborda debajo de elementos adyacentes. Para resaltar un elemento pegado a otros (ej. select al lado del buscador), usar `border-2 border-hot` que se dibuja DENTRO del box.
37. **Focus grupal**: Para que el foco del input resalte todo el grupo (select + input + botón), usar `useState` de focus en el padre y aplicar `ring-2 ring-hot` al contenedor. Para resaltar SOLO un hijo (ej. select), darle su propio estado y borde propio.
38. **Redondeos del filtro**: 4px (`rounded`, `rounded-l`, `rounded-r`) en el filtro del catálogo. El patrón e-commerce prefiere esquinas más cuadradas que los 16px de marca.
39. **Badge "Más vendido"**: top 20% (Math.ceil(n*0.2)) de productos más vendidos en los últimos 30 días, sin tope máximo. Cálculo: orders del seller con `created_at >= 30 días` → order_items de esas orders → sumar `quantity` por product_id → ordenar desc → slice(0, badgeCount).
40. **Badge "Nuevo"**: producto con `created_at` en los últimos 7 días. Ambos badges dinámicos (sin columnas en DB, se recalculan en cada carga).
41. **Precio original**: columna `original_price` opcional. Se muestra tachado a la derecha del precio si `original_price > price`. Validación en forms: original debe ser mayor que actual. Badge "Oferta" en admin.
42. **Paginación cliente**: 20 productos por página en SellerCatalog. `useEffect` resetea a página 1 al cambiar filtros, y ajusta la página si los resultados se achican. `goToPage` hace `window.scrollTo` al top.
43. **Bug de upload**: al cargar datos existentes para editar, setear TANTO `bannerUrl`/`oldImageUrl` COMO `bannerPreview`/`imagePreview`. Si solo se setea la URL y no el preview, el form cree que se removió la imagen y la borra al guardar.

## Próximos pasos

- ✅ Deploy a Vercel — `https://pulpe-click.vercel.app`
- ✅ Agregar logo real de PulpeClick (navbar, footer, landing, favicon)
- ✅ Implementar design tokens de marca (brand/hot/deep)
- ✅ Migrar todos los componentes a tokens de marca (~100 ocurrencias)
- ✅ Crear componentes UI base (Button, Card, Price, Badge, Switch, ConfirmDialog)
- ✅ Página 404 custom con logo
- ✅ Efecto zoom en imágenes del catálogo (scale-105)
- ✅ Configurar PWA manifest + favicons
- Probar con vendedores reales

## Assets visuales

| Asset | Tamaño | Formato | Uso |
|---|---|---|---|
| `favicon.svg` | SVG | SVG | Favicon principal |
| `favicon.ico` | 32×32 | ICO | Fallback navegadores antiguos |
| `apple-touch-icon.png` | 180×180 | PNG | iOS / Safari |
| `icon-192.png` | 192×192 | PNG | PWA Android |
| `icon-512.png` | 512×512 | PNG | PWA splash screen |
| `logo-512.png` | 512×512 | PNG | Navbar (`h-12`), landing (`h-24`) |
| `logo-blanco-512.png` | 512×512 | PNG | Footer sobre fondo `deep` (`h-12`) |
| `logo-negro-512.png` | 512×512 | PNG | Uso futuro (fondos claros) |
| `site.webmanifest` | — | JSON | PWA config (`theme_color: #17877f`) |

Todos los assets están en `public/` y linkeados en `Layout.astro`.
- Las imágenes de producto deben ser **1:1 (cuadradas)** para funcionar con `aspect-square` + `object-cover` en las cards.
