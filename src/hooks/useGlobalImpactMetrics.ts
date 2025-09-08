import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ImpactMetric {
  id: string;
  metric_key: string;
  metric_label: string;
  metric_description: string | null;
  metric_value: number;
  currency: string | null;
  last_calculated: string | null;
}

export function useGlobalImpactMetrics() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImpactMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('impact_metrics')
        .select('*')
        .order('metric_key');

      if (error) throw error;
      setMetrics(data || []);

    } catch (err) {
      console.error('Error fetching impact metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load impact metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactMetrics();

    // Set up real-time subscription for impact metrics
    const channel = supabase
      .channel('impact-metrics-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'impact_metrics'
        },
        (payload) => {
          console.log('Impact metrics change detected:', payload);
          fetchImpactMetrics(); // Refetch when metrics are updated
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper functions to get specific metrics
  const getMetricByKey = (key: string): ImpactMetric | undefined => {
    return metrics.find(metric => metric.metric_key === key);
  };

  const getTotalConservationFunding = (): number => {
    return getMetricByKey('total_conservation_funding')?.metric_value || 0;
  };

  const getTotalExperiences = (): number => {
    return getMetricByKey('total_experiences')?.metric_value || 0;
  };

  const getActivePartners = (): number => {
    return getMetricByKey('active_partners')?.metric_value || 0;
  };

  const getTotalParticipants = (): number => {
    return getMetricByKey('total_participants')?.metric_value || 0;
  };

  return {
    metrics,
    loading,
    error,
    getMetricByKey,
    getTotalConservationFunding,
    getTotalExperiences,
    getActivePartners,
    getTotalParticipants,
  };
}