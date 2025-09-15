-- Update the existing admin partner profile to be "Curated by Natuasili"
UPDATE public.partner_profiles 
SET 
  org_name = 'Curated by Natuasili',
  slug = 'curated-by-natuasili',
  kyc_status = 'approved',
  bio = 'Official NatuAsili curated conservation experiences. Carefully selected adventures that support wildlife conservation and local communities across Kenya.',
  location = 'Kenya',
  updated_at = now()
WHERE user_id = 'e11a899e-d228-4f67-ae18-2b2b95e5fb5d';