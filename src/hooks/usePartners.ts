import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Partner = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  short_bio?: string;
  long_bio?: string;
  location_text?: string;
  contact_email?: string;
  logo_image_url?: string;
  hero_image_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
};

export const usePartners = (destination?: string) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        let filteredPartners = data || [];

        // Filter by destination if provided
        if (destination) {
          const locationKeywords: Record<string, string[]> = {
            'nairobi': ['nairobi', 'karen', 'kiambu', 'central'],
            'masai-mara': ['mara', 'maasai', 'masai', 'narok'],
            'samburu': ['samburu', 'northern', 'laikipia north'],
            'northern-kenya': ['samburu', 'northern', 'turkana', 'marsabit'],
            'laikipia': ['laikipia', 'nanyuki', 'nyeri'],
            'coastal-kenya': ['coast', 'coastal', 'mombasa', 'watamu', 'malindi', 'kilifi'],
            'coast': ['coast', 'coastal', 'mombasa', 'watamu', 'malindi', 'kilifi']
          };

          const keywords = locationKeywords[destination] || [];
          filteredPartners = filteredPartners.filter(partner => 
            keywords.some(keyword => 
              partner.location_text?.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        }

        setPartners(filteredPartners);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();

    // Set up real-time subscription for partner updates
    const subscription = supabase
      .channel('partners-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partners'
        },
        () => {
          fetchPartners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [destination]);

  return { partners, loading, error };
};