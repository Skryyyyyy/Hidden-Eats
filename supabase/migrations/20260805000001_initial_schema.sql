-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Custom Enums
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE tag_category AS ENUM ('mood', 'budget', 'occasion', 'amenity');

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Restaurants Table
-- IMPORTANT: Per Google Places API policy, Google place details (name, address, ratings, photos)
-- are NOT stored in Postgres. Only google_place_id is stored long-term.
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id TEXT UNIQUE NOT NULL,
  cached_lat NUMERIC(10, 7),
  cached_lng NUMERIC(10, 7),
  lat_lng_cached_at TIMESTAMPTZ,
  hidden_gem_score NUMERIC(3, 1),
  curated_tags TEXT[] DEFAULT '{}',
  is_bookable BOOLEAN DEFAULT false NOT NULL,
  added_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Spatial index for cached location
CREATE INDEX idx_restaurants_cached_location ON public.restaurants USING gist (
  ST_SetSRID(ST_MakePoint(cached_lng, cached_lat), 4326)
);

-- 3. Menus Table
CREATE TABLE public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Menu Items Table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  photo_url TEXT,
  is_off_menu_secret BOOLEAN DEFAULT false NOT NULL,
  is_available BOOLEAN DEFAULT true NOT NULL,
  category TEXT DEFAULT 'General' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  food_quality INTEGER CHECK (food_quality BETWEEN 1 AND 5) NOT NULL,
  price_worth INTEGER CHECK (price_worth BETWEEN 1 AND 5) NOT NULL,
  service INTEGER CHECK (service BETWEEN 1 AND 5) NOT NULL,
  ambience INTEGER CHECK (ambience BETWEEN 1 AND 5) NOT NULL,
  consistency INTEGER CHECK (consistency BETWEEN 1 AND 5) NOT NULL,
  text_review TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Collections Table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Collection Items Table
CREATE TABLE public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  note TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  UNIQUE(collection_id, restaurant_id)
);

-- 8. Bookings Table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  booking_time TIMESTAMPTZ NOT NULL,
  status booking_status DEFAULT 'pending' NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Tags Table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category tag_category NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Restaurant Tags Join Table
CREATE TABLE public.restaurant_tags (
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (restaurant_id, tag_id)
);

-- Hidden Gem Score Recomputation Trigger Function
CREATE OR REPLACE FUNCTION public.recompute_hidden_gem_score()
RETURNS TRIGGER AS $$
DECLARE
  avg_score NUMERIC(3, 1);
BEGIN
  SELECT ROUND(
    AVG(
      (food_quality * 0.4 + price_worth * 0.25 + consistency * 0.15 + service * 0.1 + ambience * 0.1) * 2.0
    )::numeric, 1
  )
  INTO avg_score
  FROM public.reviews
  WHERE restaurant_id = NEW.restaurant_id;

  UPDATE public.restaurants
  SET hidden_gem_score = avg_score
  WHERE id = NEW.restaurant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_hidden_gem_score
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recompute_hidden_gem_score();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Public read, self edit
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Restaurants: Public read
CREATE POLICY "Restaurants are viewable by everyone" ON public.restaurants FOR SELECT USING (true);

-- Menus & Menu Items: Public read
CREATE POLICY "Menus are viewable by everyone" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Menu items are viewable by everyone" ON public.menu_items FOR SELECT USING (true);

-- Reviews: Public read, authenticated insert, self update/delete
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can write reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can edit own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Collections: Public read if is_public, owner full access
CREATE POLICY "Public collections are viewable by everyone" ON public.collections FOR SELECT USING (is_public OR auth.uid() = user_id);
CREATE POLICY "Users can create collections" ON public.collections FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON public.collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON public.collections FOR DELETE USING (auth.uid() = user_id);

-- Collection Items: Viewable if collection is viewable
CREATE POLICY "Collection items are viewable if collection is viewable" ON public.collection_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.collections c
    WHERE c.id = collection_id AND (c.is_public OR c.user_id = auth.uid())
  )
);
CREATE POLICY "Users can modify own collection items" ON public.collection_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.collections c
    WHERE c.id = collection_id AND c.user_id = auth.uid()
  )
);

-- Bookings: Viewable and modifiable by booking owner
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Tags: Public read
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Restaurant tags are viewable by everyone" ON public.restaurant_tags FOR SELECT USING (true);
