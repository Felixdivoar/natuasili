-- Create the official "Curated by Natuasili" partner profile for the admin
INSERT INTO public.partner_profiles (
  user_id, 
  org_name, 
  slug, 
  kyc_status, 
  bio,
  location
)
SELECT 
  p.id,
  'Curated by Natuasili',
  'curated-by-natuasili',
  'approved',
  'Official NatuAsili curated conservation experiences. Carefully selected adventures that support wildlife conservation and local communities across Kenya.',
  'Kenya'
FROM public.profiles p 
WHERE p.email = 'felixongoma@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.partner_profiles pp 
  WHERE pp.user_id = p.id AND pp.org_name = 'Curated by Natuasili'
);