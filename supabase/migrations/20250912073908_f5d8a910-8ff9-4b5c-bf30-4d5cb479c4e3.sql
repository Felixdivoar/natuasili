-- Fix RLS policies on bookings table to restrict to authenticated users only
-- Drop existing policies that are too permissive
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;  
DROP POLICY IF EXISTS "Partners can view bookings for their experiences" ON public.bookings;

-- Create new secure policies restricted to authenticated users
CREATE POLICY "Authenticated users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated partners can view bookings for their experiences"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM experiences e
    JOIN partner_profiles pp ON e.partner_id = pp.id
    WHERE e.id = bookings.experience_id 
    AND pp.user_id = auth.uid()
  )
);

-- Also add admin access for booking management
CREATE POLICY "Admins can manage all bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'::app_role
  )
);