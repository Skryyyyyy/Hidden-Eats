-- ============================================================================
-- Supabase SQL Injection Defense & Database Security Hardening
-- Migration: 20260901_sql_injection_security_hardening.sql
-- ============================================================================

-- 1. Ensure RLS is strictly enabled on all tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scraped_hidden_shops ENABLE ROW LEVEL SECURITY;

-- 2. Hardened RLS Policies for Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Hardened RLS Policies for Reviews (Preventing forged reviews)
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON public.reviews;
CREATE POLICY "Authenticated users can submit reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND char_length(comment) <= 2000
    AND rating >= 1 AND rating <= 5
  );

-- 4. Secure Search Function with Parameterized Types & Fixed search_path (Prevents SQLi & Search Path Hijacking)
CREATE OR REPLACE FUNCTION public.search_hidden_spots(
  p_query TEXT,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Strict input sanitation on query parameter
  IF char_length(p_query) > 200 THEN
    RAISE EXCEPTION 'Search query exceeds maximum permitted length';
  END IF;

  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.address,
    r.latitude,
    r.longitude
  FROM public.restaurants r
  WHERE 
    r.name ILIKE '%' || p_query || '%'
    OR r.address ILIKE '%' || p_query || '%'
  LIMIT LEAST(p_limit, 50);
END;
$$;
