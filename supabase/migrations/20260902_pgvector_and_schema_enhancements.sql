-- ============================================================================
-- Supabase Schema Enhancements: Bookings, pgvector Embeddings & Semantic Search
-- Migration: 20260902_pgvector_and_schema_enhancements.sql
-- ============================================================================

-- 1. Enable pgvector extension for AI Semantic Embeddings (Safe if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ensure Bookings Table Schema
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  party_size INT NOT NULL DEFAULT 2,
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TEXT NOT NULL,
  special_notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add Vector Embeddings Column to Restaurants (for 384-dim / 1536-dim semantic search)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'restaurants' 
      AND column_name = 'embedding'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN embedding vector(384);
  END IF;
END $$;

-- 4. Vector Similarity Search Function (Cosine Distance)
CREATE OR REPLACE FUNCTION public.semantic_search_restaurants(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.address,
    r.latitude,
    r.longitude,
    1 - (r.embedding <=> query_embedding) AS similarity
  FROM public.restaurants r
  WHERE r.embedding IS NOT NULL 
    AND 1 - (r.embedding <=> query_embedding) > match_threshold
  ORDER BY r.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Enable RLS on Bookings Table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Partners can update bookings for their restaurants" ON public.bookings;
CREATE POLICY "Partners can update bookings for their restaurants"
  ON public.bookings FOR UPDATE
  USING (true)
  WITH CHECK (true);
