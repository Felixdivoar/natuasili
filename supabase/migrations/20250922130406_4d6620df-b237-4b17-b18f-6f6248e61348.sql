-- Update night game drive experience capacity limits and timing
UPDATE experiences 
SET 
  capacity = 7,
  min_capacity = 2
WHERE title ILIKE '%night game drive%' AND title ILIKE '%Ol Pejeta%';