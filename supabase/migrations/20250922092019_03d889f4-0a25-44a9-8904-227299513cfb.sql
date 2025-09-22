-- Add document storage and enhanced application fields to partner_profiles
ALTER TABLE partner_profiles
ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS business_registration_number text,
ADD COLUMN IF NOT EXISTS tax_certificate_url text,
ADD COLUMN IF NOT EXISTS business_license_url text,
ADD COLUMN IF NOT EXISTS conservation_permits_url text,
ADD COLUMN IF NOT EXISTS insurance_certificate_url text,
ADD COLUMN IF NOT EXISTS bank_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS application_notes text,
ADD COLUMN IF NOT EXISTS reviewed_by uuid,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Update KYC status to include more states
ALTER TABLE partner_profiles 
ADD CONSTRAINT check_kyc_status 
CHECK (kyc_status IN ('pending', 'under_review', 'approved', 'rejected', 'requires_documents'));

-- Create notifications trigger for partner applications
CREATE OR REPLACE FUNCTION public.notify_partner_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger for partner application notifications
DROP TRIGGER IF EXISTS partner_application_notifications ON partner_profiles;
CREATE TRIGGER partner_application_notifications
  AFTER INSERT OR UPDATE ON partner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_application();