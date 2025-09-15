-- Step 1: Get the admin user ID and create admin functions
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'felixongoma@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found. Please create user first in Supabase Dashboard.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found admin user ID: %', admin_user_id;
    
    -- Update all partner profiles to be owned by admin
    UPDATE public.partner_profiles 
    SET user_id = admin_user_id 
    WHERE user_id IS DISTINCT FROM admin_user_id;
    
    RAISE NOTICE 'Updated % partner profiles to admin ownership', 
        (SELECT count(*) FROM public.partner_profiles WHERE user_id = admin_user_id);
    
END $$;

-- Step 2: Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND lower(u.email) = 'felixongoma@gmail.com'
  );
$$;

-- Step 3: Create enhanced admin check function that works with user roles
CREATE OR REPLACE FUNCTION public.is_admin_or_has_role(_role app_role DEFAULT 'admin'::app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- Check if user is the specific admin email
    EXISTS(
      SELECT 1 FROM auth.users u 
      WHERE u.id = auth.uid() 
      AND lower(u.email) = 'felixongoma@gmail.com'
    )
    OR
    -- Or check if user has admin role in user_roles table
    EXISTS(
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role = _role
    )
  );
$$;

-- Step 4: Update RLS policies for partner_profiles
DROP POLICY IF EXISTS "Anyone can view approved partners" ON public.partner_profiles;
DROP POLICY IF EXISTS "Partners can insert their own profile" ON public.partner_profiles;
DROP POLICY IF EXISTS "Partners can update their own profile" ON public.partner_profiles;
DROP POLICY IF EXISTS "Partners can view their own profile" ON public.partner_profiles;

-- New partner_profiles policies with admin access
CREATE POLICY "Public can view approved partners" ON public.partner_profiles
  FOR SELECT USING (kyc_status = 'approved');

CREATE POLICY "Admin can manage all partner profiles" ON public.partner_profiles
  FOR ALL USING (public.is_admin_or_has_role('admin'::app_role));

CREATE POLICY "Partners can manage own profile" ON public.partner_profiles
  FOR ALL USING (auth.uid() = user_id AND NOT public.is_admin_or_has_role('admin'::app_role))
  WITH CHECK (auth.uid() = user_id);

-- Step 5: Update RLS policies for experiences  
DROP POLICY IF EXISTS "Anyone can view visible experiences" ON public.experiences;
DROP POLICY IF EXISTS "Partners can manage their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Partners can view their own experiences" ON public.experiences;

-- New experiences policies with admin access
CREATE POLICY "Public can view visible experiences" ON public.experiences
  FOR SELECT USING (visible_on_marketplace = true);

CREATE POLICY "Admin can manage all experiences" ON public.experiences
  FOR ALL USING (public.is_admin_or_has_role('admin'::app_role));

CREATE POLICY "Partners can manage own experiences" ON public.experiences
  FOR ALL USING (
    NOT public.is_admin_or_has_role('admin'::app_role) AND
    EXISTS (
      SELECT 1 FROM public.partner_profiles pp
      WHERE pp.id = experiences.partner_id 
      AND pp.user_id = auth.uid()
    )
  );

-- Step 6: Update RLS policies for bookings
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated partners can view bookings for their experiences" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view their own bookings" ON public.bookings;

-- New bookings policies with enhanced admin access
CREATE POLICY "Admin can manage all bookings" ON public.bookings
  FOR ALL USING (public.is_admin_or_has_role('admin'::app_role));

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (
    NOT public.is_admin_or_has_role('admin'::app_role) AND 
    auth.uid() = user_id
  );

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    NOT public.is_admin_or_has_role('admin'::app_role) AND 
    auth.uid() = user_id
  );

CREATE POLICY "Partners can view their experience bookings" ON public.bookings
  FOR SELECT USING (
    NOT public.is_admin_or_has_role('admin'::app_role) AND
    EXISTS (
      SELECT 1 FROM public.experiences e
      JOIN public.partner_profiles pp ON e.partner_id = pp.id
      WHERE e.id = bookings.experience_id 
      AND pp.user_id = auth.uid()
    )
  );

-- Step 7: Update partners table policies for admin access
DROP POLICY IF EXISTS "public read partners" ON public.partners;

CREATE POLICY "Public can read partners" ON public.partners
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage partners" ON public.partners  
  FOR ALL USING (public.is_admin_or_has_role('admin'::app_role));

-- Step 8: Update other relevant tables for admin access
-- Reviews - allow admin to manage all
CREATE POLICY "Admin can manage all reviews" ON public.reviews
  FOR ALL USING (public.is_admin_or_has_role('admin'::app_role));

-- Payments - allow admin to view all  
CREATE POLICY "Admin can view all payments" ON public.payments
  FOR SELECT USING (public.is_admin_or_has_role('admin'::app_role));

-- Messages - allow admin to view all
CREATE POLICY "Admin can view all messages" ON public.messages
  FOR SELECT USING (public.is_admin_or_has_role('admin'::app_role));

-- Step 9: Make sure the admin user has proper profile and roles
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get admin user ID again
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'felixongoma@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Ensure admin has profile
        INSERT INTO public.profiles (id, email, role, first_name, last_name)
        VALUES (admin_user_id, 'felixongoma@gmail.com', 'admin', 'Felix', 'Ongoma')
        ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            email = 'felixongoma@gmail.com',
            updated_at = now();
        
        -- Ensure admin role exists
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin user setup completed successfully';
    END IF;
END $$;