-- Add withdrawal requests table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
  amount_kes INTEGER NOT NULL CHECK (amount_kes >= 2000),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on withdrawal_requests
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for withdrawal_requests
CREATE POLICY "Partners can insert their own withdrawal requests" 
ON public.withdrawal_requests 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM partner_profiles pp 
  WHERE pp.id = withdrawal_requests.partner_id 
  AND pp.user_id = auth.uid()
));

CREATE POLICY "Partners can view their own withdrawal requests" 
ON public.withdrawal_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM partner_profiles pp 
  WHERE pp.id = withdrawal_requests.partner_id 
  AND pp.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all withdrawal requests" 
ON public.withdrawal_requests 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'::app_role
));

-- Add notifications table for withdrawal request alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read_at TIMESTAMP WITH TIME ZONE,
  related_id UUID,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to create notifications when withdrawal requests are made
CREATE OR REPLACE FUNCTION notify_withdrawal_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all admins when a new withdrawal request is created
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    SELECT 
      ur.user_id,
      'New Withdrawal Request',
      'Partner has requested a withdrawal of KES ' || NEW.amount_kes || '. Review required.',
      'info',
      NEW.id,
      'withdrawal_request'
    FROM user_roles ur 
    WHERE ur.role = 'admin'::app_role;
  END IF;
  
  -- Notify partner when request is approved/rejected
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    SELECT 
      pp.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Withdrawal Approved'
        ELSE 'Withdrawal Request Update'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Your withdrawal request for KES ' || NEW.amount_kes || ' has been approved and will be processed shortly.'
        ELSE 'Your withdrawal request for KES ' || NEW.amount_kes || ' has been ' || NEW.status || '.'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        ELSE 'warning'
      END,
      NEW.id,
      'withdrawal_request'
    FROM partner_profiles pp
    WHERE pp.id = NEW.partner_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for withdrawal request notifications
CREATE TRIGGER withdrawal_request_notifications
  AFTER INSERT OR UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION notify_withdrawal_request();

-- Update trigger for withdrawal_requests updated_at
CREATE TRIGGER update_withdrawal_requests_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();