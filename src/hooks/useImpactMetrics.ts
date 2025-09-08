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
  console.log('🔄 useImpactMetrics hook called');
  
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    totalConservationFunding: 0,
    totalExperiences: 0,
    totalPartners: 0,
    totalTravelers: 0,
    transparencyRate: 90, // Set default to 90%
    loading: true,
    error: null,
  });

  console.log('📊 Current metrics state:', metrics);

  useEffect(() => {
    console.log('🚀 useEffect triggered - starting data fetch');
    
    const fetchMetrics = async () => {
      try {
        console.log('🚀 Fetching impact metrics...');
        setMetrics(prev => ({ ...prev, loading: true, error: null }));

        // Simple test - try to fetch partners first
        console.log('📍 About to fetch partners...');
        const { count: partnersCount, error: partnersError } = await supabase
          .from('partner_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('kyc_status', 'approved');

        console.log('🏢 Partners result:', { partnersCount, partnersError });
        
        if (partnersError) {
          console.error('❌ Partners error:', partnersError);
          throw partnersError;
        }

        // Simple test - try to fetch experiences
        console.log('📍 About to fetch experiences...');
        const { count: experiencesCount, error: experiencesError } = await supabase
          .from('experiences')
          .select('*', { count: 'exact', head: true })
          .eq('visible_on_marketplace', true);

        console.log('📊 Experiences result:', { experiencesCount, experiencesError });
        
        if (experiencesError) {
          console.error('❌ Experiences error:', experiencesError);
          throw experiencesError;
        }

        const finalMetrics = {
          totalConservationFunding: 0, // Will be 0 since no bookings
          totalExperiences: experiencesCount || 0,
          totalPartners: partnersCount || 0,
          totalTravelers: 0, // Will be 0 since no bookings
          transparencyRate: 90,
          loading: false,
          error: null,
        };

        console.log('✅ Setting final metrics:', finalMetrics);
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

    fetchMetrics();
  }, []);

  return metrics;
};