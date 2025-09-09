-- Fix function search path security issue by recreating with proper dependencies
DROP TRIGGER IF EXISTS update_helpful_count_trigger ON public.review_helpful_votes;
DROP FUNCTION IF EXISTS public.update_review_helpful_count();

CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews 
    SET helpful_count = helpful_count + 1 
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews 
    SET helpful_count = helpful_count - 1 
    WHERE id = OLD.review_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_helpful_count_trigger
  AFTER INSERT OR DELETE ON public.review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_helpful_count();