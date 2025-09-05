import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Badge } from '@/components/ui/badge';

type PaymentStatus = 'loading' | 'success' | 'failed' | 'not-found';

interface PaymentData {
  id: string;
  booking_id: string;
  order_tracking_id: string;
  status: string;
  amount: number;
  currency: string;
  payment_data: any;
  bookings: {
    id: string;
    customer_name: string;
    customer_email: string;
    booking_date: string;
    adults: number;
    children: number;
    total_kes: number;
    status: string;
    payment_status: string;
    experiences: {
      title: string;
      slug: string;
    };
  };
}

export default function PesapalCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string>('');

  const orderTrackingId = searchParams.get('OrderTrackingId');
  const merchantReference = searchParams.get('OrderMerchantReference');

  useEffect(() => {
    if (!orderTrackingId) {
      setStatus('not-found');
      setError('Missing order tracking ID');
      return;
    }

    checkPaymentStatus();
    
    // Poll every 3 seconds for up to 60 seconds
    const pollInterval = setInterval(checkPaymentStatus, 3000);
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (status === 'loading') {
        setStatus('failed');
        setError('Payment verification timeout');
      }
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [orderTrackingId]);

  const checkPaymentStatus = async () => {
    if (!orderTrackingId) return;

    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            *,
            experiences (
              title,
              slug
            )
          )
        `)
        .eq('order_tracking_id', orderTrackingId)
        .single();

      if (error) {
        console.error('Error fetching payment:', error);
        setStatus('not-found');
        setError('Payment record not found');
        return;
      }

      setPaymentData(payment);

      if (payment.status === 'successful') {
        setStatus('success');
      } else if (payment.status === 'failed' || payment.status === 'cancelled') {
        setStatus('failed');
        setError('Payment was not completed successfully');
      } else {
        // Keep loading if still pending
        setStatus('loading');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setError('Failed to check payment status');
      setStatus('failed');
    }
  };

  const calculateSplit = (amount: number) => {
    const partner90 = Math.round(amount * 0.9);
    const platform10 = amount - partner90;
    return { partner90, platform10 };
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center">Processing Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              Please wait while we verify your payment with Pesapal...
            </p>
            <p className="text-xs text-muted-foreground">
              This may take up to a minute
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'failed' || status === 'not-found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {error || 'There was an issue processing your payment.'}
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Back to Home
              </Button>
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success' && paymentData) {
    const split = calculateSplit(paymentData.amount);
    
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <CardTitle className="text-2xl text-green-600">
                  Payment Successful!
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Booking Details */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Booking Confirmation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-medium">{paymentData.bookings.experiences.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(paymentData.bookings.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{paymentData.bookings.adults + paymentData.bookings.children} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{paymentData.bookings.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Confirmed
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{formatPrice(paymentData.amount)}</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Partner initiatives (90%):</span>
                      <span>{formatPrice(split.partner90)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform & operations (10%):</span>
                      <span>{formatPrice(split.platform10)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What happens next:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• You'll receive a confirmation email with booking details</li>
                  <li>• The partner will contact you 24-48 hours before your experience</li>
                  <li>• Meeting point and pickup information will be provided</li>
                  <li>• 90% of your payment supports conservation initiatives</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button onClick={() => navigate('/')} className="w-full">
                  Back to Home
                </Button>
                <Button 
                  onClick={() => navigate('/user-dashboard')} 
                  variant="outline" 
                  className="w-full"
                >
                  View My Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
