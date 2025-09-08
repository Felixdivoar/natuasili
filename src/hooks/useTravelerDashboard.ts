import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  id: string;
  experience_id: string;
  booking_date: string;
  booking_time: string | null;
  adults: number;
  children: number;
  total_kes: number;
  status: string;
  customer_name: string;
  created_at: string;
  experience: {
    title: string;
    slug: string;
    hero_image: string | null;
    partner_profiles: {
      org_name: string;
      slug: string;
    } | null;
  } | null;
}

interface WishlistItem {
  id: string;
  experience_id: string;
  created_at: string;
  experiences: {
    title: string;
    slug: string;
    hero_image: string | null;
    description: string | null;
    price_kes_adult: number;
  } | null;
}

interface TravelerStats {
  totalSpent: number;
  totalBookings: number;
  totalExperiences: number;
  conservationContribution: number;
}

export function useTravelerDashboard() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [stats, setStats] = useState<TravelerStats>({
    totalSpent: 0,
    totalBookings: 0,
    totalExperiences: 0,
    conservationContribution: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile || profile.role !== 'traveler') return;

    async function fetchTravelerData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's bookings with experience and partner details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            experiences!inner(
              title,
              slug,
              hero_image,
              partner_profiles!inner(
                org_name,
                slug
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        
        // Transform booking data to match interface
        const transformedBookings = bookingsData?.map(booking => ({
          ...booking,
          experience: booking.experiences
        })) || [];

        setBookings(transformedBookings);

        // Fetch user's wishlist
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists')
          .select(`
            *,
            experiences!inner(
              title,
              slug,
              hero_image,
              description,
              price_kes_adult
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (wishlistError) throw wishlistError;
        setWishlist(wishlistData || []);

        // Calculate stats from transformed bookings
        const confirmedBookings = transformedBookings.filter(booking => 
          booking.status === 'confirmed' || booking.status === 'completed'
        );

        const totalSpent = confirmedBookings.reduce((sum, booking) => sum + booking.total_kes, 0);
        const totalBookings = confirmedBookings.length;
        const totalExperiences = new Set(confirmedBookings.map(booking => booking.experience_id)).size;
        // Assume 75% of booking amount goes to conservation (can be made dynamic)
        const conservationContribution = totalSpent * 0.75;

        setStats({
          totalSpent,
          totalBookings,
          totalExperiences,
          conservationContribution,
        });

      } catch (err) {
        console.error('Error fetching traveler dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchTravelerData();

    // Set up real-time subscription for bookings
    const bookingsChannel = supabase
      .channel('user-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTravelerData(); // Refetch when bookings change
        }
      )
      .subscribe();

    // Set up real-time subscription for wishlist
    const wishlistChannel = supabase
      .channel('user-wishlist')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlists',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTravelerData(); // Refetch when wishlist changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(wishlistChannel);
    };
  }, [user, profile]);

  return {
    bookings,
    wishlist,
    stats,
    loading,
    error,
  };
}