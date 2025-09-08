-- Enable real-time updates for all relevant tables
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.experiences REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.partner_profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication for live updates (skip if already exists)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already exists in publication, skip
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.experiences;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already exists in publication, skip
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already exists in publication, skip
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_profiles;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already exists in publication, skip
        NULL;
    END;
END $$;

-- Add trigger to bookings table to auto-update impact metrics
DROP TRIGGER IF EXISTS update_impact_metrics_on_booking_change ON public.bookings;
CREATE TRIGGER update_impact_metrics_on_booking_change
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_impact_metrics();