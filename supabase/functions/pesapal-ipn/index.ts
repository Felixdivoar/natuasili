import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
  error?: any;
  status: string;
  message: string;
}

interface PesapalTransactionStatusResponse {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error?: any;
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse the IPN notification from Pesapal
    const url = new URL(req.url);
    const orderTrackingId = url.searchParams.get("OrderTrackingId");
    const merchantReference = url.searchParams.get("OrderMerchantReference");

    console.log("Received Pesapal IPN:", { orderTrackingId, merchantReference });

    if (!orderTrackingId) {
      console.error("Missing OrderTrackingId in IPN");
      return new Response("Missing OrderTrackingId", { status: 400 });
    }

    // Get Pesapal credentials
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");

    if (!consumerKey || !consumerSecret) {
      throw new Error("Pesapal credentials not configured");
    }

    // Step 1: Get Pesapal access token
    const tokenResponse = await fetch("https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    });

    const tokenData: PesapalAuthResponse = await tokenResponse.json();
    
    if (!tokenData.token) {
      console.error("Pesapal token error:", tokenData);
      throw new Error(`Failed to get Pesapal token: ${tokenData.message}`);
    }

    // Step 2: Query transaction status
    const statusResponse = await fetch(
      `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${tokenData.token}`,
        },
      }
    );

    const statusData: PesapalTransactionStatusResponse = await statusResponse.json();
    
    console.log("Pesapal transaction status:", statusData);

    // Step 3: Find the payment record
    const { data: payment, error: findError } = await supabase
      .from("payments")
      .select("*, bookings(*)")
      .eq("order_tracking_id", orderTrackingId)
      .single();

    if (findError || !payment) {
      console.error("Payment not found:", findError);
      return new Response("Payment not found", { status: 404 });
    }

    // Step 4: Update payment status based on Pesapal response
    let newPaymentStatus = "pending";
    let newBookingStatus = "pending";

    if (statusData.payment_status_code === "1" || statusData.payment_status_description === "COMPLETED") {
      newPaymentStatus = "successful";
      newBookingStatus = "confirmed";
    } else if (statusData.payment_status_code === "2" || statusData.payment_status_description === "FAILED") {
      newPaymentStatus = "failed";
      newBookingStatus = "cancelled";
    } else if (statusData.payment_status_code === "3" || statusData.payment_status_description === "REVERSED") {
      newPaymentStatus = "failed";
      newBookingStatus = "cancelled";
    }

    // Step 5: Update payment record
    const { error: updatePaymentError } = await supabase
      .from("payments")
      .update({
        status: newPaymentStatus,
        pesapal_transaction_id: statusData.confirmation_code,
        payment_data: {
          ...payment.payment_data,
          transaction_status: statusData,
          updated_at: new Date().toISOString(),
        },
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      console.error("Error updating payment:", updatePaymentError);
      throw new Error(`Failed to update payment: ${updatePaymentError.message}`);
    }

    // Step 6: Update booking status
    const { error: updateBookingError } = await supabase
      .from("bookings")
      .update({
        status: newBookingStatus,
        payment_status: newPaymentStatus === "successful" ? "paid" : "failed",
      })
      .eq("id", payment.booking_id);

    if (updateBookingError) {
      console.error("Error updating booking:", updateBookingError);
      throw new Error(`Failed to update booking: ${updateBookingError.message}`);
    }

    console.log(`Payment ${payment.id} updated to ${newPaymentStatus}, booking ${payment.booking_id} updated to ${newBookingStatus}`);

    return new Response("OK", { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("Error in pesapal-ipn:", error);
    return new Response(`Error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});