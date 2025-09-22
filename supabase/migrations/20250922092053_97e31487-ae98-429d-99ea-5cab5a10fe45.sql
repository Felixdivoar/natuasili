-- Fix function search path issues for security compliance
CREATE OR REPLACE FUNCTION public.notify_partner_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify admins when new partner application is submitted
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    SELECT 
      ur.user_id,
      'New Partner Application',
      'A new partner application from ' || NEW.org_name || ' requires review.',
      'info',
      NEW.id,
      'partner_application'
    FROM user_roles ur 
    WHERE ur.role = 'admin'::app_role;
  END IF;
  
  -- Notify partner when application status changes
  IF TG_OP = 'UPDATE' AND OLD.kyc_status != NEW.kyc_status THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.kyc_status = 'approved' THEN 'Application Approved!'
        WHEN NEW.kyc_status = 'rejected' THEN 'Application Update'
        WHEN NEW.kyc_status = 'requires_documents' THEN 'Additional Documents Required'
        ELSE 'Application Status Update'
      END,
      CASE 
        WHEN NEW.kyc_status = 'approved' THEN 'Congratulations! Your partner application has been approved. You can now start creating experiences.'
        WHEN NEW.kyc_status = 'rejected' THEN 'Your partner application has been reviewed. Please check your email for details.'
        WHEN NEW.kyc_status = 'requires_documents' THEN 'Additional documents are required for your application. Please upload them to continue.'
        ELSE 'Your partner application status has been updated to: ' || NEW.kyc_status
      END,
      CASE 
        WHEN NEW.kyc_status = 'approved' THEN 'success'
        WHEN NEW.kyc_status = 'rejected' THEN 'warning'
        ELSE 'info'
      END,
      NEW.id,
      'partner_application'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;