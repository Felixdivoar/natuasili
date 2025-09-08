import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BookingsByMonth {
  month: string;
  year: number;
  count: number;
  revenue: number;
}

export function useBookingsOverTime() {
  const { user, profile } = useAuth();
  const [bookingsData, setBookingsData] = useState<BookingsByMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile || (profile.role !== 'partner' && profile.role !== 'admin')) return;

    async function fetchBookingsOverTime() {
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

        // Get experiences for this partner
        const { data: experiences } = await supabase
          .from('experiences')
          .select('id')
          .eq('partner_id', partnerProfile.id);

        const experienceIds = experiences?.map(exp => exp.id) || [];

        if (experienceIds.length === 0) {
          setBookingsData([]);
          return;
        }

        // Fetch bookings for the last 12 months
        const currentDate = new Date();
        const twelveMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);

        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('created_at, total_kes, status')
          .in('experience_id', experienceIds)
          .gte('created_at', twelveMonthsAgo.toISOString())
          .in('status', ['confirmed', 'completed']);

        if (bookingsError) throw bookingsError;

        // Group bookings by month
        const monthlyData: { [key: string]: BookingsByMonth } = {};
        
        // Initialize all months with zero values
        for (let i = 11; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          
          monthlyData[monthKey] = {
            month: monthName,
            year: date.getFullYear(),
            count: 0,
            revenue: 0
          };
        }

        // Aggregate actual booking data
        bookings?.forEach(booking => {
          const bookingDate = new Date(booking.created_at);
          const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
          
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].count += 1;
            monthlyData[monthKey].revenue += booking.total_kes;
          }
        });

        // Convert to array and sort by date
        const sortedData = Object.values(monthlyData).sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return new Date(`${a.month} 1, ${a.year}`).getMonth() - new Date(`${b.month} 1, ${b.year}`).getMonth();
        });

        setBookingsData(sortedData);

      } catch (err) {
        console.error('Error fetching bookings over time:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings data');
      } finally {
        setLoading(false);
      }
    }

    fetchBookingsOverTime();

    // Set up real-time subscription
    const setupRealtime = async () => {
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!partnerProfile?.id) return null;

      // Subscribe to booking changes
      const bookingsChannel = supabase
        .channel('bookings-over-time-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings'
          },
          (payload) => {
            console.log('Booking change detected for over-time chart:', payload);
            fetchBookingsOverTime(); // Refetch when bookings change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(bookingsChannel);
      };
    };

    let cleanup: (() => void) | null = null;
    setupRealtime().then(cleanupFunc => {
      cleanup = cleanupFunc;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [user, profile]);

  return {
    bookingsData,
    loading,
    error,
  };
}