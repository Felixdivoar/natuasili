-- Fix the remaining function search path issue - likely the existing promote_to_admin function
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Update profile to admin role
  UPDATE public.profiles 
  SET role = 'admin',
      updated_at = now()
  WHERE email = user_email;
  
  -- Add admin role to user_roles
  INSERT INTO public.user_roles (user_id, role)
  SELECT p.id, 'admin'::app_role
  FROM public.profiles p
  WHERE p.email = user_email
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Remove other roles if any
  DELETE FROM public.user_roles ur
  USING public.profiles p
  WHERE ur.user_id = p.id 
    AND p.email = user_email 
    AND ur.role != 'admin'::app_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;