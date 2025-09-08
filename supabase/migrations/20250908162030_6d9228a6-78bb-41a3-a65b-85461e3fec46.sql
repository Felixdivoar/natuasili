-- Create partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  short_bio TEXT,
  long_bio TEXT,
  location_text TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  website TEXT,
  contact_email TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  hero_image_url TEXT,
  logo_image_url TEXT,
  stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "public read partners" ON public.partners 
  FOR SELECT USING (true);

-- Create partner_media table for galleries
CREATE TABLE IF NOT EXISTS public.partner_media (
  id BIGSERIAL PRIMARY KEY,
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for partner_media
ALTER TABLE public.partner_media ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "public read media" ON public.partner_media 
  FOR SELECT USING (true);

-- Add partner_id to experiences table if not exists
ALTER TABLE public.experiences 
  ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL;

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_partners_updated_at_trigger
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION update_partners_updated_at();

-- Create storage bucket for partner images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner-images', 'partner-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for partner images
CREATE POLICY "Public read partner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'partner-images');

CREATE POLICY "Partners can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'partner-images' AND
    auth.uid() IS NOT NULL
  );