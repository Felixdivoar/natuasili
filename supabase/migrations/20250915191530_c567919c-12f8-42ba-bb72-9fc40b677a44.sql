-- Add session tracking and expiry to carts
ALTER TABLE carts ADD COLUMN IF NOT EXISTS session_id uuid;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS expires_at timestamptz NOT NULL DEFAULT now() + interval '5 minutes';

-- Function to bump cart expiry on activity
CREATE OR REPLACE FUNCTION bump_cart_expiry()
RETURNS trigger AS $$
BEGIN
  UPDATE carts 
  SET expires_at = now() + interval '5 minutes' 
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically extend cart expiry when items are modified
DROP TRIGGER IF EXISTS trg_bump_cart_expiry ON cart_items;
CREATE TRIGGER trg_bump_cart_expiry
  AFTER INSERT OR UPDATE OR DELETE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION bump_cart_expiry();

-- Function to clean up expired carts
CREATE OR REPLACE FUNCTION cleanup_expired_carts()
RETURNS void AS $$
BEGIN
  DELETE FROM carts WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for carts to handle session-based access
DROP POLICY IF EXISTS "Users can view their carts" ON carts;
DROP POLICY IF EXISTS "Users can insert their carts" ON carts;
DROP POLICY IF EXISTS "Users can update their carts" ON carts;
DROP POLICY IF EXISTS "Users can delete their carts" ON carts;

-- New RLS policies that handle both authenticated users and session-based access
CREATE POLICY "Users can view their own carts"
ON carts FOR SELECT
USING (
  -- Authenticated users can see their own carts
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users can see carts with their session_id
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can insert their own carts"
ON carts FOR INSERT
WITH CHECK (
  -- Only travelers can create carts (block partners/admins)
  (
    SELECT NOT EXISTS(
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('partner'::app_role, 'admin'::app_role)
    )
    OR auth.uid() IS NULL
  )
  AND
  (
    -- Authenticated users must set their user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Anonymous users must provide session_id
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  )
);

CREATE POLICY "Users can update their own carts"
ON carts FOR UPDATE
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can delete their own carts"
ON carts FOR DELETE
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Update cart_items policies to work with the new cart ownership model
DROP POLICY IF EXISTS "Users can view their cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their cart items" ON cart_items;

CREATE POLICY "Users can view their cart items"
ON cart_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM carts c 
    WHERE c.id = cart_items.cart_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid())
      OR
      (auth.uid() IS NULL AND c.session_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can insert their cart items"
ON cart_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM carts c 
    WHERE c.id = cart_items.cart_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid())
      OR
      (auth.uid() IS NULL AND c.session_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can update their cart items"
ON cart_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM carts c 
    WHERE c.id = cart_items.cart_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid())
      OR
      (auth.uid() IS NULL AND c.session_id IS NOT NULL)
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM carts c 
    WHERE c.id = cart_items.cart_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid())
      OR
      (auth.uid() IS NULL AND c.session_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can delete their cart items"
ON cart_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM carts c 
    WHERE c.id = cart_items.cart_id 
    AND (
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid())
      OR
      (auth.uid() IS NULL AND c.session_id IS NOT NULL)
    )
  )
);

-- Prevent partners and admins from creating bookings
CREATE POLICY "Only travelers can create bookings"
ON bookings FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND NOT EXISTS(
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('partner'::app_role, 'admin'::app_role)
  )
  AND auth.uid() = user_id
);