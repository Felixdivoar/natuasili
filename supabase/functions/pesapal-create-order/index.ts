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
  reference: string;
  callback_url: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

serve(async (req) => {
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
      currency = "KES",
      description,
      reference,
      callback_url,
      customer,
    }: CreateOrderRequest = await req.json();

    console.log("Creating Pesapal order for booking:", booking_id);

    const pesapalEnv = Deno.env.get("PESAPAL_ENV") || "sandbox";
    const notificationId = Deno.env.get("PESAPAL_NOTIFICATION_ID");

    if (!notificationId) {
      throw new Error("PESAPAL_NOTIFICATION_ID not configured. Register IPN first.");
    }

    const baseUrl = pesapalEnv === "live" 
      ? "https://pay.pesapal.com/v3" 
      : "https://cybqa.pesapal.com/pesapalv3";

    // Get auth token
    const authResponse = await fetch(`${req.headers.get("origin")}/functions/v1/pesapal-auth`, {
      method: "POST"
    });
    
    if (!authResponse.ok) {
      throw new Error("Failed to get auth token");
    }
    
    const { token } = await authResponse.json();

    // Generate unique order tracking ID
    const orderTrackingId = crypto.randomUUID();

    const orderPayload = {
      id: reference,
      currency: currency,
      amount: amount.toString(),
      description: description,
      callback_url: callback_url,
      notification_id: notificationId,
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

    const orderResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      throw new Error(`Order creation failed: ${orderResponse.status} ${orderResponse.statusText}`);
    }

    const orderData = await orderResponse.json();
    
    if (!orderData.order_tracking_id) {
      console.error("Pesapal order error:", orderData);
      throw new Error(`Failed to create Pesapal order: ${orderData.message || 'Unknown error'}`);
    }

    console.log("Created Pesapal order:", orderData.order_tracking_id);

    // Save payment record in database
    const { error: paymentError } = await supabase.from("payments").insert({
      booking_id: booking_id,
      reference: reference,
      order_tracking_id: orderData.order_tracking_id,
      amount: amount,
      currency: currency,
      status: "PENDING",
      channel: "pesapal",
      raw: orderData,
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
    console.error("Error in pesapal-create-order:", error);
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