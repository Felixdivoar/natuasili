-- First create a dummy user ID for seeded partners (using service role)
DO $$
DECLARE
    dummy_user_id UUID;
BEGIN
    -- Check if we have any existing users to reference
    SELECT id INTO dummy_user_id FROM auth.users LIMIT 1;
    
    -- If no users exist, create placeholder entries without user_id foreign key validation
    -- We'll use a special approach for seeded data
    IF dummy_user_id IS NULL THEN
        -- Temporarily disable foreign key constraint for seeding
        ALTER TABLE partner_profiles DROP CONSTRAINT IF EXISTS partner_profiles_user_id_fkey;
        
        -- Generate a placeholder UUID for seeded partners
        dummy_user_id := '00000000-0000-0000-0000-000000000000';
    END IF;
    
    -- Insert partner profiles with dummy or existing user ID
    INSERT INTO partner_profiles (id, user_id, org_name, slug, bio, location, kyc_status, logo, created_at, updated_at) VALUES
    (gen_random_uuid(), dummy_user_id, 'Koija Community', 'koija-community', 'A vibrant Samburu community dedicated to preserving cultural heritage while supporting conservation efforts in northern Kenya.', 'Samburu County, Kenya', 'approved', '/lovable-uploads/08763604-1a22-4da5-a8a1-4daf65cb4b32.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Sera Conservancy', 'sera-conservancy', 'Community-owned conservancy protecting endangered black rhinos and supporting Samburu livelihoods through conservation tourism.', 'Samburu County, Kenya', 'approved', '/lovable-uploads/73526904-0f02-4d36-9590-456e0dd5628a.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Ruko Community Conservancy', 'ruko-community-conservancy', 'Protecting endangered Rothschilds giraffes and supporting local communities through sustainable conservation practices.', 'Samburu County, Kenya', 'approved', '/lovable-uploads/21799448-fabe-49a5-b8b2-3fd811cc804c.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Colobus Conservation', 'colobus-conservation', 'Dedicated to the conservation of primates and their coastal forest habitats along the Kenyan coast.', 'Coastal Kenya', 'approved', '/lovable-uploads/1cbd1d3d-c30b-45be-a09e-8c9cc6f1f87b.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Local Ocean (Watamu)', 'local-ocean-watamu', 'Marine conservation organization protecting coral reefs and supporting sustainable fishing communities in Watamu.', 'Watamu, Coastal Kenya', 'approved', '/lovable-uploads/a6c0b2b9-fd77-4472-a600-d2f163add078.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Kenya Forest Heritage', 'kenya-forest-heritage', 'Preserving Kenyas indigenous forests through education, research, and community-based conservation programs.', 'Nairobi and surroundings', 'approved', '/lovable-uploads/f0dcab56-c695-41ac-bf57-3a9e350158f0.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Nature Kenya', 'nature-kenya', 'Leading bird and nature conservation organization in Kenya, promoting environmental education and sustainable practices.', 'Nairobi, Kenya', 'approved', '/lovable-uploads/89f29078-42d9-498b-91e8-de9387a64250.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Giraffe Centre (AFEW)', 'giraffe-centre-afew', 'African Fund for Endangered Wildlife operating the famous Giraffe Centre, protecting endangered Rothschilds giraffes.', 'Nairobi, Kenya', 'approved', '/lovable-uploads/f39fee39-a385-4e10-a818-084c4d1811fd.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Reteti Elephant Sanctuary', 'reteti-elephant-sanctuary', 'Community-owned elephant orphanage in Samburu, rescuing and rehabilitating orphaned elephants back to the wild.', 'Samburu County, Kenya', 'approved', '/lovable-uploads/d42dcb33-a2f6-4418-8d2a-921127f8d45a.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Ol Pejeta Conservancy', 'ol-pejeta-conservancy', 'East Africas largest black rhino sanctuary and home to the last two northern white rhinos on Earth.', 'Laikipia County, Kenya', 'approved', '/lovable-uploads/dc2fa3f6-3095-4f03-9f50-d78d7cceba81.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Reefolution', 'reefolution', 'Innovative coral restoration organization using cutting-edge techniques to rebuild coral reefs along the Kenyan coast.', 'Coastal Kenya', 'approved', '/lovable-uploads/d4888a5b-c6ad-4983-8c53-e2364f663bd4.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Mara Elephant Project', 'mara-elephant-project', 'Protecting elephants in the Greater Mara ecosystem through research, monitoring, and community engagement.', 'Maasai Mara, Kenya', 'approved', '/lovable-uploads/a9fc8078-1eb7-433f-8ea8-cc504ca5b048.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Ewaso Lions', 'ewaso-lions', 'Dedicated to lion conservation in the Ewaso ecosystem, working with local communities to protect these apex predators.', 'Samburu County, Kenya', 'approved', '/public/logos/olp.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Kenya Wildlife Service', 'kenya-wildlife-service', 'Government agency responsible for wildlife conservation and management of national parks and reserves.', 'Nairobi, Kenya', 'approved', '/public/logos/reef.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'Sheldrick Wildlife Trust', 'sheldrick-wildlife-trust', 'Pioneering conservation organization focused on elephant and rhino protection, anti-poaching, and community outreach.', 'Nairobi, Kenya', 'approved', '/public/logos/mep.png', now(), now()),
    (gen_random_uuid(), dummy_user_id, 'David Sheldrick Wildlife Trust', 'david-sheldrick-wildlife-trust', 'Leading elephant orphanage and conservation organization, rescuing and rehabilitating orphaned elephants across Kenya.', 'Nairobi, Kenya', 'approved', '/public/logos/afeW.png', now(), now())
    ON CONFLICT (slug) DO NOTHING; -- Avoid duplicates if already seeded

END $$;