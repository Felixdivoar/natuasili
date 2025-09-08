-- Add donation amount field to bookings table
ALTER TABLE public.bookings 
ADD COLUMN donation_kes integer DEFAULT 0 NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.bookings.donation_kes IS 'Optional donation amount in KES that goes 100% to partners (minus transfer charges)';