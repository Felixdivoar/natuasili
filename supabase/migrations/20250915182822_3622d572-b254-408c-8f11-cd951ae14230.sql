-- Create function to auto-generate partner page when partner is approved
CREATE OR REPLACE FUNCTION public.auto_generate_partner_page()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_partner_id UUID;
BEGIN
  -- Only proceed if KYC status changed to 'approved'
  IF NEW.kyc_status = 'approved' AND (OLD.kyc_status IS NULL OR OLD.kyc_status != 'approved') THEN
    
    -- Check if partner already exists in partners table
    SELECT id INTO existing_partner_id
    FROM partners 
    WHERE slug = NEW.slug;
    
    -- If partner doesn't exist, create new partner record
    IF existing_partner_id IS NULL THEN
      INSERT INTO partners (
        id,
        name,
        slug,
        tagline,
        short_bio,
        long_bio,
        location_text,
        contact_email,
        logo_image_url,
        hero_image_url,
        website,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        NEW.org_name,
        NEW.slug,
        COALESCE(NEW.bio, 'Conservation partner working to protect Kenya''s wildlife and ecosystems'),
        COALESCE(NEW.bio, 'Conservation partner dedicated to wildlife protection and community engagement'),
        COALESCE(NEW.bio, 'Our organization is committed to conservation efforts that benefit both wildlife and local communities. We work tirelessly to protect Kenya''s natural heritage while supporting sustainable development initiatives.'),
        NEW.location,
        (NEW.contacts->0->>'email'),
        NEW.logo,
        NEW.logo, -- Use logo as hero image if no separate hero image
        (NEW.contacts->0->>'website'),
        now(),
        now()
      );
      
      RAISE NOTICE 'Auto-generated partner page for: %', NEW.org_name;
    ELSE
      -- Update existing partner record with latest information
      UPDATE partners 
      SET 
        name = NEW.org_name,
        tagline = COALESCE(NEW.bio, 'Conservation partner working to protect Kenya''s wildlife and ecosystems'),
        short_bio = COALESCE(NEW.bio, 'Conservation partner dedicated to wildlife protection and community engagement'),
        long_bio = COALESCE(NEW.bio, 'Our organization is committed to conservation efforts that benefit both wildlife and local communities. We work tirelessly to protect Kenya''s natural heritage while supporting sustainable development initiatives.'),
        location_text = NEW.location,
        contact_email = (NEW.contacts->0->>'email'),
        logo_image_url = NEW.logo,
        hero_image_url = COALESCE(partners.hero_image_url, NEW.logo),
        website = (NEW.contacts->0->>'website'),
        updated_at = now()
      WHERE id = existing_partner_id;
      
      RAISE NOTICE 'Updated partner page for: %', NEW.org_name;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-generate partner page on approval
DROP TRIGGER IF EXISTS auto_generate_partner_page_on_approval ON partner_profiles;
CREATE TRIGGER auto_generate_partner_page_on_approval
  AFTER UPDATE ON partner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_partner_page();

-- Also create partner page for any existing approved partners that don't have one
INSERT INTO partners (
  id,
  name,
  slug,
  tagline,
  short_bio,
  long_bio,
  location_text,
  contact_email,
  logo_image_url,
  hero_image_url,
  website,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  pp.org_name,
  pp.slug,
  COALESCE(pp.bio, 'Conservation partner working to protect Kenya''s wildlife and ecosystems'),
  COALESCE(pp.bio, 'Conservation partner dedicated to wildlife protection and community engagement'),
  COALESCE(pp.bio, 'Our organization is committed to conservation efforts that benefit both wildlife and local communities. We work tirelessly to protect Kenya''s natural heritage while supporting sustainable development initiatives.'),
  pp.location,
  (pp.contacts->0->>'email'),
  pp.logo,
  pp.logo,
  (pp.contacts->0->>'website'),
  now(),
  now()
FROM partner_profiles pp
WHERE pp.kyc_status = 'approved'
  AND NOT EXISTS (
    SELECT 1 FROM partners p WHERE p.slug = pp.slug
  );

-- Add RLS policy to only show approved partners publicly
DROP POLICY IF EXISTS "Public can only view partners with approved profiles" ON partners;
CREATE POLICY "Public can only view partners with approved profiles"
ON partners
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partner_profiles pp
    WHERE pp.slug = partners.slug
    AND pp.kyc_status = 'approved'
  )
);