-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.fts_species_lookup(q TEXT)
RETURNS TABLE(
  id BIGINT,
  common_name TEXT,
  scientific_name TEXT,
  theme TEXT,
  regions TEXT[],
  notes TEXT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.common_name, s.scientific_name, s.theme, s.regions, s.notes
  FROM public.species_kenya s
  WHERE 
    s.common_name ILIKE '%' || q || '%' OR
    s.scientific_name ILIKE '%' || q || '%' OR
    s.theme ILIKE '%' || q || '%' OR
    s.notes ILIKE '%' || q || '%'
  ORDER BY 
    CASE 
      WHEN s.common_name ILIKE q THEN 1
      WHEN s.theme ILIKE q THEN 2
      ELSE 3
    END
  LIMIT 10;
END;
$$;