-- Fix bookings table structure and RLS policies

-- First, add missing columns to bookings table if they don't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS option_id TEXT,
ADD COLUMN IF NOT EXISTS unit_price_kes NUMERIC,
ADD COLUMN IF NOT EXISTS subtotal_kes NUMERIC;

-- Update RLS policies for bookings table
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Partners can view bookings for their experiences" ON bookings;

-- Create proper RLS policies for bookings
CREATE POLICY "Users can create their own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Partners can view bookings for their experiences" 
ON bookings FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM experiences e 
  JOIN partner_profiles pp ON e.partner_id = pp.id 
  WHERE e.id = bookings.experience_id AND pp.user_id = auth.uid()
));

-- Ensure payments table has proper RLS for service role
DROP POLICY IF EXISTS "Service role can manage payments" ON payments;
CREATE POLICY "Service role can manage payments" 
ON payments FOR ALL 
USING (true);