-- Fix function search path security issue
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