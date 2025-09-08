-- Update impact metrics with realistic demo data and create auto-updating system
UPDATE impact_metrics SET 
  metric_value = 47,
  updated_at = NOW()
WHERE metric_key = 'total_experiences';

UPDATE impact_metrics SET 
  metric_value = 1250,
  updated_at = NOW()
WHERE metric_key = 'total_participants';

UPDATE impact_metrics SET 
  metric_value = 2850000,
  updated_at = NOW()
WHERE metric_key = 'total_conservation_funding';

UPDATE impact_metrics SET 
  metric_value = 12,
  updated_at = NOW()
WHERE metric_key = 'active_partners';

-- Create a function to simulate real-time metric updates
CREATE OR REPLACE FUNCTION simulate_metric_growth()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    random_factor FLOAT;
BEGIN
    -- Generate small random increments to simulate real activity
    random_factor := random() * 0.1; -- 0 to 10% chance
    
    IF random_factor > 0.05 THEN
        -- Occasionally increment total_participants by 1-3
        UPDATE impact_metrics 
        SET 
          metric_value = metric_value + floor(random() * 3 + 1)::INTEGER,
          updated_at = NOW(),
          last_calculated = NOW()
        WHERE metric_key = 'total_participants';
        
        -- Occasionally increment total_experiences 
        IF random() > 0.8 THEN
          UPDATE impact_metrics 
          SET 
            metric_value = metric_value + 1,
            updated_at = NOW(),
            last_calculated = NOW()
          WHERE metric_key = 'total_experiences';
        END IF;
        
        -- Update conservation funding based on new participants
        UPDATE impact_metrics 
        SET 
          metric_value = metric_value + floor(random() * 15000 + 5000)::INTEGER,
          updated_at = NOW(),
          last_calculated = NOW()
        WHERE metric_key = 'total_conservation_funding';
        
        RAISE NOTICE 'Metrics updated at %', NOW();
    END IF;
END;
$$;

-- Enable real-time for impact_metrics table
ALTER TABLE impact_metrics REPLICA IDENTITY FULL;

-- Add to realtime publication
DO $$
BEGIN
    -- Check if the table is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'impact_metrics'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE impact_metrics;
    END IF;
END $$;