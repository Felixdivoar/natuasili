-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a scheduled job to simulate metric growth every 30 seconds
SELECT cron.schedule(
  'simulate-real-time-metrics',
  '*/30 * * * * *', -- Every 30 seconds
  $$
  SELECT simulate_metric_growth() AS result;
  $$
);