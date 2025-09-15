-- Fix RLS policies to allow proper cart and booking operations
-- Update payments table RLS policy for better security
DROP POLICY IF EXISTS "Service role can manage payments" ON public.payments;

-- Create more specific policies for payments
CREATE POLICY "Authenticated users can create payments for their bookings" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = payments.booking_id 
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their payment records" 
ON public.payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = payments.booking_id 
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage all payment records" 
ON public.payments 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Update booking policies to ensure proper access
CREATE POLICY "Service role can update booking status" 
ON public.bookings 
FOR UPDATE 
USING (auth.role() = 'service_role'::text);

-- Ensure cart items can be properly managed
CREATE POLICY "Service role can manage cart items" 
ON public.cart_items 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Add index for better performance on cart operations
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_tracking_id ON public.payments(order_tracking_id);

-- Fix missing reference column in payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS reference text;

-- Add missing raw column for storing Pesapal response data
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS raw jsonb DEFAULT '{}'::jsonb;

-- Add missing channel column
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS channel text DEFAULT 'pesapal'::text;