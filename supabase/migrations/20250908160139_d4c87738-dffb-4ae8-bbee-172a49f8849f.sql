-- First, create missing partner profiles for existing partner users
INSERT INTO public.partner_profiles (user_id, org_name, slug, kyc_status)
SELECT 
  p.id,
  COALESCE(p.first_name || ' ' || p.last_name, p.email) as org_name,
  LOWER(REPLACE(COALESCE(p.first_name || '-' || p.last_name, p.email), ' ', '-')) as slug,
  'pending' as kyc_status
FROM profiles p
LEFT JOIN partner_profiles pp ON p.id = pp.user_id
WHERE p.role = 'partner' AND pp.id IS NULL;

-- Update the handle_new_user function to create partner profiles for new partner users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
  first_name text;
  last_name text;
  org_name text;
  slug_base text;
BEGIN
  -- Extract values from metadata
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'traveler');
  first_name := new.raw_user_meta_data->>'first_name';
  last_name := new.raw_user_meta_data->>'last_name';

  -- Insert into profiles table with first_name and last_name from metadata
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    user_role,
    first_name,
    last_name
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = now();

  -- Insert into user_roles table based on role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id, 
    CASE 
      WHEN user_role = 'partner' THEN 'partner'::app_role
      WHEN user_role = 'admin' THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  -- If the user is a partner, create a partner profile
  IF user_role = 'partner' THEN
    -- Generate org name and slug from user data
    org_name := COALESCE(first_name || ' ' || last_name, new.email);
    slug_base := LOWER(REPLACE(COALESCE(first_name || '-' || last_name, SPLIT_PART(new.email, '@', 1)), ' ', '-'));
    
    -- Insert partner profile
    INSERT INTO public.partner_profiles (user_id, org_name, slug, kyc_status)
    VALUES (
      new.id,
      org_name,
      slug_base,
      'pending'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      org_name = COALESCE(EXCLUDED.org_name, partner_profiles.org_name),
      updated_at = now();
  END IF;

  RETURN new;
END;
$$;