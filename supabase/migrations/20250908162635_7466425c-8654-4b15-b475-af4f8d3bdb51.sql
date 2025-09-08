-- Get partner IDs and add sample media
INSERT INTO public.partner_media (partner_id, url, alt, sort) 
SELECT 
  p.id,
  '/assets/partner-' || p.slug || '.jpg',
  p.name || ' conservation work',
  1
FROM public.partners p
WHERE p.slug IN ('nature-kenya', 'koija-community', 'ol-pejeta', 'reteti-sanctuary', 'afew-giraffe')
ON CONFLICT DO NOTHING;

-- Add more gallery images for variety
INSERT INTO public.partner_media (partner_id, url, alt, sort) 
SELECT 
  p.id,
  CASE 
    WHEN p.slug = 'nature-kenya' THEN '/assets/nature-kenya-birdwatching.jpg'
    WHEN p.slug = 'koija-community' THEN '/assets/maasai-mara-project.jpg'
    WHEN p.slug = 'ol-pejeta' THEN '/assets/ol-pejeta-rhino.jpg'
    WHEN p.slug = 'reteti-sanctuary' THEN '/assets/reteti-elephant-orphanage.jpg'
    WHEN p.slug = 'afew-giraffe' THEN '/assets/giraffe-centre.jpg'
  END,
  p.name || ' field work',
  2
FROM public.partners p
WHERE p.slug IN ('nature-kenya', 'koija-community', 'ol-pejeta', 'reteti-sanctuary', 'afew-giraffe')
ON CONFLICT DO NOTHING;