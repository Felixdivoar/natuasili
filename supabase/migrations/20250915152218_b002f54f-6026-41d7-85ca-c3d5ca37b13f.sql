-- Create partner entry for Sera Conservancy
INSERT INTO partners (
  slug,
  name,
  tagline,
  short_bio,
  long_bio,
  location_text,
  lat,
  lng,
  website,
  contact_email,
  hero_image_url,
  logo_image_url,
  stats
) VALUES (
  'sera-conservancy',
  'Sera Conservancy',
  'Community-led rhino conservation in Northern Kenya',
  'The first and only community-managed black rhino sanctuary in East Africa, pioneering conservation efforts in Samburu.',
  'Established in 2015 after a 30-year absence caused by poaching, Sera Conservancy has successfully reintroduced black rhinos and, in 2024, expanded conservation efforts by introducing southern white rhinos. Covering 26,000 acres of wilderness in Samburu, this community-managed sanctuary is home to the "Samburu Special Five": reticulated giraffe, Grevy''s zebra, Beisa oryx, Somali ostrich, and gerenuk. The conservancy demonstrates how community stewardship drives wildlife protection while creating sustainable livelihoods for local people. Guided by expert Samburu trackers and armed rangers, visitors can experience the unique opportunity to track both black and white rhinos on foot - the only place in Northern Kenya where this is possible.',
  'Sera Conservancy, Samburu County, Kenya',
  1.4472,
  37.0942,
  'https://sera-conservancy.org',
  'info@sera-conservancy.org',
  '/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png',
  '/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png',
  '{
    "rhinos_protected": 15,
    "area_hectares": 10522,
    "community_members": 250,
    "established_year": 2015,
    "species_count": 45
  }'::jsonb
);

-- Add some media for the partner gallery
INSERT INTO partner_media (partner_id, url, alt, sort) 
SELECT 
  p.id,
  '/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png',
  'Sera Conservancy rhino tracking experience',
  1
FROM partners p WHERE p.slug = 'sera-conservancy'

UNION ALL

SELECT 
  p.id,
  '/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png',
  'Rhino in Sera Conservancy landscape',
  2
FROM partners p WHERE p.slug = 'sera-conservancy'

UNION ALL

SELECT 
  p.id,
  '/lovable-uploads/ffc54bd4-ba6d-45be-8795-340f600c6ba3.png',
  'Community rangers at Sera Conservancy',
  3
FROM partners p WHERE p.slug = 'sera-conservancy';