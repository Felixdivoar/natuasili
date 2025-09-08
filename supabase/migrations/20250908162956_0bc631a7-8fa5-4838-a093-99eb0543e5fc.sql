-- Clean up the messages table to match our simple booking-based messaging system
DROP TABLE IF EXISTS public.messages CASCADE;

-- Recreate the messages table with our intended structure
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view messages for their bookings" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = messages.booking_id 
    AND bookings.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.experiences e ON b.experience_id = e.id
    JOIN public.partner_profiles pp ON e.partner_id = pp.id
    WHERE b.id = messages.booking_id 
    AND pp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages for their bookings" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = messages.booking_id 
      AND bookings.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.experiences e ON b.experience_id = e.id
      JOIN public.partner_profiles pp ON e.partner_id = pp.id
      WHERE b.id = messages.booking_id 
      AND pp.user_id = auth.uid()
    )
  )
);

-- Admin can view all messages
CREATE POLICY "Admins can view all messages" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_message_read(message_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.messages 
  SET read_at = now() 
  WHERE id = message_id 
  AND (
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = messages.booking_id 
      AND bookings.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.experiences e ON b.experience_id = e.id
      JOIN public.partner_profiles pp ON e.partner_id = pp.id
      WHERE b.id = messages.booking_id 
      AND pp.user_id = auth.uid()
    )
  );
END;
$$;