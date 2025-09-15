import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExperienceRating {
  averageRating: number;
  totalReviews: number;
  loading: boolean;
}

export const useExperienceRating = (experienceId: string): ExperienceRating => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        // Skip database query if experienceId is not a UUID format
        if (!isValidUUID(experienceId)) {
          setAverageRating(0);
          setTotalReviews(0);
          setLoading(false);
          return;
        }

        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('experience_id', experienceId);

        if (error) {
          console.error('Error fetching ratings:', error);
          setLoading(false);
          return;
        }

        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviews.length;
          
          setAverageRating(avgRating);
          setTotalReviews(reviews.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      } catch (err) {
        console.error('Error fetching experience rating:', err);
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();

    // Skip real-time subscription for non-UUID IDs
    if (!isValidUUID(experienceId)) {
      return;
    }

    // Set up real-time subscription for rating updates
    const ratingsSubscription = supabase
      .channel('ratings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `experience_id=eq.${experienceId}`,
        },
        () => fetchRating()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ratingsSubscription);
    };
  }, [experienceId]);

  return {
    averageRating,
    totalReviews,
    loading
  };
};

// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}