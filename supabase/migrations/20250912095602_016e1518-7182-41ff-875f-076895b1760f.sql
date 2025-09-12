-- Create carts table for multi-experience cart
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  currency TEXT NOT NULL DEFAULT 'KES',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Policies: users can manage their own carts
CREATE POLICY IF NOT EXISTS "Users can view their carts"
ON public.carts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their carts"
ON public.carts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their carts"
ON public.carts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their carts"
ON public.carts FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER IF NOT EXISTS update_carts_updated_at
BEFORE UPDATE ON public.carts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  experience_slug TEXT NOT NULL,
  date DATE,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  option_id TEXT NOT NULL DEFAULT 'standard',
  unit_price_kes NUMERIC NOT NULL DEFAULT 0,
  subtotal_kes NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Policies: users can manage items of their carts
CREATE POLICY IF NOT EXISTS "Users can view their cart items"
ON public.cart_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can insert their cart items"
ON public.cart_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can update their cart items"
ON public.cart_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can delete their cart items"
ON public.cart_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
  )
);
