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