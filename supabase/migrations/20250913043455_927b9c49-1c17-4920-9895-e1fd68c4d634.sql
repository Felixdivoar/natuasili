-- Create cron job for daily wildlife quiz reminders
SELECT cron.schedule(
  'daily-wildlife-quiz-reminder',
  '0 8 * * *', -- Every day at 8 AM
  $$
  SELECT
    net.http_post(
        url:='https://zeiqetimpspjgppfhbdu.supabase.co/functions/v1/wildlife-quiz',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaXFldGltcHNwamdwcGZoYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDM4MzEsImV4cCI6MjA3MDgxOTgzMX0.fbrwRVn1OoKy63GCfvlKcElR19N2vG1d6M1PDjGLvNU"}'::jsonb,
        body:=concat('{"action": "send_daily_reminders", "time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Seed initial species data for Kenya
INSERT INTO species_data (
  common_name, 
  scientific_name, 
  population_status, 
  habitat, 
  distribution,
  description,
  threats,
  classification
) VALUES 
(
  'African Elephant',
  'Loxodonta africana',
  'Endangered',
  'Savannas, grasslands, forests, deserts and marshes',
  'Sub-Saharan Africa, including Kenya',
  'Large mammal known for intelligence and social behavior. Critical for ecosystem health.',
  ARRAY['Poaching', 'Habitat loss', 'Human-wildlife conflict'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Proboscidea", "family": "Elephantidae"}'::jsonb
),
(
  'Black Rhinoceros',
  'Diceros bicornis',
  'Critically Endangered', 
  'Semi-desert savannahs, woodlands, forests, wetlands',
  'Eastern and southern Africa, including Kenya',
  'Large herbivore with distinctive hooked lip. Fewer than 6,000 remain worldwide.',
  ARRAY['Poaching for horn', 'Habitat loss', 'Political instability'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Perissodactyla", "family": "Rhinocerotidae"}'::jsonb
),
(
  'African Lion',
  'Panthera leo',
  'Vulnerable',
  'Grasslands, savannas, scrublands, woodland',
  'Sub-Saharan Africa, including Kenya',
  'Apex predator and keystone species. Lives in social groups called prides.',
  ARRAY['Habitat loss', 'Human-wildlife conflict', 'Trophy hunting', 'Disease'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Felidae"}'::jsonb
),
(
  'African Leopard',
  'Panthera pardus',
  'Near Threatened',
  'Rainforests, woodlands, riverine forests, mountains',
  'Sub-Saharan Africa, including Kenya',
  'Solitary big cat known for climbing trees and adaptability.',
  ARRAY['Habitat fragmentation', 'Human-wildlife conflict', 'Poaching'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Felidae"}'::jsonb
),
(
  'Cheetah',
  'Acinonyx jubatus',
  'Vulnerable',
  'Open grasslands, savannas, semi-deserts',
  'Eastern and southern Africa, including Kenya',
  'Fastest land animal, capable of reaching speeds up to 120 km/h.',
  ARRAY['Habitat loss', 'Human-wildlife conflict', 'Genetic bottleneck', 'Competition'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Felidae"}'::jsonb
),
(
  'Grevy''s Zebra',
  'Equus grevyii',
  'Endangered',
  'Semi-arid grasslands and shrublands',
  'Northern Kenya and southern Ethiopia',
  'Largest wild equid with distinctive narrow stripes. Only about 3,000 remain.',
  ARRAY['Habitat loss', 'Competition with livestock', 'Reduced water access', 'Disease'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Perissodactyla", "family": "Equidae"}'::jsonb
),
(
  'African Wild Dog',
  'Lycaon pictus',
  'Endangered',
  'Savannas, grasslands, semi-arid regions',
  'Sub-Saharan Africa, including Kenya',
  'Highly social carnivore with exceptional hunting success rate.',
  ARRAY['Habitat fragmentation', 'Human-wildlife conflict', 'Disease', 'Road accidents'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Canidae"}'::jsonb
),
(
  'Rothschild''s Giraffe',
  'Giraffa camelopardalis rothschildi',
  'Near Threatened',
  'Savannas, grasslands, open woodlands',
  'Uganda, Kenya, South Sudan',
  'Subspecies of giraffe with distinctive white markings on legs.',
  ARRAY['Habitat loss', 'Poaching', 'Civil unrest', 'Disease'],
  '{"kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia", "order": "Artiodactyla", "family": "Giraffidae"}'::jsonb
);

-- Seed wildlife activity data for different seasons
INSERT INTO wildlife_activity (species_id, location, month, activity_level) 
SELECT 
  s.id,
  locations.location,
  months.month,
  -- Vary activity levels based on species and season
  CASE 
    WHEN s.common_name = 'African Elephant' AND months.month BETWEEN 6 AND 9 THEN 0.8 -- High during dry season
    WHEN s.common_name = 'African Elephant' THEN 0.6
    WHEN s.common_name = 'Cheetah' AND months.month BETWEEN 12 AND 3 THEN 0.9 -- Peak during calving season
    WHEN s.common_name = 'Cheetah' THEN 0.5
    WHEN s.common_name = 'African Lion' AND months.month BETWEEN 6 AND 10 THEN 0.8 -- More active during dry season
    WHEN s.common_name = 'African Lion' THEN 0.6
    ELSE 0.6 -- Default activity level
  END as activity_level
FROM species_data s
CROSS JOIN (
  SELECT unnest(ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]) as month
) months
CROSS JOIN (
  SELECT unnest(ARRAY['Maasai Mara', 'Amboseli', 'Tsavo', 'Laikipia', 'Samburu']) as location
) locations
WHERE s.common_name IN ('African Elephant', 'African Lion', 'Cheetah', 'Black Rhinoceros', 'Grevy''s Zebra');

-- Initialize impact metrics with base values
INSERT INTO impact_metrics (metric_key, metric_label, metric_description, metric_value, currency) VALUES
('total_conservation_funding', 'Total Conservation Funding', 'Total funding generated for conservation through our platform', 0, 'KES'),
('total_participants', 'Total Participants', 'Total number of people who have participated in conservation experiences', 0, 'participants'),
('total_experiences', 'Active Experiences', 'Total number of active conservation experiences available', 0, 'experiences'),
('active_partners', 'Active Partners', 'Number of conservation partners on the platform', 0, 'partners'),
('total_donations', 'Total Donations', 'Total voluntary donations made by users', 0, 'KES'),
('monthly_donations', 'Monthly Donations', 'Donations made this month', 0, 'KES')
ON CONFLICT (metric_key) DO NOTHING;