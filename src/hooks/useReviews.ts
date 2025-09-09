import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  verified: boolean;
  helpful_count: number;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

interface UserBooking {
  id: string;
  status: string;
  created_at: string;
}

export const useReviews = (experienceId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userBooking, setUserBooking] = useState<UserBooking | null>(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('experience_id', experienceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profile data separately for each review
      const reviewsWithProfiles = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', review.user_id)
            .single();
          
          return {
            ...review,
            profiles: profile || { first_name: null, last_name: null }
          };
        })
      );
      
      setReviews(reviewsWithProfiles);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    }
  };

  const checkUserBookingAndReview = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user has a completed booking for this experience
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id, status, created_at')
        .eq('experience_id', experienceId)
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'completed'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (bookingError) throw bookingError;
      
      if (bookings && bookings.length > 0) {
        setUserBooking(bookings[0]);

        // Check if user has already reviewed this experience
        const { data: existingReviews, error: reviewError } = await supabase
          .from('reviews')
          .select('id')
          .eq('experience_id', experienceId)
          .eq('user_id', user.id);

        if (reviewError) throw reviewError;
        setUserHasReviewed(existingReviews.length > 0);
      }
    } catch (err) {
      console.error('Error checking user booking status:', err);
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (reviewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('review_helpful_votes')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Remove vote
        await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id);
      } else {
        // Add vote
        await supabase
          .from('review_helpful_votes')
          .insert({
            review_id: reviewId,
            user_id: user.id,
          });
      }

      // Refresh reviews to update helpful count
      fetchReviews();
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkUserBookingAndReview();

    // Set up real-time subscription for reviews
    const reviewsSubscription = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `experience_id=eq.${experienceId}`,
        },
        () => fetchReviews()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reviewsSubscription);
    };
  }, [experienceId]);

  const canSubmitReview = userBooking && !userHasReviewed;
  
  return {
    reviews,
    userBooking,
    canSubmitReview,
    loading,
    error,
    markHelpful,
    refreshReviews: fetchReviews,
  };
};