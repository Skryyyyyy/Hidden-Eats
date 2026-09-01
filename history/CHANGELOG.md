# 📜 Project Progress & Change Log

---

## 📌 Step 1: Authentication & Caooli Typography Integration
**Date:** 2026-08-16  
**Objective:** Enable Google/Apple OAuth login with seamless fallback, integrate Caooli serif font, and configure Supabase client.

### Summary of Changes:
- **Typography**: Integrated `Caooli` display serif typeface via `@font-face` and semantic CSS tokens in `apps/web/src/app/globals.css`.
- **OAuth Login**: Added instant Google and Apple login flows on both `/login/user` and `/login/partner` with local fallback sessions to prevent blocking users when external OAuth provider is toggled off.
- **Privacy Setup**: Generated Google OAuth credentials guide in `GOOGLE_OAUTH_SETUP.md` (added to `.gitignore` to protect API secrets).

### Files Modified/Created:
- `apps/web/src/app/globals.css`
- `apps/web/src/app/login/user/page.tsx`
- `apps/web/src/app/login/partner/page.tsx`
- `GOOGLE_OAUTH_SETUP.md`
- `.gitignore`

---

## 📌 Step 2: Interactive Dark Map Engine & OSRM Driving Navigation
**Date:** 2026-08-16 – 2026-08-17  
**Objective:** Replace mock SVG grid with a real MapLibre GL dark interactive map, live GPS explorer marker, and OSRM turn-by-turn routing.

### Summary of Changes:
- **MapLibre GL Component**: Created reusable `<Map>`, `<MapControls>`, `<MapMarker>`, and `<MapRoute>` components in `apps/web/src/components/ui/map.tsx`.
- **CORS-Proof Dark Raster Tiles**: Configured `CartoDB Dark Matter` inline tile specification to prevent browser CORS / AJAX errors on localhost.
- **OSRM Routing Engine**: Built `OsrmRouteExample.tsx` connecting to `https://router.project-osrm.org` for calculating driving distances, travel times, and fastest route badges between user GPS and destination spot.
- **Map Page Rewrite**: Completely transformed `apps/web/src/app/explorer/map/page.tsx` to render real interactive streets, water bodies, city labels, and numbered stop pins.

### Files Modified/Created:
- `apps/web/src/components/ui/map.tsx`
- `apps/web/src/components/ui/button.tsx`
- `apps/web/src/components/OsrmRouteExample.tsx`
- `apps/web/src/app/explorer/map/page.tsx`

---

## 📌 Step 3: Branch Synchronization, Teammate Merge & Navigation Refinement
**Date:** 2026-08-17 – 2026-09-01  
**Objective:** Merge updates from remote teammate branch (`origin/main`), resolve layout conflicts, fix TypeScript issues, and simplify navigation labels.

### Summary of Changes:
- **Teammate Merge**: Pulled teammate commits (`e96b7a4`, `4e61f61`) incorporating kitchen dashboard upgrades, landing page nav, and animations.
- **Conflict Resolution**: Resolved merge conflict in `apps/web/src/app/layout.tsx` cleanly preserving `GlobalThemeToggle` and `SmoothFollower`.
- **TypeScript Type Fix**: Fixed framer-motion `itemVariants` type issue in `InteractiveFeatures.tsx`.
- **Navigation Labeling**: Renamed top navigation tab from `IN-APP MAP` to `MAP` across all 7 supported languages in `apps/web/src/context/LanguageContext.tsx`.
- **Verification**: Verified `npx tsc --noEmit` with **0 errors**.

### Files Modified/Created:
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/ui/InteractiveFeatures.tsx`
- `apps/web/src/context/LanguageContext.tsx`
- `apps/web/package.json` & `package-lock.json`

---

## 📌 Step 4: Dedicated History Directory Establishment
**Date:** 2026-09-01  
**Objective:** Create an isolated `/history` documentation folder to maintain an audit trail of every modification, step, and progress milestone.

### Files Modified/Created:
- `history/README.md`
- `history/CHANGELOG.md`

---

## 📌 Step 5: SQL Injection Defense & Security Hardening Layer
**Date:** 2026-09-01  
**Objective:** Implement multi-layer defense against SQL Injection (SQLi), Cross-Site Scripting (XSS), and malicious parameter tampering across all API routes and database queries.

### Summary of Changes:
- **Security Engine (`apps/web/src/lib/security.ts`)**:
  - `hasSqlInjectionPattern()`: RegEx detector for SQL keywords (`UNION`, `SELECT`, `DROP`, `OR 1=1`, `--`, `/* */`).
  - `sanitizeSqlInput()` & `sanitizeSearchQuery()`: Automated escaping of quotes, backslashes, control characters, and SQL comment indicators.
  - `isValidIdentifier()`: Enforces alphanumeric IDs preventing injection into query parameters.
  - `SecuritySchemas`: Strict Zod validation schemas for all incoming API payloads (`placesQuery`, `bookingAction`, `driverHandover`, `menuStatus`, `settlement`, `profileUpdate`, `videoScraper`).
- **Secured API Routes**:
  - `apps/web/src/app/api/places/route.ts`: Sanitizes search queries, validates coordinates & place IDs.
  - `apps/web/src/app/api/bookings/route.ts`: Validates booking actions and sanitized IDs.
  - `apps/web/src/app/api/driver/route.ts`: Rejects malformed OTPs and verifies order IDs.
  - `apps/web/src/app/api/menu/route.ts`: Validates dish ID formats and stock status flags.
  - `apps/web/src/app/api/profile/route.ts`: Sanitizes full names, usernames, and email formats.
  - `apps/web/src/app/api/scrape-youtube/route.ts`: Restricts video URLs to valid YouTube/Instagram domains.
  - `apps/web/src/app/api/settlement/route.ts`: Validates numeric settlement amounts and UPI VPAs.
- **Database Hardening (`supabase/migrations/20260901_sql_injection_security_hardening.sql`)**:
  - Hardened Row Level Security (RLS) policies for `profiles`, `reviews`, `orders`, and `scraped_hidden_shops`.
  - Secure search stored procedure with parameterized inputs and fixed `search_path = public, pg_temp` to prevent search path hijacking.

### Files Modified/Created:
- `apps/web/src/lib/security.ts`
- `apps/web/src/app/api/places/route.ts`
- `apps/web/src/app/api/bookings/route.ts`
- `apps/web/src/app/api/driver/route.ts`
- `apps/web/src/app/api/menu/route.ts`
- `apps/web/src/app/api/profile/route.ts`
- `apps/web/src/app/api/scrape-youtube/route.ts`
- `apps/web/src/app/api/settlement/route.ts`
- `supabase/migrations/20260901_sql_injection_security_hardening.sql`

---

