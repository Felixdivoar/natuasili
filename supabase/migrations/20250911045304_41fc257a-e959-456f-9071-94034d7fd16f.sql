-- Insert Ol Pejeta Conservancy as a partner
INSERT INTO partners (
  id,
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
  stats,
  socials
) VALUES (
  gen_random_uuid(),
  'ol-pejeta-conservancy',
  'Ol Pejeta Conservancy',
  'Protecting the last northern white rhinos and pioneering innovative conservation',
  'Ol Pejeta Conservancy is East Africa's largest black rhino sanctuary and home to the last two northern white rhinos on Earth, pioneering cutting-edge conservation technology and community partnerships.',
  'Ol Pejeta Conservancy stands as one of Kenya's most significant conservation success stories, spanning 90,000 acres of the Laikipia plateau. As East Africa's largest black rhino sanctuary, the conservancy is home to over 140 black rhinos and the world's last two northern white rhinos, Najin and Fatu.

The conservancy represents a groundbreaking approach to conservation that balances wildlife protection with community development and sustainable land use. Through innovative partnerships with local communities, Ol Pejeta has created a model where conservation generates tangible benefits for surrounding populations while protecting critical wildlife habitat.

Our conservation programs encompass cutting-edge research in reproductive technology, including the groundbreaking efforts to save the northern white rhino through IVF and surrogate motherhood programs. The conservancy also maintains sophisticated anti-poaching operations with K-9 units, drone surveillance, and community ranger programs.

Beyond rhino conservation, Ol Pejeta protects a diverse ecosystem supporting the Big Five, endangered species like Grevy's zebras, and over 300 bird species. The Sweetwaters Chimpanzee Sanctuary within the conservancy provides refuge for rescued chimpanzees, offering visitors unique insights into primate conservation.

Community engagement remains central to our mission. Through education programs, employment opportunities, and revenue sharing from tourism, Ol Pejeta demonstrates that conservation can be economically viable while supporting local livelihoods.',
  'Laikipia County, Kenya',
  0.0755,
  36.9070,
  'https://olpejetaconservancy.org',
  'info@olpejetaconservancy.org',
  '/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png',
  '/assets/partner-ol-pejeta.jpg',
  '{"hectares_protected": 36500, "wildlife_saved": 15000, "households_supported": 650, "years_active": 35, "rhinos_protected": 140, "species_conserved": 300}',
  '{"facebook": "https://facebook.com/olpejetaconservancy", "twitter": "https://twitter.com/olpejeta", "instagram": "https://instagram.com/olpejetaconservancy"}'
);

-- Get the partner ID for Ol Pejeta to use in experiences
-- We'll use a CTE to insert experiences with the correct partner_id
WITH ol_pejeta AS (
  SELECT id FROM partners WHERE slug = 'ol-pejeta-conservancy'
)

-- Insert the Laikipia experiences for Ol Pejeta
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
  'At Ol Pejeta Conservancy, witness one of conservation''s most critical moments by meeting the last two northern white rhinos on Earth - Najin and Fatu, both female. This experience offers an intimate look at cutting-edge conservation science as researchers work tirelessly to save this subspecies through advanced reproductive technology. Your visit directly supports the revolutionary conservation efforts using IVF, genetic rescue, and surrogate motherhood programs.',
  'Ol Pejeta Conservancy, Laikipia County',
  3500,
  true,
  12,
  2,
  3.0,
  '["Wildlife conservation"]',
  '["rhino", "wildlife", "conservation"]',
  '["/assets/northern-white-rhinos.jpg", "/assets/ol-pejeta-rhino.jpg", "/assets/partner-ol-pejeta.jpg"]',
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'night-game-drive-ol-pejeta',
  'Night game drive at Ol Pejeta Conservancy',
  '/assets/night-game-drive.jpg',
  'Experience the African wilderness after dark on this thrilling night game drive at Ol Pejeta Conservancy. As the sun sets over the Laikipia plateau, a different world awakens. Nocturnal animals emerge from their daytime hiding places, offering visitors a unique perspective on wildlife behavior and ecosystem dynamics. Using specialized spotlights and expert guidance, you''ll search for elusive nocturnal species including leopards, serval cats, genets, bush babies, and hyenas.',
  'Ol Pejeta Conservancy, Laikipia County',
  4500,
  true,
  8,
  2,
  4.0,
  '["Wildlife conservation"]',
  '["night safari", "wildlife", "nocturnal"]',
  '["/assets/night-game-drive.jpg", "/assets/big-five-tracking.jpg", "/assets/partner-ol-pejeta.jpg"]',
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'bush-bird-walks-ol-pejeta',
  'Guided bush and bird walks at Ol Pejeta Conservancy',
  '/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png',
  'Explore Ol Pejeta Conservancy on foot with expert guides who will introduce you to the intricate ecosystems of the Laikipia plateau. These walking safaris offer an intimate connection with nature, allowing you to experience wildlife and landscapes from a completely different perspective than traditional game drives. The conservancy''s diverse habitats support over 300 bird species and countless smaller wildlife often missed from vehicles.',
  'Ol Pejeta Conservancy, Laikipia County',
  2000,
  true,
  10,
  2,
  3.0,
  '["Conservation education"]',
  '["walking", "birds", "nature"]',
  '["/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png", "/assets/nature-kenya-birdwatching.jpg", "/assets/partner-ol-pejeta.jpg"]',
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'chimpanzee-sanctuary-ol-pejeta',
  'Behind the scenes – Ol Pejeta Sweetwaters Chimpanzee Sanctuary',
  '/assets/chimpanzee-sanctuary.jpg',
  'Visit the Sweetwaters Chimpanzee Sanctuary, the only chimpanzee sanctuary in Kenya and a haven for rescued and orphaned chimpanzees. This unique facility within Ol Pejeta Conservancy provides a safe home for chimpanzees that cannot be returned to the wild, while offering visitors insights into primate behavior, conservation, and the challenges facing our closest living relatives.',
  'Ol Pejeta Conservancy, Laikipia County',
  2500,
  true,
  15,
  2,
  2.0,
  '["Wildlife conservation"]',
  '["chimpanzee", "sanctuary", "primates"]',
  '["/assets/chimpanzee-sanctuary.jpg", "/assets/partner-ol-pejeta.jpg", "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png"]',
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'lion-tracking-ol-pejeta',
  'Track lions and aid conservation at Ol Pejeta Conservancy',
  '/assets/lion-tracking.jpg',
  'Join Ol Pejeta''s lion research team in active conservation work by participating in lion tracking and monitoring activities. This hands-on experience puts you at the forefront of predator conservation, using radio telemetry and field observation techniques to collect vital data about the conservancy''s lion population. Your participation directly contributes to ongoing research on lion behavior, territory usage, and human-wildlife conflict mitigation.',
  'Ol Pejeta Conservancy, Laikipia County',
  5500,
  false,
  8,
  2,
  5.0,
  '["Wildlife conservation"]',
  '["lions", "tracking", "research"]',
  '["/assets/lion-tracking.jpg", "/assets/big-five-tracking.jpg", "/assets/partner-ol-pejeta.jpg"]',
  true
FROM ol_pejeta

UNION ALL

SELECT 
  gen_random_uuid(),
  ol_pejeta.id,
  'k9-handler-day-ol-pejeta',
  'Become a K-9 handler for a day at Ol Pejeta Conservancy',
  '/assets/k9-handler-training.jpg',
  'See Ol Pejeta''s anti-poaching dog squad and experience hands-on conservation work. Talk to the dog keepers to learn about caring for specially trained canine teams. Try to hide from the sniffer dogs during the kennel tour - run, jump, twist, turn, and hide within the Morani Information Center area. This is not only fun but also provides great training for the dogs while giving you insights into crucial anti-poaching efforts.',
  'Ol Pejeta Conservancy, Laikipia County',
  2500,
  false,
  6,
  2,
  6.0,
  '["Wildlife conservation"]',
  '["k9", "anti-poaching", "dogs"]',
  '["/assets/k9-handler-training.jpg", "/assets/partner-ol-pejeta.jpg"]',
  true
FROM ol_pejeta;