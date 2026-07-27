# PulpeClick

Catálogos digitales para emprendedores en Honduras. Vendé más sin estar pegado al celular.

## Stack

- **Astro 7** + **React 19** + **TypeScript** + **Tailwind CSS v4**
- **Supabase** — Database, Auth, Storage
- **Gemini API** — AI-generated product descriptions, WhatsApp posts, and price suggestions
- **Vercel** — Hosting

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase and Gemini credentials
3. `npm install`
4. `npm run dev` — starts at `http://localhost:4321`

## Project Structure

```
src/
├── lib/
│   ├── supabase.ts    # Supabase client singleton
│   └── gemini.ts       # Gemini API helper + prompts
├── env.d.ts            # Environment variable types
├── layouts/
│   └── Layout.astro    # Base layout (mobile-first)
├── pages/
│   ├── index.astro     # Landing page
│   ├── admin/
│   │   └── index.astro # Admin panel
│   ├── api/
│   │   ├── generate-description.ts  # AI description generator
│   │   ├── generate-posts.ts        # AI WhatsApp posts generator
│   │   └── suggest-price.ts         # AI price suggestion
│   └── catalogo/
│       └── [slug].astro  # Dynamic teacher catalog
└── styles/
    └── global.css       # Tailwind + base styles
```

## Design

100% mobile-first — all pages work perfectly on phone screens (320px–480px) and scale up for desktop.

## Commands

| Command             | Action                    |
| ------------------- | ------------------------- |
| `npm run dev`       | Start dev server          |
| `npm run build`     | Build for production      |
| `npm run preview`   | Preview production build  |

## Environment Variables

See `.env.example`. Required: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`.
