-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION bump_cart_expiry()
RETURNS trigger AS $$
BEGIN
  UPDATE carts 
  SET expires_at = now() + interval '5 minutes' 
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION cleanup_expired_carts()
RETURNS void AS $$
BEGIN
  DELETE FROM carts WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;