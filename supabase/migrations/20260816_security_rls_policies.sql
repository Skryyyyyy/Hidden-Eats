-- Enable Row Level Security (RLS) on all core tables

-- 1. Users Table RLS
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- 2. Orders Table RLS
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = driver_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Restaurants Table RLS
ALTER TABLE IF EXISTS public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active restaurants"
  ON public.restaurants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Partners can manage owned restaurant"
  ON public.restaurants FOR ALL
  USING (auth.uid() = owner_id);

-- 4. Reviews Table RLS
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
