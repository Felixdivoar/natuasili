import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBookingsOverTime } from '@/hooks/useBookingsOverTime';
import { useCurrency } from '@/contexts/CurrencyContext';
import { TrendingUp, Calendar, Loader2 } from 'lucide-react';

const BookingsOverTimeChart: React.FC = () => {
  const { bookingsData, loading, error } = useBookingsOverTime();
  const { formatPrice } = useCurrency();

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Bookings over time
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Bookings over time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Error loading bookings data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookingsData.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Bookings over time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No booking data available</p>
            <p className="text-sm">Data will appear here when you start receiving bookings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate max values for progress bars
  const maxBookings = Math.max(...bookingsData.map(d => d.count));
  const maxRevenue = Math.max(...bookingsData.map(d => d.revenue));

  // Get recent months data (last 6 months)
  const recentData = bookingsData.slice(-6);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Bookings over time
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Last 6 months • Updates in real-time
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentData.map((data, index) => (
            <div key={`${data.month}-${data.year}`} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{data.month}</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{data.count} bookings</span>
                  <span>{formatPrice(data.revenue)}</span>
                </div>
              </div>
              
              {/* Bookings Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Bookings</span>
                  <span>{data.count}</span>
                </div>
                <Progress 
                  value={maxBookings > 0 ? (data.count / maxBookings) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              {/* Revenue Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Revenue</span>
                  <span>{formatPrice(data.revenue)}</span>
                </div>
                <Progress 
                  value={maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0} 
                  className="h-2"
                  // Use a different color for revenue
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {recentData.reduce((sum, d) => sum + d.count, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Bookings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatPrice(recentData.reduce((sum, d) => sum + d.revenue, 0))}
              </div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsOverTimeChart;