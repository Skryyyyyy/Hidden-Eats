-- ==============================================================================
-- Migration: Multi-Tenant Row Level Security (RLS) & Realtime Broadcast Hardening
-- Date: 2026-09-02
-- Security Scope: Prevent cross-restaurant data leakage and secure WebSocket sync
-- ==============================================================================

-- 1. Ensure RLS is enabled on Orders
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies if present
DROP POLICY IF EXISTS "Kitchens view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Drivers view assigned orders" ON public.orders;

-- Policy A: Restaurant Partners can only view and update orders for their kitchen
CREATE POLICY "Kitchens view own orders"
ON public.orders
FOR ALL
TO authenticated
USING (
  restaurant_id = auth.uid() OR 
  auth.jwt() ->> 'role' = 'service_role'
)
WITH CHECK (
  restaurant_id = auth.uid() OR 
  auth.jwt() ->> 'role' = 'service_role'
);

-- Policy B: Customers can only view orders they placed
CREATE POLICY "Customers view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid() OR
  customer_phone = (auth.jwt() ->> 'phone')
);

-- Policy C: Delivery Drivers can view orders assigned to them or in ready status
CREATE POLICY "Drivers view assigned orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  driver_id = auth.uid() OR 
  (status = 'ready' AND driver_id IS NULL)
);

-- 2. Ensure RLS is enabled on Bookings
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kitchens view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Diners view own bookings" ON public.bookings;

-- Policy A: Restaurant Partners can manage bookings for their location
CREATE POLICY "Kitchens view own bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (
  restaurant_id = auth.uid() OR 
  auth.jwt() ->> 'role' = 'service_role'
)
WITH CHECK (
  restaurant_id = auth.uid() OR 
  auth.jwt() ->> 'role' = 'service_role'
);

-- Policy B: Diners can only view their own reservation records
CREATE POLICY "Diners view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  diner_id = auth.uid() OR
  diner_phone = (auth.jwt() ->> 'phone')
);

-- 3. Configure Realtime Replication with RLS
-- Ensures WebSocket clients only receive changes to rows they are authorized to SELECT
ALTER PUBLICATION IF EXISTS supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION IF EXISTS supabase_realtime ADD TABLE public.bookings;
