-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'partner', 'user');

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create partner profiles table
CREATE TABLE public.partner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  org_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  bio TEXT,
  location TEXT,
  contacts JSONB DEFAULT '[]',
  team JSONB DEFAULT '[]',
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  partner_id UUID REFERENCES public.partner_profiles(id) ON DELETE CASCADE NOT NULL,
  hero_image TEXT,
  gallery JSONB DEFAULT '[]',
  description TEXT,
  location_text TEXT,
  themes JSONB DEFAULT '[]',
  activities JSONB DEFAULT '[]',
  price_kes_adult INTEGER NOT NULL,
  child_half_price_rule BOOLEAN DEFAULT FALSE,
  capacity INTEGER DEFAULT 15,
  visible_on_marketplace BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_kes INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payouts table
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partner_profiles(id) ON DELETE CASCADE NOT NULL,
  amount_kes INTEGER NOT NULL,
  payout_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create impact proofs table
CREATE TABLE public.impact_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, experience_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for partner_profiles
CREATE POLICY "Anyone can view approved partners" ON public.partner_profiles
  FOR SELECT USING (kyc_status = 'approved');

CREATE POLICY "Partners can view their own profile" ON public.partner_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own profile" ON public.partner_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Partners can insert their own profile" ON public.partner_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for experiences
CREATE POLICY "Anyone can view visible experiences" ON public.experiences
  FOR SELECT USING (visible_on_marketplace = true);

CREATE POLICY "Partners can view their own experiences" ON public.experiences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles 
      WHERE id = partner_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can manage their own experiences" ON public.experiences
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles 
      WHERE id = partner_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Partners can view bookings for their experiences" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      JOIN public.partner_profiles pp ON e.partner_id = pp.id
      WHERE e.id = experience_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payouts
CREATE POLICY "Partners can view their own payouts" ON public.payouts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles 
      WHERE id = partner_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for impact_proofs
CREATE POLICY "Users can view impact proofs for their bookings" ON public.impact_proofs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can manage impact proofs for their bookings" ON public.impact_proofs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.experiences e ON b.experience_id = e.id
      JOIN public.partner_profiles pp ON e.partner_id = pp.id
      WHERE b.id = booking_id AND pp.user_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages for their bookings" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.experiences e ON b.experience_id = e.id
      JOIN public.partner_profiles pp ON e.partner_id = pp.id
      WHERE b.id = booking_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages for their bookings" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (
      EXISTS (
        SELECT 1 FROM public.bookings 
        WHERE id = booking_id AND user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.experiences e ON b.experience_id = e.id
        JOIN public.partner_profiles pp ON e.partner_id = pp.id
        WHERE b.id = booking_id AND pp.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for wishlists
CREATE POLICY "Users can manage their own wishlists" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_partner_profiles_updated_at
  BEFORE UPDATE ON public.partner_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();