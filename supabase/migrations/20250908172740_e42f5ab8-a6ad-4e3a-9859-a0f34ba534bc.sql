-- Add approval status field to impact_proofs table
ALTER TABLE public.impact_proofs 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Create index for efficient querying of approved proofs
CREATE INDEX IF NOT EXISTS idx_impact_proofs_status ON public.impact_proofs(status);
CREATE INDEX IF NOT EXISTS idx_impact_proofs_booking_status ON public.impact_proofs(booking_id, status);

-- Add RLS policy for admins to manage impact proof approvals
CREATE POLICY "Admins can manage all impact proofs" 
ON public.impact_proofs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'::app_role
));