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
- `history/step-05-sqli-defense.md`

---

## 📌 Step 6: Password Reset & 6-Point Security Verification
**Date:** 2026-09-01  
**Objective:** Add complete password reset capabilities across Explorer and Partner login portals, create a dedicated `/reset-password` page, and verify the 6 core SQL injection defense principles.

### Summary of Changes:
- **Dedicated Reset Password Page (`apps/web/src/app/reset-password/page.tsx`)**: Secure password update form with password matching, minimum length (6+ chars), SQL injection pattern rejection, and direct integration with `supabase.auth.updateUser()`.
- **Diner Explorer Login (`apps/web/src/app/login/user/page.tsx`)**: Added "Forgot Password?" trigger, email reset request modal, and SQL injection sanitization on credentials.
- **Restaurant Partner Login (`apps/web/src/app/login/partner/page.tsx`)**: Added "Forgot Password?" trigger, business email reset modal, and SQL injection sanitization.
- **6-Point Security Verification**: Confirmed active enforcement of prepared statements, RLS least privilege, secure stored procedures, strict Zod validation, dependency security, and pre-DB SQLi pattern detection.

### Files Modified/Created:
- `apps/web/src/app/reset-password/page.tsx`
- `apps/web/src/app/login/user/page.tsx`
- `apps/web/src/app/login/partner/page.tsx`
- `history/step-06-password-reset-and-security-verification.md`

---

## 📌 Step 7: Platform Maintenance Mode & Emergency Controls
**Date:** 2026-09-01  
**Objective:** Add dedicated "Page Under Maintenance" portal, estimated time countdown, and staff bypass keys.

### Summary of Changes:
- **Maintenance Page (`apps/web/src/app/maintenance/page.tsx`)**: Created glassmorphic maintenance portal with live ping status, duration estimate, security badge, and staff passcode bypass.
- **Maintenance Engine (`apps/web/src/lib/maintenance.ts`)**: Route helper and runtime state configuration.
- **Partner Settings Toggle (`apps/web/src/app/dashboard/settings/page.tsx`)**: Added quick maintenance preview and control card.

---

## 📌 Step 8: Real-Time Kitchen Display System (KDS) & Order Pipeline
**Date:** 2026-09-01  
**Objective:** Implement bi-directional real-time order stream, synthetic Web Audio bell chimes, digital KOT (Kitchen Order Ticket) printing, and 4-stage status pipeline.

### Summary of Changes:
- **Audio Bell Synthesizer**: Web Audio API dual-oscillator acoustic bell for zero-asset audio alerts on incoming orders.
- **Supabase Realtime**: Subscribed to `orders` table to dynamically ingest live orders into the kitchen queue.
- **Digital KOT Tickets**: Thermal receipt preview and browser 1-tap print mode.
- **4-Stage Order Progression**: `NEW` -> `PREPARING` -> `READY_FOR_PICKUP` -> `DISPATCHED_WITH_DRIVER`.

---

## 📌 Step 9: Live Turn-by-Turn GPS Navigation HUD & NLP Pin-to-Map
**Date:** 2026-09-01  
**Objective:** Transform MapLibre GL dark map into an interactive 3D driving navigation HUD with turn maneuver banners, speed gauge, distance countdown, and YouTube scraper pin integration.

### Summary of Changes:
- **3D Navigation Perspective**: 60° camera pitch and 35° bearing heading rotation on navigation start.
- **Maneuver Banner**: Turn directional arrows, live speed gauge (`28 km/h`), and ETA countdown (`1.2 km • 4 Mins`).
- **YouTube NLP Scraper Pinning**: Newly extracted viral food spots are immediately pinned to the active MapLibre canvas with custom gem score badges.

---

## 📌 Step 10: Gamified Foodie Passport, Table QR Scanners & Dynamic BharatQR Settlements
**Date:** 2026-09-01  
**Objective:** Add table secret QR code scanner modal, Bitmoji avatar and XP progression card, and dynamic BharatQR code generation for 3-way payment settlements.

### Summary of Changes:
- **Table Secret QR Scanner (`apps/web/src/components/SecretQRScannerModal.tsx`)**: Camera viewfinder simulation unlocking off-menu secret dishes with passcode `#VAULT-88` and awarding `+50 Gem XP`.
- **Foodie Bitmoji & Chef Persona (`apps/web/src/app/dashboard/profile/page.tsx`)**: Level 4 explorer avatar and gem XP badge showcase.
- **Dynamic BharatQR Engine (`apps/web/src/lib/payment.ts`)**: `buildBharatQRCodeUrl` for instant on-screen UPI QR rendering and 3-way automated revenue splits.

---

## 📌 Step 11: Voice Guidance, Edge Middleware, API Rate Limiting & Community Spot Submissions
**Date:** 2026-09-01  
**Objective:** Implement the top high-impact production improvements including browser-native speech synthesis navigation guidance, Next.js Edge middleware route protection, sliding-window API rate limiting, and the community hidden gem submission portal.

### Summary of Changes:
- **Web Speech Synthesis Engine (`apps/web/src/lib/voiceGuidance.ts`)**: Natural spoken turn maneuvers (*"In 250 meters, turn right onto MG Road"*) integrated into the 3D Navigation HUD on `/explorer/map`.
- **Edge Security Middleware (`apps/web/src/middleware.ts`)**: Maintenance mode route interceptor, anti-clickjacking headers, and XSS filtering.
- **API Sliding Window Rate Limiter (`apps/web/src/lib/rateLimit.ts`)**: Rate limiting guards added to `/api/places` (60 req/min) and `/api/scrape-youtube` (20 extractions/min).
- **Community Gem Submission Portal (`apps/web/src/app/explorer/submit-gem/page.tsx`)**: Diner submission form with photo upload, landmark tagging, secret off-menu passcode entry, and `+100 Gem XP` reward.

---

## 📌 Step 12: Multi-Stop Food Crawl (TSP), AR Alley Compass & Discovery Heatmaps
**Date:** 2026-09-01  
**Objective:** Implement the multi-stop food crawl route optimizer with Traveling Salesperson Problem (TSP) nearest-neighbor algorithm, browser Augmented Reality (AR) spatial camera vision, and partner customer discovery heatmaps.

### Summary of Changes:
- **Multi-Stop Food Crawl TSP Optimizer (`apps/web/src/lib/foodCrawlOptimizer.ts`)**: Nearest-neighbor TSP algorithm for 2–5 chosen food gems with travel & tasting duration estimates.
- **Interactive Crawl Drawer (`apps/web/src/components/FoodCrawlDrawer.tsx`)**: Slide-over selection UI integrated into `/explorer/map`.
- **Augmented Reality Alley Compass Vision (`apps/web/src/components/ARAlleyCompassModal.tsx`)**: Live camera overlay with floating 3D radar markers and distance meters.
- **Partner Customer Discovery Heatmaps (`apps/web/src/app/dashboard/analytics/page.tsx`)**: Traffic origin distribution and peak ordering hour breakdowns.

---

## 📌 Step 13: Security Vulnerability Remediation & Hardening
**Date:** 2026-09-02  
**Objective:** Remediate all critical, high, and medium vulnerabilities identified in `SECURITY_VULNERABILITY_AUDIT.md`.

### Summary of Changes:
- **Server-Side Staff Bypass API (`apps/web/src/app/api/auth/staff-bypass/route.ts`)**: Replaced hardcoded client-side passcodes with rate-limited server route, constant-time comparisons, and secure `HttpOnly` cookie issuance.
- **Driver Endpoint PII Masking & Rate-Limited OTPs (`apps/web/src/app/api/driver/route.ts`)**: Eliminated plaintext OTP leakage and masked customer phone numbers.
- **Edge Middleware Route Protection & Content Security Policy (`apps/web/src/middleware.ts`)**: Protected `/dashboard` and `/driver` routes and added strict CSP headers.
- **Password Reset Error Handling (`apps/web/src/app/reset-password/page.tsx`)**: Removed false-positive success mask and added explicit auth error alerts.
- **Strict Parameter Whitelist Validation (`apps/web/src/lib/security.ts`)**: Enforced alphanumeric regex on `placeId` in `placesQuery` schema.

---

## 📌 Step 14: Backend Supabase Integration, Distributed Rate Limiting, Webhook Verification & pgvector Schema
**Date:** 2026-09-02  
**Objective:** Implement the top backend, payment, and database enhancements with 0 UI changes, ensuring full backward compatibility and automated test coverage.

### Summary of Changes:
- **Supabase Server Clients (`apps/web/src/lib/supabase.ts`)**: Added `createServerSupabaseClient` and `createAdminClient` for server-side database access.
- **Database-Wired API Routes**: Upgraded `/api/bookings` and `/api/menu` to interact with Supabase tables with resilient mock fallbacks.
- **Distributed Edge Rate Limiting (`apps/web/src/lib/rateLimit.ts`)**: Added Upstash Redis support with atomic `INCR` + `EXPIRE` and proxy header spoofing protection.
- **Cryptographic Payment Engine (`apps/web/src/lib/payment.ts`)**: Added HMAC-SHA256 webhook signature verification and transaction hash utilities.
- **Database Migration (`supabase/migrations/20260902_pgvector_and_schema_enhancements.sql`)**: Created `vector` extension, bookings schema, and cosine similarity semantic search function.
- **Automated Test Suite (`apps/web/scripts/run-tests.js`)**: 14/14 automated assertions passed for security, settlement math, and validation.

## 📌 Step 15: Open-Source Map Engine Decoupling & Modular Viewport Staging
**Date:** 2026-09-02  
**Objective:** Decouple open-source maplibre-gl map engine from the explorer page and prepare a modular location viewport ready for incoming map tool integration.

### Summary of Changes:
- **Map Decoupling (`apps/web/src/app/explorer/map/page.tsx`)**: Removed `maplibre-gl` raster tile canvas and OSRM network dependencies.
- **Visual Location Viewport**: Implemented interactive Gem Grid spot canvas preserving all surrounding features (NLP YouTube Scraper, Multi-Stop Food Crawl, AR Alley Vision, Turn-by-Turn GPS Navigation HUD, voice guidance, and reservation modals).
- **TypeScript Verification**: Verified 0 type errors across `apps/web`.

## 📌 Step 16: Dual-Engine Interactive Map Integration (React-Leaflet + Carto Dark & 3D Deck.gl Spatial Radar)
**Date:** 2026-09-02  
**Objective:** Integrate React-Leaflet with CartoDB Dark Matter tiles and 3D Deck.gl Spatial Radar, providing a style switcher for the user.

### Summary of Changes:
- **Dual-Engine Map Component (`apps/web/src/components/DualEngineMap.tsx`)**: Created modular multi-style map system supporting:
  1. *CartoDB Dark Matter (React-Leaflet)*: Luxury dark raster street tiles, gold Gem Score pins, and route polylines.
  2. *Deck.gl 3D Spatial Radar*: 3D spatial node elevation arcs, rotating sweep beam, and range rings.
  3. *CartoDB Voyager*: Clean architectural navigation view.
  4. *OpenStreetMap Classic*: Standard daytime map view.
- **Top-Right Style Switcher**: Floating pill dropdown allowing users to change map styles instantly.
- **Page Integration (`apps/web/src/app/explorer/map/page.tsx`)**: Connected `DualEngineMap` with dynamic client-side loading (`ssr: false`) and fly-to spot animations.
- **TypeScript Verification**: Passed `npx tsc --noEmit` and all automated unit tests (14/14 PASS).

## 📌 Step 17: Secret QR Dining Pass & Partner Studio Verification Scanner
**Date:** 2026-09-02  
**Objective:** Integrate dynamic, cryptographic Secret QR Pass generation for diner bookings and food orders, paired with a camera verification scanner in Partner Studio.

### Summary of Changes:
- **Cryptographic QR Engine (`apps/web/src/lib/qrPass.ts`)**: Built HMAC-SHA256 signed token generator with table assignments and 4-digit backup PINs.
- **Verification API (`/api/qr/verify`)**: Endpoint validating scanned QR passes with origin verification and distributed rate limits.
- **Partner Scanner Modal (`apps/web/src/components/QRScannerModal.tsx`)**: Camera scanner with aiming reticle, laser animation, manual PIN input, and instant status updates (`CONFIRMED` -> `SEATED`).
- **Diner Secret Pass Modal (`apps/web/src/components/DinerSecretQRPassModal.tsx`)**: Glowing gold digital boarding pass rendered on booking confirmation.
- **Dashboard Integrations**: Added "Scan Diner QR" to `/dashboard/bookings` and `/dashboard/kitchen` (KDS).
- **Automated Tests**: Updated `apps/web/scripts/run-tests.js` with 17/17 passing tests.

## 📌 Step 18: Smart Dynamic UPI QR & 1-Tap Mobile Payment Engine
**Date:** 2026-09-02  
**Objective:** Integrate dynamic UPI BharatQR generation, 1-tap mobile payment deep-linking (`upi://pay`), automatic real-time transition to Secret Pass QR, and 3-way revenue split logging.

### Summary of Changes:
- **Smart UPI Modal (`apps/web/src/components/SmartUPIPaymentModal.tsx`)**: Created unified payment modal with 1-tap mobile deep link (`upi://pay`) and BharatQR code for desktop scanning, countdown timer, VPA copy tool, and instant payment confirmation.
- **Auto-Pass Transition**: Successful payment directly launches the diner's glowing Secret Pass QR (`DinerSecretQRPassModal`).
- **Flow Wiring**: Connected to restaurant cart checkout (`/restaurant/[id]`) and explorer table booking flow (`/explorer/map`).
- **TypeScript & Test Verification**: Verified with 0 errors and 17/17 passing tests.

---







