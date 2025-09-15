import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables
const PESA_ENV = Deno.env.get("PESAPAL_ENV") ?? "sandbox";
const BASE_URL = PESA_ENV === "live"
  ? "https://pay.pesapal.com/v3"
  : "https://cybqa.pesapal.com/pesapalv3";

const CONSUMER_KEY = Deno.env.get("PESAPAL_CONSUMER_KEY")!;
const CONSUMER_SECRET = Deno.env.get("PESAPAL_CONSUMER_SECRET")!;
const NOTIFICATION_ID = Deno.env.get("PESAPAL_NOTIFICATION_ID");

// Supabase client with service role for database operations
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get PesaPal access token
async function getAccessToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PesaPal Auth failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.token as string;
}

// Validate booking exists and user has access
async function validateBooking(bookingId: string, userId?: string) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      user_id,
      total_kes,
      status,
      customer_name,
      customer_email,
      customer_phone,
      experiences (
        title,
        partner_profiles (
          org_name
        )
      )
    `)
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    throw new Error("Booking not found");
  }

  // Check if user has access to this booking
  if (userId && booking.user_id !== userId) {
    throw new Error("Unauthorized access to booking");
  }

  if (booking.status !== 'pending') {
    throw new Error("Booking is not pending payment");
  }

  return booking;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    console.log("Processing PesaPal order creation request");
    
    const body = await req.json();
    const { 
      booking_id, 
      amount, 
      currency = "KES", 
      description,
      customer,
      callback_url 
    } = body;

    // Validate required fields
    if (!booking_id || !amount || !customer?.email) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Missing required fields: booking_id, amount, customer.email" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get user from authorization header if present
    const authHeader = req.headers.get("authorization");
    let userId: string | undefined;
    
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id;
      } catch (error) {
        console.warn("Failed to get user from token:", error);
      }
    }

    // Validate booking
    const booking = await validateBooking(booking_id, userId);
    
    // Verify amount matches booking total
    if (Math.abs(Number(amount) - booking.total_kes) > 0.01) {
      throw new Error("Amount mismatch with booking total");
    }

    console.log("Getting PesaPal access token");
    const token = await getAccessToken();

    // Create unique order ID
    const orderId = crypto.randomUUID();
    
    // Prepare order request
    const orderRequest = {
      id: orderId,
      currency: currency,
      amount: Number(amount),
      description: description || `Payment for ${booking.experiences?.title || 'booking'}`,
      callback_url: callback_url || `${req.headers.get("origin")}/booking-confirmation`,
      notification_id: NOTIFICATION_ID,
      billing_address: {
        email_address: customer.email || booking.customer_email,
        phone_number: customer.phone || booking.customer_phone,
        first_name: customer.first_name || booking.customer_name?.split(' ')[0] || 'Customer',
        last_name: customer.last_name || booking.customer_name?.split(' ').slice(1).join(' ') || '',
      },
    };

    console.log("Submitting order to PesaPal:", { orderId, amount: orderRequest.amount });
    
    // Submit order to PesaPal
    const orderResponse = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderRequest),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("PesaPal order submission failed:", errorText);
      throw new Error(`Order submission failed: ${orderResponse.status} ${errorText}`);
    }

    const orderData = await orderResponse.json();
    console.log("PesaPal order created successfully:", orderData.order_tracking_id);

    // Create payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: booking_id,
        amount: Number(amount),
        currency: currency,
        order_tracking_id: orderData.order_tracking_id,
        status: 'pending',
        channel: 'pesapal',
        payment_data: orderData,
        raw: { request: orderRequest, response: orderData }
      });

    if (paymentError) {
      console.error("Failed to create payment record:", paymentError);
      // Don't fail the request since PesaPal order was created successfully
    }

    // Return success response
    return new Response(
      JSON.stringify({
        ok: true,
        redirect_url: orderData.redirect_url,
        tracking_id: orderData.order_tracking_id,
        order_id: orderId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("PesaPal order creation error:", error);
    
    // Return user-friendly error response
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message || "Failed to create payment order"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});