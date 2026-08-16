-- Database Migration: Add Bitmoji Avatar, YouTube Scraper NLP, and Currency Columns
-- File: supabase/migrations/20260816000004_bitmoji_youtube_scraper.sql

-- 1. Extend Profiles Table for Bitmoji SVG & Language Preferences
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bitmoji_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'INR';

-- 2. Create Scraped Hidden Food Spots Table for YouTube NLP Extraction
CREATE TABLE IF NOT EXISTS public.scraped_hidden_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  video_url TEXT,
  shop_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  signature_dish TEXT,
  estimated_price TEXT,
  confidence_score NUMERIC(3, 2) DEFAULT 0.90,
  verified_status TEXT DEFAULT 'AI_EXTRACTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Spatial Radius Radar Queries
CREATE INDEX IF NOT EXISTS idx_scraped_shops_coords ON public.scraped_hidden_shops(latitude, longitude);

-- Row Level Security (RLS) Policies
ALTER TABLE public.scraped_hidden_shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for scraped hidden spots"
  ON public.scraped_hidden_shops FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert scraped hidden spots"
  ON public.scraped_hidden_shops FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
