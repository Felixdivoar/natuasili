import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, MapPin, Calendar, DollarSign, TrendingUp, Award } from 'lucide-react';

interface AdminStats {
  totalPartners: number;
  totalExperiences: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  approvedPartners: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [
          partnersResult,
          experiencesResult, 
          bookingsResult,
          approvedPartnersResult
        ] = await Promise.all([
          supabase.from('partner_profiles').select('*', { count: 'exact' }),
          supabase.from('experiences').select('*', { count: 'exact' }),
          supabase.from('bookings').select('total_kes, status', { count: 'exact' }),
          supabase.from('partner_profiles').select('*', { count: 'exact' }).eq('kyc_status', 'approved')
        ]);

        // Calculate revenue from confirmed/completed bookings
        const confirmedBookings = bookingsResult.data?.filter(
          booking => booking.status === 'confirmed' || booking.status === 'completed'
        ) || [];
        
        const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.total_kes || 0), 0);
        
        const pendingBookings = bookingsResult.data?.filter(
          booking => booking.status === 'pending'
        ).length || 0;

        setStats({
          totalPartners: partnersResult.count || 0,
          totalExperiences: experiencesResult.count || 0,
          totalBookings: bookingsResult.count || 0,
          totalRevenue,
          pendingBookings,
          approvedPartners: approvedPartnersResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Partners",
      value: stats?.totalPartners || 0,
      description: `${stats?.approvedPartners || 0} approved`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Experiences", 
      value: stats?.totalExperiences || 0,
      description: "Active listings",
      icon: MapPin,
      color: "text-green-600"
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0, 
      description: `${stats?.pendingBookings || 0} pending`,
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: `KES ${(stats?.totalRevenue || 0).toLocaleString()}`,
      description: "From confirmed bookings",
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      title: "Approval Rate",
      value: stats?.totalPartners ? `${Math.round(((stats?.approvedPartners || 0) / stats.totalPartners) * 100)}%` : '0%',
      description: "Partner approval rate",
      icon: Award,
      color: "text-orange-600"
    },
    {
      title: "Avg Revenue/Booking",
      value: `KES ${stats?.totalBookings ? Math.round((stats?.totalRevenue || 0) / stats.totalBookings).toLocaleString() : '0'}`,
      description: "Average booking value",
      icon: TrendingUp,
      color: "text-pink-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Key metrics and system status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Use the tabs above to:
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Manage partner profiles and approval status</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>Create, edit, and moderate experiences</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>Monitor and manage all bookings</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;