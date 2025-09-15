-- Create chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat messages table  
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','assistant','tool')) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Kenya species knowledge table
CREATE TABLE IF NOT EXISTS public.species_kenya (
  id BIGSERIAL PRIMARY KEY,
  common_name TEXT,
  scientific_name TEXT,
  theme TEXT,              -- e.g., "elephant", "lion", "cheetah"
  regions TEXT[],          -- e.g., '{Samburu, Tsavo, Maasai Mara}'
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_kenya ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
CREATE POLICY "Users can manage their own chat sessions"
ON public.chat_sessions
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from their sessions"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE chat_sessions.id = chat_messages.session_id 
    AND chat_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages to their sessions"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE chat_sessions.id = chat_messages.session_id 
    AND chat_sessions.user_id = auth.uid()
  )
);

-- RLS Policy for species_kenya (public read)
CREATE POLICY "Species data is publicly viewable"
ON public.species_kenya
FOR SELECT
USING (true);

CREATE POLICY "Service role can manage species data"
ON public.species_kenya
FOR ALL
USING (auth.role() = 'service_role');

-- Seed some Kenya species data
INSERT INTO public.species_kenya (common_name, scientific_name, theme, regions, notes) VALUES
('African Elephant', 'Loxodonta africana', 'elephant', '{Samburu, Tsavo, Maasai Mara, Amboseli}', 'Largest land mammal. Threatened by poaching and habitat loss. Key species for ecosystem balance.'),
('Lion', 'Panthera leo', 'lion', '{Maasai Mara, Tsavo, Samburu, Laikipia}', 'Apex predator. Social cats living in prides. Population declining due to human-wildlife conflict.'),
('Cheetah', 'Acinonyx jubatus', 'cheetah', '{Maasai Mara, Samburu, Tsavo}', 'Fastest land animal. Vulnerable species with only ~7000 left in wild. Needs large territories.'),
('Black Rhinoceros', 'Diceros bicornis', 'rhino', '{Tsavo, Maasai Mara, Laikipia, Ol Pejeta}', 'Critically endangered. Intensive conservation efforts in Kenya. Population slowly recovering.'),
('Grevy''s Zebra', 'Equus grevyii', 'zebra', '{Samburu, Laikipia, Meru}', 'Endangered. Largest wild equid. Endemic to northern Kenya and southern Ethiopia.'),
('Reticulated Giraffe', 'Giraffa reticulata', 'giraffe', '{Samburu, Laikipia, Meru}', 'Endangered subspecies. Distinctive net pattern. Found only in northern Kenya, Somalia and Ethiopia.');

-- Create function for species lookup
CREATE OR REPLACE FUNCTION public.fts_species_lookup(q TEXT)
RETURNS TABLE(
  id BIGINT,
  common_name TEXT,
  scientific_name TEXT,
  theme TEXT,
  regions TEXT[],
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.common_name, s.scientific_name, s.theme, s.regions, s.notes
  FROM public.species_kenya s
  WHERE 
    s.common_name ILIKE '%' || q || '%' OR
    s.scientific_name ILIKE '%' || q || '%' OR
    s.theme ILIKE '%' || q || '%' OR
    s.notes ILIKE '%' || q || '%'
  ORDER BY 
    CASE 
      WHEN s.common_name ILIKE q THEN 1
      WHEN s.theme ILIKE q THEN 2
      ELSE 3
    END
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;