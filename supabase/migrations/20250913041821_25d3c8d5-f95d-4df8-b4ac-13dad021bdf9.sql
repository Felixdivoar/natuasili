-- Conservation AI Features Database Schema

-- Species data for conservation chatbot
CREATE TABLE public.species_data (
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

-- Chat logs for conversation tracking
CREATE TABLE public.chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  species_id UUID REFERENCES public.species_data(id),
  response TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wildlife quiz logging
CREATE TABLE public.wildlife_quiz_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  species_spotted TEXT[],
  ai_species TEXT[],
  correct_count INTEGER DEFAULT 0,
  photos_uploaded TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User preferences for personalization
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  preferred_quiz_time TIME DEFAULT '08:00:00',
  timezone TEXT DEFAULT 'Africa/Nairobi',
  group_type TEXT DEFAULT 'individual',
  adventure_level TEXT DEFAULT 'moderate',
  donation_interest BOOLEAN DEFAULT false,
  preferences_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Partner uploads for impact tracking
CREATE TABLE public.partner_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partner_profiles(id) NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Extracted metrics from uploads
CREATE TABLE public.extracted_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES public.partner_uploads(id) NOT NULL,
  metric_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  confidence NUMERIC DEFAULT 0.0,
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Impact dashboard aggregations
CREATE TABLE public.impact_dashboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partner_profiles(id) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metrics_json JSONB DEFAULT '{}',
  narrative TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wildlife activity patterns for recommendations
CREATE TABLE public.wildlife_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  species_id UUID REFERENCES public.species_data(id) NOT NULL,
  location TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  activity_level NUMERIC DEFAULT 0.5 CHECK (activity_level >= 0 AND activity_level <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced experiences table for recommendations
ALTER TABLE public.experiences 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS best_seasons INTEGER[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS unsuitable_weather TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS species_likely TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS donation_options JSONB DEFAULT '{}';

-- Enable Row Level Security
ALTER TABLE public.species_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildlife_quiz_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildlife_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Species data - public read access
CREATE POLICY "Species data is publicly viewable" ON public.species_data
  FOR SELECT USING (true);

-- Chat logs - users can view their own logs
CREATE POLICY "Users can view their own chat logs" ON public.chat_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat logs" ON public.chat_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wildlife quiz - users manage their own quiz data
CREATE POLICY "Users can manage their own quiz logs" ON public.wildlife_quiz_log
  FOR ALL USING (auth.uid() = user_id);

-- User preferences - users manage their own preferences
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Partner uploads - partners can manage their uploads
CREATE POLICY "Partners can manage their uploads" ON public.partner_uploads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles pp 
      WHERE pp.id = partner_uploads.partner_id AND pp.user_id = auth.uid()
    )
  );

-- Admins can view all uploads
CREATE POLICY "Admins can view all uploads" ON public.partner_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
    )
  );

-- Extracted metrics - partners and admins can view
CREATE POLICY "Partners can view metrics from their uploads" ON public.extracted_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.partner_uploads pu
      JOIN public.partner_profiles pp ON pu.partner_id = pp.id
      WHERE pu.id = extracted_metrics.upload_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all metrics" ON public.extracted_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
    )
  );

-- Impact dashboard - partners view their own, admins view all
CREATE POLICY "Partners can view their own impact data" ON public.impact_dashboard
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles pp 
      WHERE pp.id = impact_dashboard.partner_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all impact data" ON public.impact_dashboard
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
    )
  );

-- Wildlife activity - public read access
CREATE POLICY "Wildlife activity is publicly viewable" ON public.wildlife_activity
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_species_data_common_name ON public.species_data(common_name);
CREATE INDEX idx_species_data_scientific_name ON public.species_data(scientific_name);
CREATE INDEX idx_chat_logs_user_timestamp ON public.chat_logs(user_id, timestamp DESC);
CREATE INDEX idx_wildlife_quiz_user_date ON public.wildlife_quiz_log(user_id, date DESC);
CREATE INDEX idx_partner_uploads_partner_status ON public.partner_uploads(partner_id, status);
CREATE INDEX idx_extracted_metrics_upload ON public.extracted_metrics(upload_id);
CREATE INDEX idx_wildlife_activity_species_month ON public.wildlife_activity(species_id, month);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_dashboard_updated_at
  BEFORE UPDATE ON public.impact_dashboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();