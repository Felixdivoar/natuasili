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
  'Ol Pejeta Conservancy is East Africas largest black rhino sanctuary and home to the last two northern white rhinos on Earth, pioneering cutting-edge conservation technology and community partnerships.',
  'Ol Pejeta Conservancy stands as one of Kenyas most significant conservation success stories, spanning 90,000 acres of the Laikipia plateau. As East Africas largest black rhino sanctuary, the conservancy is home to over 140 black rhinos and the worlds last two northern white rhinos, Najin and Fatu.

The conservancy represents a groundbreaking approach to conservation that balances wildlife protection with community development and sustainable land use. Through innovative partnerships with local communities, Ol Pejeta has created a model where conservation generates tangible benefits for surrounding populations while protecting critical wildlife habitat.

Our conservation programs encompass cutting-edge research in reproductive technology, including the groundbreaking efforts to save the northern white rhino through IVF and surrogate motherhood programs. The conservancy also maintains sophisticated anti-poaching operations with K-9 units, drone surveillance, and community ranger programs.

Beyond rhino conservation, Ol Pejeta protects a diverse ecosystem supporting the Big Five, endangered species like Grevys zebras, and over 300 bird species. The Sweetwaters Chimpanzee Sanctuary within the conservancy provides refuge for rescued chimpanzees, offering visitors unique insights into primate conservation.

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