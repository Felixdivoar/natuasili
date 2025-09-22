-- Update capacity limits and settings for Ol Pejeta experiences

-- Guided bush and bird walks (min 2, max 6, not suitable for children under 12)
UPDATE experiences 
SET 
  capacity = 6,
  min_capacity = 2
WHERE title ILIKE '%guided bush and bird walks%' AND title ILIKE '%Ol Pejeta%';

-- Behind the scenes chimpanzee sanctuary (min 2, max 8)
UPDATE experiences 
SET 
  capacity = 8,
  min_capacity = 2
WHERE title ILIKE '%behind the scenes%' AND title ILIKE '%chimpanzee%' AND title ILIKE '%Ol Pejeta%';

-- K-9 handler experience (max 6, not suitable for children under 12)
UPDATE experiences 
SET 
  capacity = 6,
  min_capacity = 1
WHERE title ILIKE '%K-9 handler%' AND title ILIKE '%Ol Pejeta%';

-- Lion tracking (min 2, max 7)
UPDATE experiences 
SET 
  capacity = 7,
  min_capacity = 2
WHERE title ILIKE '%track lions%' AND title ILIKE '%Ol Pejeta%';