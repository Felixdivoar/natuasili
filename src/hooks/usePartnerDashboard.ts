import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PartnerStats {
  monthlyBookings: number;
  monthlyRevenue: number;
  monthlyDonations: number;
  totalTravelers: number;
  averageRating: number;
  totalExperiences: number;
  totalEarnings: number;
  totalDonations: number;
}

interface BookingData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  booking_date: string;
  adults: number;
  children: number;
  total_kes: number;
  donation_kes: number;
  status: string;
  experience_title: string;
  created_at: string;
}

interface ExperienceData {
  id: string;
  title: string;
  slug: string;
  hero_image: string | null;
  price_kes_adult: number;
  location_text: string | null;
  visible_on_marketplace: boolean;
  created_at: string;
}

export function usePartnerDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<PartnerStats>({
    monthlyBookings: 0,
    monthlyRevenue: 0,
    monthlyDonations: 0,
    totalTravelers: 0,
    averageRating: 0,
    totalExperiences: 0,
    totalEarnings: 0,
    totalDonations: 0,
  });
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile || (profile.role !== 'partner' && profile.role !== 'admin')) return;

    async function fetchPartnerData() {
      try {
        setLoading(true);
        setError(null);

        // Get partner profile to find partner ID
        const { data: partnerProfile } = await supabase
          .from('partner_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!partnerProfile) {
          setError('Partner profile not found');
          return;
        }

        // Fetch experiences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('experiences')
          .select('*')
          .eq('partner_id', partnerProfile.id)
          .order('created_at', { ascending: false });

        if (experiencesError) throw experiencesError;
        setExperiences(experiencesData || []);

        // Get experience IDs for booking queries
        const experienceIds = experiencesData?.map(exp => exp.id) || [];

        if (experienceIds.length > 0) {
          // Fetch bookings for partner's experiences
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              id,
              customer_name,
              customer_email,
              customer_phone,
              booking_date,
              adults,
              children,
              total_kes,
              donation_kes,
              status,
              created_at,
              experiences!inner(title)
            `)
            .in('experience_id', experienceIds)
            .order('created_at', { ascending: false })
            .limit(10);

          if (bookingsError) throw bookingsError;

          // Transform booking data
          const transformedBookings = bookingsData?.map(booking => ({
            ...booking,
            experience_title: (booking as any).experiences.title
          })) || [];

          setRecentBookings(transformedBookings);

          // Calculate stats
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const monthlyBookings = bookingsData?.filter(booking => {
            const bookingDate = new Date(booking.created_at);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear &&
                   (booking.status === 'confirmed' || booking.status === 'completed');
          }).length || 0;

          // Calculate monthly revenue (excluding donations)
          const monthlyRevenue = bookingsData?.filter(booking => {
            const bookingDate = new Date(booking.created_at);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear &&
                   (booking.status === 'confirmed' || booking.status === 'completed');
          }).reduce((sum, booking) => sum + (booking.total_kes - booking.donation_kes), 0) || 0;

          // Calculate monthly donations separately
          const monthlyDonations = bookingsData?.filter(booking => {
            const bookingDate = new Date(booking.created_at);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear &&
                   (booking.status === 'confirmed' || booking.status === 'completed');
          }).reduce((sum, booking) => sum + booking.donation_kes, 0) || 0;

          const totalTravelers = bookingsData?.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'completed'
          ).reduce((sum, booking) => sum + booking.adults + (booking.children || 0), 0) || 0;

          // Calculate total earnings (excluding donations)
          const totalEarnings = bookingsData?.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'completed'
          ).reduce((sum, booking) => sum + (booking.total_kes - booking.donation_kes), 0) || 0;

          // Calculate total donations separately
          const totalDonations = bookingsData?.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'completed'
          ).reduce((sum, booking) => sum + booking.donation_kes, 0) || 0;

          setStats({
            monthlyBookings,
            monthlyRevenue,
            monthlyDonations,
            totalTravelers,
            averageRating: 4.8, // Mock rating for now
            totalExperiences: experiencesData?.length || 0,
            totalEarnings,
            totalDonations,
          });
        }

      } catch (err) {
        console.error('Error fetching partner dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchPartnerData();

    // Set up real-time subscriptions
    let cleanup: (() => void) | null = null;
    
    // Get partner profile ID for filters and set up subscriptions
    const setupRealtime = async () => {
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!partnerProfile?.id) return;

      // Set up real-time subscription for bookings
      const bookingsChannel = supabase
        .channel('partner-bookings-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public', 
            table: 'bookings'
          },
          (payload) => {
            console.log('Booking change detected:', payload);
            fetchPartnerData(); // Refetch when bookings change
          }
        )
        .subscribe();

      // Set up real-time subscription for experiences
      const experiencesChannel = supabase
        .channel('partner-experiences-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'experiences',
            filter: `partner_id=eq.${partnerProfile.id}`
          },
          (payload) => {
            console.log('Experience change detected:', payload);
            fetchPartnerData(); // Refetch when experiences change
          }
        )
        .subscribe();

      // Set up real-time subscription for payments
      const paymentsChannel = supabase
        .channel('partner-payments-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payments'
          },
          (payload) => {
            console.log('Payment change detected:', payload);
            fetchPartnerData(); // Refetch when payments change
          }
        )
        .subscribe();

      // Set cleanup function
      cleanup = () => {
        supabase.removeChannel(bookingsChannel);
        supabase.removeChannel(experiencesChannel);
        supabase.removeChannel(paymentsChannel);
      };
    };

    setupRealtime();

    // Return cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, [user, profile]);

  return {
    stats,
    recentBookings,
    experiences,
    loading,
    error,
  };
}