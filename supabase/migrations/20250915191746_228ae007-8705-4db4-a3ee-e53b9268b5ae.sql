-- Fix the remaining function that might not have search_path set
CREATE OR REPLACE FUNCTION public.simulate_metric_growth()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;