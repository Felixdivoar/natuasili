-- Add duration_hours column to experiences table
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS duration_hours DECIMAL(3,1) DEFAULT 3.0;

-- Allow NULL values for capacity (unlimited capacity)
ALTER TABLE experiences ALTER COLUMN capacity DROP NOT NULL;
ALTER TABLE experiences ALTER COLUMN capacity SET DEFAULT NULL;

-- Add min_capacity column for experiences that have minimum requirements
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS min_capacity INTEGER DEFAULT NULL;

-- Create or replace function to update experience specs
CREATE OR REPLACE FUNCTION update_experience_specs()
RETURNS void AS $$
BEGIN
  -- Nairobi experiences (7)
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'morning-bird-walk-with-nature-kenya';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'tree-walk-kenya-forest-heritage';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'dudu-walk-explore-the-world-of-insects';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'specialized-eco-tours-at-karura-forest';
  UPDATE experiences SET duration_hours = 4.0, capacity = NULL WHERE slug = 'citizen-scientist-experience-at-nairobi-national-park';
  UPDATE experiences SET duration_hours = 1.0, capacity = NULL WHERE slug = 'meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew';
  UPDATE experiences SET duration_hours = 3.5, capacity = NULL WHERE slug = 'sustainable-farm-experience-at-adventure-farm-karen';

  -- Laikipia experiences (6) 
  UPDATE experiences SET duration_hours = 1.0, capacity = NULL WHERE slug = 'meet-the-last-northern-white-rhinos-at-ol-pejeta';
  UPDATE experiences SET duration_hours = 2.0, capacity = 6, min_capacity = 2 WHERE slug = 'night-game-drive-at-ol-pejeta-conservancy';
  UPDATE experiences SET duration_hours = 2.0, capacity = 6 WHERE slug = 'become-a-k-9-handler-for-a-day-at-ol-pejeta';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'guided-bush-and-bird-walks-at-ol-pejeta';
  UPDATE experiences SET duration_hours = 1.0, capacity = 6, min_capacity = 2 WHERE slug = 'behind-the-scenes-ol-pejeta-chimpanzee-sanctuary';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL, min_capacity = 2 WHERE slug = 'track-lions-and-aid-conservation-at-ol-pejeta';

  -- Samburu / Northern Kenya experiences (3)
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'sera-on-foot-rhino-tracking';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'community-led-elephant-experience-at-reteti';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'koija-cultural-village';

  -- Maasai Mara experiences (2)
  UPDATE experiences SET duration_hours = 3.0, capacity = NULL, min_capacity = 2 WHERE slug = 'drones-for-conservation-with-mara-elephant-project';
  UPDATE experiences SET duration_hours = 3.0, capacity = NULL, min_capacity = 2 WHERE slug = 'elephant-researcher-experience-with-mara-elephant-project';

  -- Baringo experiences (1)
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'giraffe-at-ruko-sanctuary';

  -- Kenyan Coast experiences (3)
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'dive-into-coral-conservation-with-reefolution';
  UPDATE experiences SET duration_hours = 1.0, capacity = NULL WHERE slug = 'colobus-conservation-guided-primate-eco-tours';
  UPDATE experiences SET duration_hours = 2.0, capacity = NULL WHERE slug = 'ocean-wonders-learn-conserve-with-local-ocean-conservation-kenya';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update all experience specs
SELECT update_experience_specs();

-- Drop the function as it's no longer needed
DROP FUNCTION update_experience_specs();

-- Create index on duration_hours for better query performance
CREATE INDEX IF NOT EXISTS idx_experiences_duration ON experiences(duration_hours);

-- Create index on capacity and min_capacity for filtering
CREATE INDEX IF NOT EXISTS idx_experiences_capacity ON experiences(capacity, min_capacity);