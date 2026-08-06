# Hidden Eats — Vibe-Coding Build Plan

**Stack:** React Native (Expo) for mobile, Next.js for web + restaurant partner dashboard, Supabase for backend (Postgres + Auth + Storage + Edge Functions), Google Maps Platform for restaurant/location data.

## How to use this doc

Paste prompts **one at a time**, in order, into your AI coding tool (Claude Code, Cursor, etc.). Don't skip ahead — later prompts assume earlier ones are done, especially the schema. After each step, actually run the app and check it works before moving to the next prompt. Vibe coding fails when you stack five unverified layers on top of each other.

Before Step 1, paste this **once at the start of every new session** so the AI has context:

```
PROJECT CONTEXT (paste at the start of every session):

I'm building "Hidden Eats" — a food discovery app, not another restaurant finder.
Core idea: help users discover great food (hidden gems, off-menu items, curated
collections) that Google Maps' popularity-based ranking doesn't surface.

Stack:
- Mobile: React Native with Expo
- Web + restaurant partner dashboard: Next.js (App Router)
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions, Row Level Security)
- Maps/location data: Google Maps Platform (Places API New, Maps SDK, Routes API)

IMPORTANT DATA RULE: Google's Places API terms forbid permanently storing most
place data (name, address, rating, photos, reviews). Only `place_id` can be
stored indefinitely, and lat/long can be cached for max 30 days. Everything
else must be fetched live from Google at render time, through a server-side
proxy (Supabase Edge Function) that never exposes the Google API key to the
client. Never write Google's name/address/rating/photo fields into a
permanent Postgres table — only the place_id as a foreign key.

Keep code modular, typed (TypeScript everywhere), and don't over-engineer
features I haven't asked for yet.
```

---

## Phase 0 — Foundation

### Step 1: Project scaffolding

```
Set up a monorepo for "Hidden Eats" using Turborepo (or npm workspaces if
simpler) with this structure:

- apps/mobile — Expo React Native app (TypeScript, Expo Router)
- apps/web — Next.js app (App Router, TypeScript, Tailwind)
- packages/shared — shared TypeScript types (Restaurant, MenuItem, Review,
  Collection, Booking, etc.) and shared utility functions
- packages/supabase-client — a thin wrapper around the Supabase JS client
  used by both apps

Set up environment variable handling (.env.example files) for:
- SUPABASE_URL, SUPABASE_ANON_KEY
- GOOGLE_MAPS_SERVER_KEY — server-side only (used by the Places API proxy
  in Step 4), never exposed to any client, no domain/app restriction needed
  since it never leaves the server
- GOOGLE_MAPS_CLIENT_KEY — a SEPARATE key, embedded in the mobile app to
  render the actual map tiles (react-native-maps, Step 7). This key IS
  exposed inside the compiled app, so it must be restricted in Google Cloud
  Console to only the Maps SDK for Android/iOS APIs, and locked to this
  app's specific package name / bundle ID + SHA-1 fingerprint. Never reuse
  the server key for this — a leaked unrestricted key is how people get
  surprise Google Cloud bills.

Add basic README instructions for running both apps locally.
Do not add any business logic yet — this step is scaffolding only.
```

### Step 2: Supabase schema

```
Design and generate a Supabase Postgres schema (as SQL migration files) for
Hidden Eats with these tables. Enable the PostGIS extension for geospatial
queries. Enable Row Level Security on every table and write basic policies
(users can read public data, users can only edit their own rows).

Tables needed:

1. profiles — id (uuid, FK to auth.users), username, avatar_url, badges (jsonb),
   created_at

2. restaurants — id (uuid), google_place_id (text, unique, NOT NULL — this is
   the only Google-owned field we store long-term), cached_lat (numeric),
   cached_lng (numeric), lat_lng_cached_at (timestamp — used to know when to
   refresh, since we can only cache coords 30 days per Google's terms),
   hidden_gem_score (numeric, nullable), curated_tags (text[]), is_bookable
   (boolean), added_by_admin_id, created_at

   Do NOT add columns for restaurant name, address, Google rating, or photos —
   those come live from the Places API at request time, never stored here.

3. menus — id, restaurant_id (FK), created_at
4. menu_items — id, menu_id (FK), name, description, price, photo_url,
   is_off_menu_secret (boolean, default false), is_available (boolean),
   category (text)

5. reviews — id, restaurant_id (FK), user_id (FK), rating (1-5), food_quality
   (1-5), price_worth (1-5), service (1-5), ambience (1-5), consistency (1-5),
   text_review, photo_urls (text[]), created_at

6. collections — id, user_id (FK), title, description, is_public (boolean),
   created_at
7. collection_items — id, collection_id (FK), restaurant_id (FK), note, sort_order

8. bookings — id, restaurant_id (FK), user_id (FK), party_size, booking_time,
   status (enum: pending/confirmed/cancelled), special_requests, created_at

9. tags — id, name, category (enum: mood/budget/occasion/amenity) — for the
   craving-based home screen filters (Biryani, Street Food, Date Night, etc.)
10. restaurant_tags — join table, restaurant_id + tag_id

Write a function or trigger to recompute hidden_gem_score whenever a new
review is added (formula: weighted average of review sub-scores, adjusted
by review count — I'll refine the exact formula later, just wire up the
recompute mechanism for now).

Output as numbered SQL migration files I can run with the Supabase CLI.
```

---

## Phase 1 — MVP: Discovery Core

### Step 3: Auth

```
Implement Supabase Auth in both apps:
- Mobile (Expo): email/password + Google sign-in, using Supabase Auth,
  with a persisted session using expo-secure-store
- Web (Next.js): same, using Supabase Auth Helpers for Next.js App Router

On first sign-in, create a row in `profiles`. Build a simple profile
screen (mobile) showing username, avatar, and badges (empty state for now).
```

### Step 4: Google Places proxy (critical — do this before any map UI)

```
Create a Supabase Edge Function called `places-proxy` that:
1. Accepts a request type (nearby-search, place-details, photo) and query
   params from the client
2. Calls the corresponding Google Places API (New) endpoint server-side,
   using GOOGLE_MAPS_SERVER_KEY from environment secrets (never sent to client)
3. Returns only the fields the client needs (name, formatted_address,
   rating, user_rating_count, photos, opening_hours, price_level, location,
   place_id)
4. Does NOT persist any of this response to our database — this function
   is a stateless pass-through, called live every time a restaurant needs
   to be displayed

Also write a small client-side hook (`usePlaceDetails(placeId)`) for the
mobile app that calls this edge function and caches the result in memory
for the current session only (not persisted to disk/AsyncStorage).
```

### Step 5: Home / discovery screen (mobile)

```
Build the Hidden Eats home screen in Expo. Layout:

- Greeting header ("Good evening, {username}")
- A prominent search bar: "What are you craving today?"
- Horizontal scrollable craving/mood chips pulled from the `tags` table
  (Biryani, Street Food, Budget Meals, Date Night, Midnight Cravings,
  Hidden Gems, Cafe to Work, Family Dinner)
- Sections below, each a horizontal scroll of restaurant cards:
  - Trending Near You
  - Hidden Gems (restaurants where hidden_gem_score > 8, sorted descending)
  - Most Loved (highest average review rating)
  - Open Now
  - Budget Under ₹200

Each restaurant card should show: photo (fetched live via the places-proxy
using google_place_id), name, hidden_gem_score badge if applicable, price
level, and distance from the user's current location (use expo-location
for the user's coordinates, and calculate distance against cached_lat/lng
from our restaurants table).

Tapping a card navigates to the restaurant detail screen (build a
placeholder screen for now, we'll build it in the next step). Leave a
placeholder for the List/Map toggle button for now — the actual map view
gets built in Step 7.
```

### Step 6: Restaurant detail screen

```
Build the restaurant detail screen. Sections, top to bottom:

1. Photo/video gallery (from Places API live fetch + any community-uploaded
   photos from our own storage)
2. Name, Google rating + our community rating shown side by side, price
   level, opening hours (all fetched live via places-proxy)
3. Hidden Gem Score — large, prominent badge with the breakdown (food
   quality, price worth, service, ambience, consistency) as a small radar
   or bar chart
4. Menu tab: list menu_items grouped by category, with an "Off-menu / Local's
   Pick" section for items where is_off_menu_secret = true
5. Action row: Reserve Table, Pre-Order (both can be stub buttons for now —
   we build these in Phase 2), Navigate (opens Google Maps / Apple Maps app
   with directions to cached_lat/lng — use the native maps deep link, don't
   build custom navigation), Call, WhatsApp
6. Reviews section: list reviews from our `reviews` table with sub-ratings,
   plus a "Write a Review" button

Use React Native's Linking API for the Navigate/Call/WhatsApp buttons —
these should hand off to native apps, not be built in-house.
```

### Step 7: In-app map view

```
Add react-native-maps (with the Google Maps provider on both iOS and
Android — PROVIDER_GOOGLE) to the mobile app, and build a Map view screen:

1. Add a toggle on the home/discovery screen: "List" vs "Map" view
2. In Map view, render a Google Map (via react-native-maps) centered on
   the user's current location (expo-location), with a custom marker for
   each restaurant currently in the filtered list (respect whatever
   craving/tag filters are active). Use cached_lat/cached_lng from our
   `restaurants` table for marker positions — refresh from the places-proxy
   if lat_lng_cached_at is older than 30 days (per Google's caching limit).
3. Style hidden-gem markers differently (e.g. a distinct icon/color) from
   regular markers so gems visually stand out on the map itself.
4. Tapping a marker shows a small preview card (photo, name, hidden gem
   score, distance) that slides up from the bottom — tapping the card
   navigates to the full restaurant detail screen.
5. On the restaurant detail screen, add an embedded mini-map (small,
   non-interactive Google Map snippet showing just that restaurant's pin)
   above the action buttons, so users see location context without
   leaving the screen.
6. The "Navigate" button stays as-is — deep-link out to the native Maps
   app for actual turn-by-turn directions. Do not build custom
   turn-by-turn navigation; only build the discovery map.

Remember: since this map displays Google-owned data (ratings, photos)
alongside our data, this map view must show proper Google attribution
(the Google logo) per Places API policy — react-native-maps with
PROVIDER_GOOGLE handles this automatically since it renders an actual
Google Map.
```

### Step 8: Reviews & hidden gem score display

```
Build the "Write a Review" flow: a form with sliders/star inputs for
overall rating, food quality, price worth, service, ambience, consistency,
plus optional text and photo upload (to Supabase Storage). On submit,
insert into `reviews` and trigger the hidden_gem_score recompute function
from Step 2.

Add a simple explanation tooltip/modal on the Hidden Gem Score badge
explaining what it means, e.g. "Only a small percentage of nearby diners
know about this place — but it's rated excellently by those who do."
Keep the copy honest — don't fabricate a specific percentage unless you
actually have the data to back it (e.g. based on review count in the area).
```

### Step 9: Collections

```
Build the Collections feature:
- Users can create a collection (title, description, public/private)
- Add restaurants to a collection from the restaurant detail screen
  ("Add to Collection" button → modal to pick/create a collection)
- A Collections tab showing the user's own collections and public
  collections from others, browsable and shareable via a deep link
```

---

## Phase 2 — Monetization Core

### Step 10: Booking system

```
Build a table reservation flow:
- Restaurant detail screen "Reserve Table" button opens a modal: date,
  time, party size, special requests
- Insert into `bookings` table with status = 'pending'
- Build a simple restaurant-side view (in the Next.js partner dashboard,
  built in Step 12) where restaurant owners can see pending bookings and
  mark them confirmed/cancelled
- Send the user a push notification (Expo push notifications) when their
  booking status changes
```

### Step 11: Pre-ordering + payments

```
Add a Pre-Order flow: user selects menu items from `menu_items`, sees a
running total, and pays via Razorpay (or Stripe if targeting international
users) checkout. Store the order in a new `orders` + `order_items` table
(add these to the schema first). On successful payment webhook, mark the
order as paid and notify the restaurant via the partner dashboard.
```

### Step 12: Restaurant partner dashboard (Next.js)

```
Build a simple authenticated dashboard in the Next.js app for restaurant
owners to:
- Claim/manage their restaurant profile (linked via google_place_id)
- Add/edit their menu and menu items, including marking off-menu/secret items
- View and respond to incoming bookings and pre-orders
- See their Hidden Gem Score breakdown and review feed

Restrict access so a restaurant owner can only manage restaurants they've
been granted access to (add a `restaurant_owners` join table: user_id +
restaurant_id + role).
```

---

## Phase 3 — Community Depth (build only after Phase 1-2 are live with real users)

### Step 13: Community check-ins (crowd/wait time)

```
Add a lightweight "How busy is it right now?" check-in feature: users at
a restaurant can tap Busy / Moderate / Empty, and estimated wait time.
Aggregate the last N check-ins (e.g. last 2 hours) into a live crowd
indicator on the restaurant detail screen. Don't show this indicator at
all if there are fewer than 3 check-ins in the window — showing a
confident-looking but wrong crowd level is worse than showing nothing.
```

---

## Notes on ordering (why this sequence matters)

- **Schema before UI.** Every screen prompt after Step 2 assumes the tables exist — building UI first means redoing it when the schema inevitably changes.
- **Places proxy before any map/restaurant screen.** This is the piece most people vibe-code wrong — they let the client call Google directly with an exposed key, or they cache forbidden fields. Get this right once, in one place, and every other screen just calls your proxy.
- **Two separate Google Maps API keys, not one.** The server-only key (Places details/search) and the client-embedded key (map rendering) need different restrictions in Google Cloud Console. Mixing them up is the most common way people either break the map or leak a key with no restrictions.
- **Booking/payments come after discovery works.** No point building a reservation system before you've validated the discovery UX with real restaurants and users (see Phase 0 validation from earlier in our conversation — do that before Step 1, not after).
- **AI recommendation, food camera, mood search are deliberately absent from this plan.** Add them as later prompts once you have enough tagged restaurant/menu data for an LLM prompt to return good results — building them on an empty database just produces bad demos.
