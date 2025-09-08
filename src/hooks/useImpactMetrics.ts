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
    transparencyRate: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setMetrics(prev => ({ ...prev, loading: true, error: null }));

        // Fetch experiences count
        const { count: experiencesCount, error: experiencesError } = await supabase
          .from('experiences')
          .select('*', { count: 'exact', head: true })
          .eq('visible_on_marketplace', true);

        if (experiencesError) throw experiencesError;

        // Fetch approved partners count
        const { count: partnersCount, error: partnersError } = await supabase
          .from('partner_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('kyc_status', 'approved');

        if (partnersError) throw partnersError;

        // Fetch bookings data to calculate funding and travelers
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('total_kes, adults, children')
          .in('status', ['confirmed', 'completed']);

        if (bookingsError) throw bookingsError;

        // Calculate metrics from bookings data
        const totalBookingValue = bookingsData?.reduce((sum, booking) => sum + (booking.total_kes || 0), 0) || 0;
        const totalConservationFunding = totalBookingValue * 0.1; // 10% goes to conservation
        const totalTravelers = bookingsData?.reduce((sum, booking) => sum + (booking.adults || 0) + (booking.children || 0), 0) || 0;

        // Calculate transparency rate (90% since that's our model)
        const transparencyRate = 90;

        setMetrics({
          totalConservationFunding,
          totalExperiences: experiencesCount || 0,
          totalPartners: partnersCount || 0,
          totalTravelers,
          transparencyRate,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching impact metrics:', error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch metrics'
        }));
      }
    };

    fetchMetrics();
  }, []);

  return metrics;
};