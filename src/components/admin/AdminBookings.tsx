import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Search, Calendar, Users, DollarSign, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  experience_id: string;
  user_id: string;
  booking_date: string;
  booking_time: string | null;
  adults: number;
  children: number | null;
  total_kes: number;
  donation_kes: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  payment_status: string;
  created_at: string;
  experiences: {
    title: string;
    slug: string;
  } | null;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          experiences(title, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error", 
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending Payment</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.experiences?.title && booking.experiences.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Bookings...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>
                Monitor and manage all customer bookings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {booking.experiences?.title || 'Unknown Experience'}
                        </h3>
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.payment_status)}
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <Users className="h-4 w-4" />
                            Customer
                          </div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {booking.customer_email}
                          </div>
                          {booking.customer_phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {booking.customer_phone}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            Schedule
                          </div>
                          <p className="font-medium">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                          {booking.booking_time && (
                            <p className="text-xs text-muted-foreground">
                              {booking.booking_time}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                            {booking.children && booking.children > 0 && `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}`}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <DollarSign className="h-4 w-4" />
                            Payment
                          </div>
                          <p className="font-medium text-lg">
                            KES {booking.total_kes.toLocaleString()}
                          </p>
                          {booking.donation_kes > 0 && (
                            <p className="text-xs text-green-600">
                              +KES {booking.donation_kes.toLocaleString()} donation
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground mb-1 text-xs">
                            Booked
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.created_at).toLocaleDateString()} at{' '}
                            {new Date(booking.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;