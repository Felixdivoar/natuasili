-- Conservation AI Features Database Schema (Updated)

-- Create species_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.species_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scientific_name TEXT NOT NULL,
  common_name TEXT NOT NULL,
  classification JSONB DEFAULT '{}',
  population_status TEXT,
  threats TEXT[],
  habitat TEXT,
  distribution TEXT,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'IUCN',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  query TEXT NOT NULL,
  species_id UUID,
  response TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wildlife_quiz_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wildlife_quiz_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  species_spotted TEXT[],
  ai_species TEXT[],
  correct_count INTEGER DEFAULT 0,
  photos_uploaded TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_quiz_time TIME DEFAULT '08:00:00',
  timezone TEXT DEFAULT 'Africa/Nairobi',
  group_type TEXT DEFAULT 'individual',
  adventure_level TEXT DEFAULT 'moderate',
  donation_interest BOOLEAN DEFAULT false,
  preferences_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create partner_uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.partner_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create extracted_metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.extracted_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  confidence NUMERIC DEFAULT 0.0,
  verified BOOLEAN DEFAULT false,
  verified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create impact_dashboard table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.impact_dashboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metrics_json JSONB DEFAULT '{}',
  narrative TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wildlife_activity table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wildlife_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  species_id UUID NOT NULL,
  location TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  activity_level NUMERIC DEFAULT 0.5 CHECK (activity_level >= 0 AND activity_level <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhance experiences table with new columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experiences' AND column_name = 'categories') THEN
    ALTER TABLE public.experiences ADD COLUMN categories TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experiences' AND column_name = 'best_seasons') THEN
    ALTER TABLE public.experiences ADD COLUMN best_seasons INTEGER[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experiences' AND column_name = 'unsuitable_weather') THEN
    ALTER TABLE public.experiences ADD COLUMN unsuitable_weather TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experiences' AND column_name = 'species_likely') THEN
    ALTER TABLE public.experiences ADD COLUMN species_likely TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experiences' AND column_name = 'donation_options') THEN
    ALTER TABLE public.experiences ADD COLUMN donation_options JSONB DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS only if not already enabled
DO $$
BEGIN
  -- Enable RLS on new tables
  ALTER TABLE public.species_data ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.wildlife_quiz_log ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.partner_uploads ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.extracted_metrics ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.impact_dashboard ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.wildlife_activity ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  -- RLS may already be enabled, continue
  NULL;
END $$;