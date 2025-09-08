import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ImpactMetrics {
  totalConservationFunding: number;
  totalExperiences: number;
  totalPartners: number;
  totalTravelers: number;
  transparencyRate: number;
  loading: boolean;
  error: string | null;
}

export const useImpactMetrics = () => {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    totalConservationFunding: 0,
    totalExperiences: 0,
    totalPartners: 0,
    totalTravelers: 0,
    transparencyRate: 90, // Set default to 90%
    loading: true,
    error: null,
  });

  const fetchMetrics = async () => {
    try {
      console.log('🚀 Fetching real-time impact metrics from database...');
      setMetrics(prev => ({ ...prev, loading: true, error: null }));

      // Fetch all impact metrics from the database
      const { data: impactMetrics, error: metricsError } = await supabase
        .from('impact_metrics')
        .select('*');

      if (metricsError) {
        console.error('❌ Impact metrics error:', metricsError);
        throw metricsError;
      }

      console.log('📊 Impact metrics from database:', impactMetrics);

      // Parse the metrics from database
      const getMetricValue = (key: string) => {
        const metric = impactMetrics?.find(m => m.metric_key === key);
        return metric?.metric_value || 0;
      };

      const finalMetrics = {
        totalConservationFunding: getMetricValue('total_conservation_funding'),
        totalExperiences: getMetricValue('total_experiences'),
        totalPartners: getMetricValue('active_partners'),
        totalTravelers: getMetricValue('total_participants'),
        transparencyRate: 90, // Static for now
        loading: false,
        error: null,
      };

      console.log('✅ Setting final metrics from database:', finalMetrics);
      setMetrics(finalMetrics);

    } catch (error) {
      console.error('❌ Error in fetchMetrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch metrics'
      }));
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscription for impact metrics
    const channel = supabase
      .channel('impact-metrics-component-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_metrics'
        },
        (payload) => {
          console.log('Impact metrics change detected in component:', payload);
          fetchMetrics(); // Refetch when metrics are updated
        }
      )
      .subscribe();

    // Also listen to booking changes since they trigger metric updates
    const bookingChannel = supabase
      .channel('bookings-impact-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change detected - will update impact metrics:', payload);
          // Small delay to allow trigger to complete
          setTimeout(() => {
            fetchMetrics();
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(bookingChannel);
    };
  }, []);

  return metrics;
};