-- Secure the partner_profiles table by restricting access to sensitive business data
-- Drop the overly permissive public access policy
DROP POLICY IF EXISTS "Public can view approved partners" ON public.partner_profiles;

-- Keep existing secure policies (admin and partner owner access)
-- These policies already exist and are secure:
-- - "Admin can manage all partner profiles" (admins can do everything)
-- - "Partners can manage own profile" (partners can only manage their own)

-- IMPORTANT: Public information about partners should be accessed through 
-- the 'partners' table instead, which contains only public-facing information
-- like name, logo, bio, etc. without sensitive financial/business data.

-- Add a comment to document the security decision
COMMENT ON TABLE public.partner_profiles IS 
'Contains sensitive partner business information (KYC docs, bank details, tax certificates). 
Access restricted to: (1) Partner owners via user_id match, (2) Admins for verification. 
Public partner information is available through the partners table instead.';