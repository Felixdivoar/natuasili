import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentRequest {
  booking_id: string;
  amount: number;
  currency?: string;
  description?: string;
  customer: {
    email: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  };
  callback_url?: string;
}

interface PaymentResponse {
  ok: boolean;
  redirect_url?: string;
  tracking_id?: string;
  order_id?: string;
  error?: string;
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentOrder = useCallback(async (request: PaymentRequest): Promise<PaymentResponse> => {
    setLoading(true);
    
    try {
      console.log("Creating PesaPal payment order:", request);

      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if user is authenticated
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await supabase.functions.invoke('create-pesapal-order', {
        body: request,
        headers
      });

      if (response.error) {
        console.error("PesaPal function error:", response.error);
        throw new Error(response.error.message || 'Payment service error');
      }

      const data = response.data as PaymentResponse;
      
      if (!data.ok) {
        throw new Error(data.error || 'Payment order creation failed');
      }

      console.log("Payment order created successfully:", data.tracking_id);
      
      toast({
        title: "Payment Order Created",
        description: "Redirecting to payment gateway...",
      });

      return data;

    } catch (error: any) {
      console.error("Payment order creation failed:", error);
      
      const errorMessage = error.message || 'Failed to create payment order';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        ok: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Check payment status
  const checkPaymentStatus = useCallback(async (trackingId: string) => {
    try {
      const response = await supabase.functions.invoke('pesapal-status', {
        body: { tracking_id: trackingId }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error: any) {
      console.error("Payment status check failed:", error);
      throw error;
    }
  }, []);

  // Process payment for a booking
  const processBookingPayment = useCallback(async (
    bookingId: string,
    customerInfo: PaymentRequest['customer'],
    callbackUrl?: string
  ) => {
    try {
      // Get booking details
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id,
          total_kes,
          customer_name,
          customer_email,
          customer_phone,
          experiences (
            title
          )
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        throw new Error('Booking not found');
      }

      // Create payment order
      const paymentRequest: PaymentRequest = {
        booking_id: bookingId,
        amount: booking.total_kes,
        currency: 'KES',
        description: `Payment for ${booking.experiences?.title || 'booking'}`,
        customer: {
          email: customerInfo.email || booking.customer_email,
          phone: customerInfo.phone || booking.customer_phone,
          first_name: customerInfo.first_name || booking.customer_name?.split(' ')[0],
          last_name: customerInfo.last_name || booking.customer_name?.split(' ').slice(1).join(' '),
        },
        callback_url: callbackUrl
      };

      const result = await createPaymentOrder(paymentRequest);

      if (result.ok && result.redirect_url) {
        // Redirect to payment gateway
        window.location.href = result.redirect_url;
      }

      return result;
    } catch (error: any) {
      console.error("Booking payment processing failed:", error);
      
      toast({
        title: "Payment Error",
        description: error.message || 'Failed to process payment',
        variant: "destructive",
      });

      return {
        ok: false,
        error: error.message || 'Failed to process payment'
      };
    }
  }, [createPaymentOrder, toast]);

  return {
    loading,
    createPaymentOrder,
    checkPaymentStatus,
    processBookingPayment,
  };
}