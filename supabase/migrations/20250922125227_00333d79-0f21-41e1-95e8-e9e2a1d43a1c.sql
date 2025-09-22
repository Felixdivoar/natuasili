-- Update northern white rhinos experience to have no capacity limits
UPDATE experiences 
SET 
  capacity = NULL,
  min_capacity = NULL
WHERE title ILIKE '%northern white rhinos%' AND title ILIKE '%Ol Pejeta%';