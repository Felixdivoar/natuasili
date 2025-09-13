-- Create RLS policies for conservation AI features tables

-- Species data - public read access
DROP POLICY IF EXISTS "Species data is publicly viewable" ON public.species_data;
CREATE POLICY "Species data is publicly viewable" ON public.species_data
  FOR SELECT USING (true);

-- Service role can manage species data
DROP POLICY IF EXISTS "Service role can manage species data" ON public.species_data;
CREATE POLICY "Service role can manage species data" ON public.species_data
  FOR ALL USING (auth.role() = 'service_role'::text);

-- Chat logs - users can view their own logs
DROP POLICY IF EXISTS "Users can view their own chat logs" ON public.chat_logs;
CREATE POLICY "Users can view their own chat logs" ON public.chat_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat logs" ON public.chat_logs;
CREATE POLICY "Users can insert their own chat logs" ON public.chat_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wildlife quiz - users manage their own quiz data
DROP POLICY IF EXISTS "Users can manage their own quiz logs" ON public.wildlife_quiz_log;
CREATE POLICY "Users can manage their own quiz logs" ON public.wildlife_quiz_log
  FOR ALL USING (auth.uid() = user_id);

-- User preferences - users manage their own preferences
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Partner uploads - partners can manage their uploads
DROP POLICY IF EXISTS "Partners can manage their uploads" ON public.partner_uploads;
CREATE POLICY "Partners can manage their uploads" ON public.partner_uploads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles pp 
      WHERE pp.id = partner_uploads.partner_id AND pp.user_id = auth.uid()
    )
  );

-- Admins can view all uploads
DROP POLICY IF EXISTS "Admins can view all uploads" ON public.partner_uploads;
CREATE POLICY "Admins can view all uploads" ON public.partner_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
    )
  );

-- Extracted metrics - partners and admins can view
DROP POLICY IF EXISTS "Partners can view metrics from their uploads" ON public.extracted_metrics;
CREATE POLICY "Partners can view metrics from their uploads" ON public.extracted_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.partner_uploads pu
      JOIN public.partner_profiles pp ON pu.partner_id = pp.id
      WHERE pu.id = extracted_metrics.upload_id AND pp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage all metrics" ON public.extracted_metrics;
CREATE POLICY "Admins can manage all metrics" ON public.extracted_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
    )
  );

-- Impact dashboard - partners view their own, admins view all
DROP POLICY IF EXISTS "Partners can view their own impact data" ON public.impact_dashboard;
CREATE POLICY "Partners can view their own impact data" ON public.impact_dashboard
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.partner_profiles pp 
      WHERE pp.id = impact_dashboard.partner_id AND pp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage all impact data" ON public.impact_dashboard;
CREATE POLICY "Admins can manage all impact data" ON public.impact_dashboard
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
    )
  );

-- Wildlife activity - public read access
DROP POLICY IF EXISTS "Wildlife activity is publicly viewable" ON public.wildlife_activity;
CREATE POLICY "Wildlife activity is publicly viewable" ON public.wildlife_activity
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage wildlife activity" ON public.wildlife_activity;
CREATE POLICY "Service role can manage wildlife activity" ON public.wildlife_activity
  FOR ALL USING (auth.role() = 'service_role'::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_species_data_common_name ON public.species_data(common_name);
CREATE INDEX IF NOT EXISTS idx_species_data_scientific_name ON public.species_data(scientific_name);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_timestamp ON public.chat_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_wildlife_quiz_user_date ON public.wildlife_quiz_log(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_partner_uploads_partner_status ON public.partner_uploads(partner_id, status);
CREATE INDEX IF NOT EXISTS idx_extracted_metrics_upload ON public.extracted_metrics(upload_id);
CREATE INDEX IF NOT EXISTS idx_wildlife_activity_species_month ON public.wildlife_activity(species_id, month);

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_impact_dashboard_updated_at ON public.impact_dashboard;
CREATE TRIGGER update_impact_dashboard_updated_at
  BEFORE UPDATE ON public.impact_dashboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();