-- Create partner profile for Ol Pejeta Conservancy
-- We'll create a system user first for this partner
DO $$
DECLARE
    system_user_id UUID;
    partner_profile_id UUID;
BEGIN
    -- Create a system user ID for Ol Pejeta
    system_user_id := gen_random_uuid();
    
    -- Insert partner profile with the system user ID
    INSERT INTO partner_profiles (
        id,
        user_id,
        org_name,
        slug,
        bio,
        location,
        kyc_status
    ) VALUES (
        gen_random_uuid(),
        system_user_id,
        'Ol Pejeta Conservancy',
        'ol-pejeta-conservancy',
        'Ol Pejeta Conservancy is East Africas largest black rhino sanctuary and home to the last two northern white rhinos on Earth, pioneering cutting-edge conservation technology and community partnerships.',
        'Laikipia County, Kenya',
        'approved'
    )
    RETURNING id INTO partner_profile_id;
    
    -- Store the partner profile ID for experiences
    RAISE NOTICE 'Created partner profile with ID: %', partner_profile_id;
END
$$;