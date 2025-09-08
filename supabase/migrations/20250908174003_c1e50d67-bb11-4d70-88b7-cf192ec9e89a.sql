-- Add new impact metrics for tracking donations separately
INSERT INTO public.impact_metrics (metric_key, metric_label, metric_description, metric_value, currency)
VALUES 
  ('total_donations', 'Total Conservation Donations', 'Total voluntary donations from travelers for conservation efforts', 0, 'KES'),
  ('monthly_donations', 'Monthly Conservation Donations', 'This month''s voluntary donations from travelers', 0, 'KES')
ON CONFLICT (metric_key) DO NOTHING;

-- Update the impact metrics calculation function to separate donations
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
  
  -- Calculate total experiences booked
  select coalesce(count(*), 0) into total_exp
  from bookings 
  where status in ('confirmed', 'completed');
  
  -- Calculate active partners
  select coalesce(count(distinct e.partner_id), 0) into active_part
  from bookings b
  join experiences e on b.experience_id = e.id
  where b.status in ('confirmed', 'completed');
  
  -- Calculate total participants
  select coalesce(sum(adults + coalesce(children, 0)), 0) into total_part
  from bookings 
  where status in ('confirmed', 'completed');
  
  -- Update metrics
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
  
end;
$function$;

-- Run the function to initialize the new metrics
SELECT update_impact_metrics();