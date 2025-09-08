-- Fix all public functions to have proper search path
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.update_impact_metrics()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  total_funding numeric := 0;
  total_exp integer := 0;
  active_part integer := 0;
  total_part integer := 0;
begin
  -- Calculate total conservation funding (10% of bookings total)
  select coalesce(sum(total_kes * 0.1), 0) into total_funding
  from bookings 
  where status in ('confirmed', 'completed');
  
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
$$;

create or replace function public.trigger_update_impact_metrics()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform update_impact_metrics();
  return coalesce(new, old);
end;
$$;