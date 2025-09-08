-- Insert sample partner data to match existing partners
INSERT INTO public.partners (slug, name, tagline, short_bio, long_bio, location_text, website, contact_email, hero_image_url, logo_image_url, stats) VALUES
('nature-kenya', 'Nature Kenya', 'Protecting Kenya''s natural heritage through community-based conservation', 
 'Nature Kenya is a leading conservation organization dedicated to preserving Kenya''s rich biodiversity through innovative community-based programs and environmental education.',
 'Nature Kenya has been at the forefront of conservation efforts in Kenya for over three decades. Through partnerships with local communities, government agencies, and international organizations, we work to protect critical habitats, endangered species, and promote sustainable development practices. Our programs range from urban wildlife conservation in Nairobi to coastal forest protection and community education initiatives.',
 'Nairobi, Kenya', 'https://naturekenya.org', 'info@naturekenya.org',
 '/assets/partner-nature-kenya.jpg', '/assets/partner-nature-kenya.jpg',
 '{"wildlife_saved": 1250, "households_supported": 340, "hectares_protected": 15000, "years_active": 32}'::jsonb),

('koija-community', 'Koija Community', 'Empowering local communities through conservation and culture',
 'The Koija Community Conservancy is a grassroots initiative that combines traditional Maasai practices with modern conservation techniques to protect wildlife and support local livelihoods.',
 'Located in the heart of the Maasai Mara ecosystem, the Koija Community Conservancy represents a successful model of community-based conservation. By working directly with Maasai pastoralists, we have created a sustainable approach that benefits both wildlife and local communities. Our programs include wildlife monitoring, traditional craft production, cultural tourism, and environmental education for youth.',
 'Maasai Mara, Kenya', 'https://koija.org', 'info@koija.org',
 '/assets/partner-koija-community.jpg', '/assets/partner-koija-community.jpg',
 '{"wildlife_saved": 450, "households_supported": 120, "hectares_protected": 8500, "years_active": 15}'::jsonb),

('ol-pejeta', 'Ol Pejeta Conservancy', 'Home to the last northern white rhinos',
 'Ol Pejeta Conservancy is a 90,000-acre not-for-profit wildlife conservancy situated on the equator in Kenya, between the foothills of the Aberdares and Mount Kenya.',
 'As East Africa''s largest black rhino sanctuary and the only place in Kenya to see chimpanzees, Ol Pejeta Conservancy is pioneering the development of world-class conservancy models across Africa. The conservancy is home to the last two northern white rhinos on the planet and works tirelessly to ensure their survival through cutting-edge conservation science and community engagement.',
 'Laikipia, Kenya', 'https://olpejetaconservancy.org', 'info@olpejetaconservancy.org',
 '/assets/partner-ol-pejeta.jpg', '/assets/partner-ol-pejeta.jpg',
 '{"wildlife_saved": 2500, "households_supported": 750, "hectares_protected": 36000, "years_active": 25}'::jsonb),

('reteti-sanctuary', 'Reteti Elephant Sanctuary', 'Kenya''s first indigenous-owned elephant sanctuary',
 'Reteti Elephant Sanctuary is a community-owned elephant sanctuary in Samburu County, Kenya, dedicated to rescuing and rehabilitating orphaned elephant calves.',
 'Reteti Elephant Sanctuary represents a groundbreaking approach to conservation, being the first indigenous community-owned and run elephant sanctuary in Kenya. Located in Samburu County, the sanctuary works closely with local communities to rescue orphaned elephant calves and raise them for eventual release back into the wild. The sanctuary also provides employment and training opportunities for community members, creating a sustainable conservation model that benefits both elephants and people.',
 'Samburu, Kenya', 'https://retetielephants.org', 'info@retetielephants.org',
 '/assets/partner-reteti-sanctuary.jpg', '/assets/partner-reteti-sanctuary.jpg',
 '{"wildlife_saved": 75, "households_supported": 45, "hectares_protected": 2500, "years_active": 8}'::jsonb),

('afew-giraffe', 'African Fund for Endangered Wildlife (AFEW)', 'Protecting giraffes and fostering conservation education',
 'AFEW Kenya Giraffe Centre is dedicated to conservation education and the protection of the endangered Rothschild giraffe in Kenya.',
 'The African Fund for Endangered Wildlife (AFEW) Kenya Giraffe Centre, commonly known as the Giraffe Centre, is a non-profit organization located in Nairobi, Kenya. Established in 1979, the center is dedicated to the conservation of the endangered Rothschild giraffe through breeding programs, education, and community outreach. The center has become one of Nairobi''s most popular attractions, offering visitors the unique opportunity to feed and interact with giraffes while learning about conservation.',
 'Nairobi, Kenya', 'https://giraffecentre.org', 'info@giraffecentre.org',
 '/assets/partner-afew-giraffe.jpg', '/assets/partner-afew-giraffe.jpg',
 '{"wildlife_saved": 180, "households_supported": 95, "hectares_protected": 140, "years_active": 45}'::jsonb)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  short_bio = EXCLUDED.short_bio,
  long_bio = EXCLUDED.long_bio,
  location_text = EXCLUDED.location_text,
  website = EXCLUDED.website,
  contact_email = EXCLUDED.contact_email,
  hero_image_url = EXCLUDED.hero_image_url,
  logo_image_url = EXCLUDED.logo_image_url,
  stats = EXCLUDED.stats,
  updated_at = now();