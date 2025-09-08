-- Create payments table with proper structure
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  reference TEXT NOT NULL,
  order_tracking_id TEXT UNIQUE,
  status TEXT DEFAULT 'PENDING',
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  channel TEXT NOT NULL DEFAULT 'pesapal',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  raw JSONB
);

-- Create payment_events table
CREATE TABLE IF NOT EXISTS public.payment_events (
  id BIGSERIAL PRIMARY KEY,
  order_tracking_id TEXT NOT NULL,
  event JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = payments.booking_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all payments" ON public.payments
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for payment_events  
CREATE POLICY "Service role can manage payment events" ON public.payment_events
  FOR ALL USING (auth.role() = 'service_role');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at_trigger
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_payments_updated_at();