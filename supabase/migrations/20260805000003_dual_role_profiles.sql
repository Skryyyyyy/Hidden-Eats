-- Custom Enums for User & Partner Roles
CREATE TYPE user_role AS ENUM ('explorer', 'partner', 'admin');
CREATE TYPE partner_staff_role AS ENUM ('owner', 'manager', 'chef');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'explorer' NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Restaurant Owners / Staff Join Table
CREATE TABLE IF NOT EXISTS public.restaurant_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  role partner_staff_role DEFAULT 'owner' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, restaurant_id)
);

-- RLS Policies for restaurant_owners
ALTER TABLE public.restaurant_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own ownerships" ON public.restaurant_owners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can create ownership" ON public.restaurant_owners FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Update RLS on restaurants and menu_items to allow owners to manage their venues
CREATE POLICY "Owners can update own restaurant" ON public.restaurants FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.restaurant_owners ro
    WHERE ro.restaurant_id = id AND ro.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can manage menu items" ON public.menu_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.menus m
    JOIN public.restaurant_owners ro ON ro.restaurant_id = m.restaurant_id
    WHERE m.id = menu_id AND ro.user_id = auth.uid()
  )
);
