-- Allow guest bookings by making user_id nullable and updating RLS policies
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow guest bookings
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Only travelers can create bookings" ON bookings;

-- Allow any authenticated or unauthenticated user to create bookings
CREATE POLICY "Allow booking creation for guests and users" 
ON bookings 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and matches the booking user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Allow if booking is for a guest (user_id is null)
  (user_id IS NULL)
);

-- Allow users and service role to view bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;

CREATE POLICY "Users can view own bookings or guest bookings by email" 
ON bookings 
FOR SELECT 
USING (
  -- Users can view their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Service role can view all bookings
  (auth.role() = 'service_role') OR
  -- Admins can view all bookings
  is_admin_or_has_role('admin'::app_role)
);