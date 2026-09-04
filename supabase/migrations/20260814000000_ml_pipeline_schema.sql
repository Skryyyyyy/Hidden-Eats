-- Migration to support ML Pipeline ingestion without Google Places API

-- 1. Modify the restaurants table
ALTER TABLE public.restaurants 
  ALTER COLUMN google_place_id DROP NOT NULL,
  ADD COLUMN name TEXT,
  ADD COLUMN address TEXT,
  ADD COLUMN source_video_url TEXT,
  ADD COLUMN vibe_summary TEXT;

-- 2. Modify the menu_items table
-- It already has name, description, price, which is perfect for our dishes array.
-- We will just make price optional (nullable) because vloggers might not always state the price.
ALTER TABLE public.menu_items
  ALTER COLUMN price DROP NOT NULL;
