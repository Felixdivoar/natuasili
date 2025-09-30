-- Insert/Update all partners to ensure they display on partners and destination pages

-- Ol Pejeta Conservancy
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email, 
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Ol Pejeta Conservancy',
  'ol-pejeta',
  'Home to the last two northern white rhinos on Earth',
  'A pioneering wildlife conservancy in Laikipia, Kenya',
  'Ol Pejeta Conservancy is a 90,000-acre not-for-profit wildlife conservancy in Central Kenya''s Laikipia County. It is the largest black rhino sanctuary in East Africa and home to the last two northern white rhinos on Earth.',
  'Laikipia, Central Kenya',
  'info@olpejetaconservancy.org',
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  'https://www.olpejetaconservancy.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Nature Kenya
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Nature Kenya',
  'nature-kenya',
  'Championing bird conservation and environmental stewardship',
  'Kenya''s premier conservation organization',
  'Nature Kenya is the leading conservation NGO in Kenya, dedicated to the conservation of birds, their habitats, and biodiversity.',
  'Nairobi, Kenya',
  'info@naturekenya.org',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
  'https://images.unsplash.com/photo-1551858173-0d67e01b2c47',
  'https://naturekenya.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- AFEW Giraffe Centre
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'AFEW Giraffe Centre',
  'afew-giraffe',
  'Protecting the endangered Rothschild giraffe',
  'Conservation through education and breeding program',
  'The African Fund for Endangered Wildlife (AFEW) runs the Giraffe Centre in Nairobi, dedicated to conservation education and protecting the endangered Rothschild giraffe.',
  'Karen, Nairobi',
  'info@giraffecentre.org',
  'https://images.unsplash.com/photo-1547721064-da6cfb341d50',
  'https://images.unsplash.com/photo-1534567110043-f95dc2ac99c8',
  'https://giraffecentre.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Mara Elephant Project
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Mara Elephant Project',
  'mara-elephant-project',
  'Protecting elephants and their habitats in the Mara ecosystem',
  'Community-based elephant conservation',
  'Mara Elephant Project protects elephants and their habitats through community engagement, anti-poaching operations, and innovative conservation strategies.',
  'Maasai Mara, Narok',
  'info@maraelephantproject.org',
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44',
  'https://images.unsplash.com/photo-1535083783855-76ae62b2914e',
  'https://www.maraelephantproject.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Colobus Conservation
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Colobus Conservation',
  'colobus-conservation',
  'Protecting coastal primates and their habitats',
  'Primate conservation on the Kenyan coast',
  'Colobus Conservation works to protect the Angolan colobus monkey and other primates along Kenya''s coast through rescue, rehabilitation, and community education.',
  'Diani Beach, Coastal Kenya',
  'info@colobusconservation.org',
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9',
  'https://images.unsplash.com/photo-1535083783855-76ae62b2914e',
  'https://www.colobusconservation.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Local Ocean Conservation
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Local Ocean Conservation',
  'local-ocean-conservation',
  'Protecting marine life and coastal ecosystems',
  'Marine conservation through community action',
  'Local Ocean Conservation works to protect Kenya''s marine ecosystems through research, education, and community-based conservation initiatives.',
  'Watamu, Coastal Kenya',
  'info@localocean.org',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7',
  'https://www.localocean.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- REEFolution Foundation
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'REEFolution Foundation',
  'reefolution',
  'Restoring coral reefs for a sustainable future',
  'Coral reef restoration and marine conservation',
  'REEFolution Foundation focuses on coral reef restoration, marine research, and sustainable tourism along Kenya''s coast.',
  'Diani, Coastal Kenya',
  'info@reefolution.org',
  'https://images.unsplash.com/photo-1546026423-cc4642628d2b',
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7',
  'https://reefolution.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Friends of Nairobi National Park
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Friends of Nairobi National Park',
  'fonnap',
  'Protecting Nairobi''s urban wildlife sanctuary',
  'Community support for Nairobi National Park',
  'Friends of Nairobi National Park (FoNNaP) works to protect and enhance Kenya''s first national park through community engagement and conservation initiatives.',
  'Nairobi, Kenya',
  'info@fonnap.org',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  'https://images.unsplash.com/photo-1535083783855-76ae62b2914e',
  'https://fonnap.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Forest Heritage Kenya
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Forest Heritage Kenya',
  'forest-heritage-kenya',
  'Protecting Kenya''s indigenous forests',
  'Forest conservation and restoration',
  'Forest Heritage Kenya focuses on protecting and restoring Kenya''s indigenous forests through community engagement and sustainable forestry practices.',
  'Karura Forest, Nairobi',
  'info@forestheritagekenya.org',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d',
  'https://images.unsplash.com/photo-1511497584788-876760111969',
  'https://forestheritagekenya.org',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();

-- Adventure Farm Karen
INSERT INTO partners (
  name, slug, tagline, short_bio, long_bio, location_text, contact_email,
  logo_image_url, hero_image_url, website, created_at, updated_at
) VALUES (
  'Adventure Farm Karen',
  'adventure-farm-karen',
  'Educational farm experiences in Karen',
  'Connecting children with nature through farming',
  'Adventure Farm Karen provides educational farm experiences, teaching children about sustainable agriculture and animal care in a hands-on environment.',
  'Karen, Nairobi',
  'info@adventurefarmkenya.com',
  'https://images.unsplash.com/photo-1500076656116-558758c991c1',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8',
  'https://adventurefarmkenya.com',
  now(), now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  location_text = EXCLUDED.location_text,
  updated_at = now();