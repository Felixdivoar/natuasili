-- Update impact metrics with REAL data from the database (skip cron unschedule since it doesn't exist)
UPDATE impact_metrics SET 
  metric_value = (SELECT COUNT(*) FROM experiences WHERE visible_on_marketplace = true),
  updated_at = NOW(),
  last_calculated = NOW()
WHERE metric_key = 'total_experiences';

UPDATE impact_metrics SET 
  metric_value = (SELECT COUNT(*) FROM partners),
  updated_at = NOW(),
  last_calculated = NOW()
WHERE metric_key = 'active_partners';

UPDATE impact_metrics SET 
  metric_value = (SELECT COALESCE(SUM(adults + COALESCE(children, 0)), 0) FROM bookings WHERE status IN ('confirmed', 'completed')),
  updated_at = NOW(),
  last_calculated = NOW()
WHERE metric_key = 'total_participants';

UPDATE impact_metrics SET 
  metric_value = (SELECT COALESCE(SUM((total_kes - donation_kes) * 0.1), 0) FROM bookings WHERE status IN ('confirmed', 'completed')),
  updated_at = NOW(),
  last_calculated = NOW()
WHERE metric_key = 'total_conservation_funding';

-- Update the metrics calculation function to use REAL data sources
CREATE OR REPLACE FUNCTION public.update_impact_metrics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  total_funding numeric := 0;
  total_donations numeric := 0;
  monthly_donations numeric := 0;
  total_exp integer := 0;
  active_part integer := 0;
  total_part integer := 0;
  current_month_start date;
  current_month_end date;
begin
  -- Calculate current month boundaries
  current_month_start := date_trunc('month', CURRENT_DATE)::date;
  current_month_end := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date;
  
  -- Get REAL experiences count from database
  select count(*) into total_exp
  from experiences 
  where visible_on_marketplace = true;
  
  -- Get REAL partners count from database
  select count(*) into active_part
  from partners;
  
  -- Calculate total conservation funding (10% of base booking amounts, excluding donations)
  select coalesce(sum((total_kes - donation_kes) * 0.1), 0) into total_funding
  from bookings 
  where status in ('confirmed', 'completed');
  
  -- Calculate total voluntary donations
  select coalesce(sum(donation_kes), 0) into total_donations
  from bookings 
  where status in ('confirmed', 'completed');
  
  -- Calculate monthly donations
  select coalesce(sum(donation_kes), 0) into monthly_donations
  from bookings 
  where status in ('confirmed', 'completed')
    and booking_date >= current_month_start 
    and booking_date <= current_month_end;
  
  -- Calculate total participants from actual bookings
  select coalesce(sum(adults + coalesce(children, 0)), 0) into total_part
  from bookings 
  where status in ('confirmed', 'completed');
  
  -- Update metrics with REAL data
  update impact_metrics set 
    metric_value = total_funding,
    last_calculated = now(),
    updated_at = now()
  where metric_key = 'total_conservation_funding';
  
  update impact_metrics set 
    metric_value = total_donations,
    last_calculated = now(),
    updated_at = now()
  where metric_key = 'total_donations';
  
  update impact_metrics set 
    metric_value = monthly_donations,
    last_calculated = now(),
    updated_at = now()
  where metric_key = 'monthly_donations';
  
  update impact_metrics set 
    metric_value = total_exp,
    last_calculated = now(),
    updated_at = now()
  where metric_key = 'total_experiences';
  
  update impact_metrics set 
    metric_value = active_part,
    last_calculated = now(),
    updated_at = now()
  where metric_key = 'active_partners';
  
  update impact_metrics set 
    metric_value = total_part,
    last_calculated = now(),
    updated_at = now()
  where metric_key = 'total_participants';
  
  RAISE NOTICE 'Impact metrics updated with real data: experiences=%, partners=%, participants=%, funding=%', total_exp, active_part, total_part, total_funding;
end;
$function$;