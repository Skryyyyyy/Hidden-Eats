# 🗺️ Step 15: Open-Source Map Engine Decoupling & Modular Viewport Staging

**Date:** 2026-09-02  
**Scope:** Explorer In-App Location Viewport & Map Architecture  
**Status:** Completed & Verified  

---

## 📋 Summary of Changes

1. **Map Engine Decoupling (`apps/web/src/app/explorer/map/page.tsx`)**:
   - Removed the open-source `maplibre-gl` raster/vector rendering engine and OSRM tile network hooks from `/explorer/map`.
   - Replaced the map viewport with a lightweight visual grid & interactive Gem Grid location canvas.
   - Preserved all surrounding features and controls:
     - Search & NLP YouTube Scraper integration
     - Multi-Stop Food Crawl (TSP) Drawer
     - AR Alley Compass Modal
     - Turn-by-Turn GPS Navigation HUD & Web Speech Voice Guidance
     - Direct seat booking modal
     - Location spot details and crowd indicators

2. **Prepared Slot for Next Map Tool**:
   - The viewport container is structured to easily integrate any upcoming map SDK (e.g. Google Maps JavaScript API, Mapbox, or specialized location SDK).

---

## 🔍 Verification Results
- **TypeScript Compilation:** `npx tsc --noEmit` passed with 0 errors.
- **UI Integrity:** All UI panels, search tools, navigation drawers, and HUD banners function seamlessly without any maplibre dependencies.
