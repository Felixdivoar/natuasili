-- Update experiences to have proper capacity limits where they are currently null
UPDATE experiences 
SET 
  capacity = CASE 
    WHEN title ILIKE '%community%' OR title ILIKE '%village%' THEN 15
    WHEN title ILIKE '%rhino%' OR title ILIKE '%conservation%' OR title ILIKE '%research%' THEN 8
    WHEN title ILIKE '%walk%' OR title ILIKE '%bird%' OR title ILIKE '%tree%' THEN 10
    WHEN title ILIKE '%dive%' OR title ILIKE '%ocean%' OR title ILIKE '%coral%' THEN 6
    WHEN title ILIKE '%giraffe%' OR title ILIKE '%sanctuary%' THEN 12
    WHEN title ILIKE '%night%' OR title ILIKE '%game drive%' THEN 6
    WHEN title ILIKE '%farm%' OR title ILIKE '%cultural%' THEN 15
    ELSE 10
  END,
  min_capacity = CASE 
    WHEN title ILIKE '%dive%' OR title ILIKE '%ocean%' OR title ILIKE '%coral%' THEN 2
    WHEN title ILIKE '%research%' OR title ILIKE '%conservation%' THEN 2
    WHEN title ILIKE '%night%' OR title ILIKE '%game drive%' THEN 2
    ELSE 1
  END
WHERE capacity IS NULL OR min_capacity IS NULL;

-- Make capacity and min_capacity not null with reasonable defaults for future entries
ALTER TABLE experiences 
ALTER COLUMN capacity SET DEFAULT 10,
ALTER COLUMN min_capacity SET DEFAULT 1;

-- Update any remaining null values
UPDATE experiences 
SET capacity = 10 
WHERE capacity IS NULL;

UPDATE experiences 
SET min_capacity = 1 
WHERE min_capacity IS NULL;