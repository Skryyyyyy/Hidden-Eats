# Hidden Eats

A food discovery platform helping users uncover hidden culinary gems, off-menu items, and curated collections that standard popularity-based ranking algorithms miss.

## Project Structure

```
Hidden Eats/
├── apps/
│   ├── mobile/         # Expo React Native App (TypeScript, Expo Router, React Native Maps)
│   └── web/            # Next.js 14 App Router (TypeScript, Tailwind CSS, Partner Dashboard)
├── packages/
│   ├── shared/         # Shared TypeScript interfaces (Restaurant, MenuItem, Review, etc.) and math utils
│   └── supabase-client/ # Supabase client wrapper and type re-exports
├── package.json        # Workspace setup & turbo scripts
├── turbo.json          # Turborepo build pipeline
└── README.md
```

## Environment Setup

1. Copy `.env.example` to `.env` in the root and in each sub-app (`apps/web/.env.local`, `apps/mobile/.env`):
   ```bash
   cp .env.example .env
   cp apps/web/.env.example apps/web/.env.local
   cp apps/mobile/.env.example apps/mobile/.env
   ```

2. Configure environment variables:
   - `SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_ANON_KEY` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_MAPS_SERVER_KEY` (Server-side key for Places API proxy Edge Function)
   - `GOOGLE_MAPS_CLIENT_KEY` (Client-side restricted key for Expo mobile map rendering)

## Getting Started

Install dependencies from the monorepo root:

```bash
npm install
```

### Running Development Servers

Run both Web and Mobile apps concurrently using Turborepo:

```bash
npm run dev
```

Or run individual apps:

**Web App (Next.js):**
```bash
npm run dev --filter=web
# Opens at http://localhost:3000
```

**Mobile App (Expo):**
```bash
npm run dev --filter=mobile
# Launches Expo CLI for iOS / Android / Web
```

### Building

```bash
npm run build
```

## Architecture & Data Rules

- **Places API Caching Policy**: Under Google Maps Platform terms, place details (name, rating, address, photos, reviews) are NOT stored permanently in Postgres. Only `google_place_id` is stored indefinitely as a foreign key, and lat/lng may be cached for up to 30 days. Live place data is fetched dynamically via the `places-proxy` Supabase Edge Function.
