-- Set up the admin user (run after manual user creation)
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Find the user by email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'natuasili@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found. Please create user first in Supabase Dashboard.';
        RETURN;
    END IF;
    
    -- Update or insert profile
    INSERT INTO public.profiles (id, email, role, first_name, last_name)
    VALUES (admin_user_id, 'natuasili@gmail.com', 'admin', 'NatuAsili', 'Admin')
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        first_name = 'NatuAsili',
        last_name = 'Admin',
        updated_at = now();
    
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Create partner profile for managing experiences
    INSERT INTO public.partner_profiles (user_id, org_name, slug, kyc_status, bio)
    VALUES (
        admin_user_id, 
        'NatuAsili Admin', 
        'natuasili-admin', 
        'approved',
        'Official NatuAsili administration account for managing curated conservation experiences.'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        org_name = 'NatuAsili Admin',
        kyc_status = 'approved',
        bio = 'Official NatuAsili administration account for managing curated conservation experiences.',
        updated_at = now();
    
    RAISE NOTICE 'Admin user setup completed for user ID: %', admin_user_id;
END $$;