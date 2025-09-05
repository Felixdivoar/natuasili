import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderRequest {
  booking_id: string;
  amount: number;
  currency: string;
  description: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
  error?: any;
  status: string;
  message: string;
}

interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: any;
  status: string;
  message: string;
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

    const {
      booking_id,
      amount,
      currency,
      description,
      customer,
    }: CreateOrderRequest = await req.json();

    console.log("Creating Pesapal order for booking:", booking_id);

    // Get Pesapal credentials
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");
    const callbackUrl = `${req.headers.get("origin")}/pesapal/callback`;
    const ipnId = "https://natuasili.com/?natuasili_pesapal_ipn=1";

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

    console.log("Got Pesapal token successfully");

    // Step 2: Create order with Pesapal
    const orderTrackingId = crypto.randomUUID();
    const merchantReference = `booking_${booking_id}_${Date.now()}`;

    const orderPayload = {
      id: orderTrackingId,
      currency: currency,
      amount: amount.toString(),
      description: description,
      callback_url: callbackUrl,
      notification_id: ipnId,
      branch: "default",
      billing_address: {
        email_address: customer.email,
        phone_number: customer.phone_number,
        country_code: "KE",
        first_name: customer.first_name,
        middle_name: "",
        last_name: customer.last_name,
        line_1: "",
        line_2: "", 
        city: "",
        state: "",
        postal_code: "",
        zip_code: ""
      }
    };

    console.log("Creating Pesapal order with payload:", orderPayload);

    const orderResponse = await fetch("https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${tokenData.token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData: PesapalOrderResponse = await orderResponse.json();
    
    if (!orderData.order_tracking_id) {
      console.error("Pesapal order error:", orderData);
      throw new Error(`Failed to create Pesapal order: ${orderData.message}`);
    }

    console.log("Created Pesapal order:", orderData.order_tracking_id);

    // Step 3: Save payment record in database
    const { error: paymentError } = await supabase.from("payments").insert({
      booking_id: booking_id,
      order_tracking_id: orderData.order_tracking_id,
      amount: amount,
      currency: currency,
      status: "pending",
      payment_data: {
        merchant_reference: orderData.merchant_reference,
        pesapal_order_data: orderData,
      },
    });

    if (paymentError) {
      console.error("Database error:", paymentError);
      throw new Error(`Failed to save payment record: ${paymentError.message}`);
    }

    console.log("Payment record saved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        order_tracking_id: orderData.order_tracking_id,
        redirect_url: orderData.redirect_url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-pesapal-order:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});