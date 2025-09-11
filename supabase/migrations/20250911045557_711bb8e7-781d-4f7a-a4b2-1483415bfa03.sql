-- Insert the Laikipia experiences for Ol Pejeta
WITH ol_pejeta AS (
  SELECT id FROM partners WHERE slug = 'ol-pejeta-conservancy'
)
INSERT INTO experiences (
  id,
  partner_id,
  slug,
  title,
  hero_image,
  description,
  location_text,
  price_kes_adult,
  child_half_price_rule,
  capacity,
  min_capacity,
  duration_hours,
  themes,
  activities,
  gallery,
  visible_on_marketplace
) 
SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'meet-northern-white-rhinos-ol-pejeta',
  'Meet the last northern white rhinos at Ol Pejeta Conservancy',
  '/assets/northern-white-rhinos.jpg',
  'At Ol Pejeta Conservancy, witness one of conservations most critical moments by meeting the last two northern white rhinos on Earth - Najin and Fatu, both female. This experience offers an intimate look at cutting-edge conservation science as researchers work tirelessly to save this subspecies through advanced reproductive technology.',
  'Ol Pejeta Conservancy, Laikipia County',
  3500,
  true,
  12,
  2,
  3.0,
  '["Wildlife conservation"]'::jsonb,
  '["rhino", "wildlife", "conservation"]'::jsonb,
  '["/assets/northern-white-rhinos.jpg", "/assets/ol-pejeta-rhino.jpg", "/assets/partner-ol-pejeta.jpg"]'::jsonb,
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'night-game-drive-ol-pejeta',
  'Night game drive at Ol Pejeta Conservancy',
  '/assets/night-game-drive.jpg',
  'Experience the African wilderness after dark on this thrilling night game drive at Ol Pejeta Conservancy. As the sun sets over the Laikipia plateau, a different world awakens. Using specialized spotlights and expert guidance, you will search for elusive nocturnal species including leopards, serval cats, genets, bush babies, and hyenas.',
  'Ol Pejeta Conservancy, Laikipia County',
  4500,
  true,
  8,
  2,
  4.0,
  '["Wildlife conservation"]'::jsonb,
  '["night safari", "wildlife", "nocturnal"]'::jsonb,
  '["/assets/night-game-drive.jpg", "/assets/big-five-tracking.jpg", "/assets/partner-ol-pejeta.jpg"]'::jsonb,
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'bush-bird-walks-ol-pejeta',
  'Guided bush and bird walks at Ol Pejeta Conservancy',
  '/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png',
  'Explore Ol Pejeta Conservancy on foot with expert guides who will introduce you to the intricate ecosystems of the Laikipia plateau. These walking safaris offer an intimate connection with nature, allowing you to experience wildlife and landscapes from a completely different perspective than traditional game drives.',
  'Ol Pejeta Conservancy, Laikipia County',
  2000,
  true,
  10,
  2,
  3.0,
  '["Conservation education"]'::jsonb,
  '["walking", "birds", "nature"]'::jsonb,
  '["/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png", "/assets/nature-kenya-birdwatching.jpg", "/assets/partner-ol-pejeta.jpg"]'::jsonb,
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'chimpanzee-sanctuary-ol-pejeta',
  'Behind the scenes - Ol Pejeta Sweetwaters Chimpanzee Sanctuary',
  '/assets/chimpanzee-sanctuary.jpg',
  'Visit the Sweetwaters Chimpanzee Sanctuary, the only chimpanzee sanctuary in Kenya and a haven for rescued and orphaned chimpanzees. This unique facility within Ol Pejeta Conservancy provides a safe home for chimpanzees that cannot be returned to the wild.',
  'Ol Pejeta Conservancy, Laikipia County',
  2500,
  true,
  15,
  2,
  2.0,
  '["Wildlife conservation"]'::jsonb,
  '["chimpanzee", "sanctuary", "primates"]'::jsonb,
  '["/assets/chimpanzee-sanctuary.jpg", "/assets/partner-ol-pejeta.jpg", "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"]'::jsonb,
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'lion-tracking-ol-pejeta',
  'Track lions and aid conservation at Ol Pejeta Conservancy',
  '/assets/lion-tracking.jpg',
  'Join Ol Pejetas lion research team in active conservation work by participating in lion tracking and monitoring activities. This hands-on experience puts you at the forefront of predator conservation, using radio telemetry and field observation techniques.',
  'Ol Pejeta Conservancy, Laikipia County',
  5500,
  false,
  8,
  2,
  5.0,
  '["Wildlife conservation"]'::jsonb,
  '["lions", "tracking", "research"]'::jsonb,
  '["/assets/lion-tracking.jpg", "/assets/big-five-tracking.jpg", "/assets/partner-ol-pejeta.jpg"]'::jsonb,
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'k9-handler-day-ol-pejeta',
  'Become a K-9 handler for a day at Ol Pejeta Conservancy',
  '/assets/k9-handler-training.jpg',
  'See Ol Pejetas anti-poaching dog squad and experience hands-on conservation work. Talk to the dog keepers to learn about caring for specially trained canine teams. This is not only fun but also provides great training for the dogs.',
  'Ol Pejeta Conservancy, Laikipia County',
  2500,
  false,
  6,
  2,
  6.0,
  '["Wildlife conservation"]'::jsonb,
  '["k9", "anti-poaching", "dogs"]'::jsonb,
  '["/assets/k9-handler-training.jpg", "/assets/partner-ol-pejeta.jpg"]'::jsonb,
  true
FROM ol_pejeta;