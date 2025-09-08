import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { order_tracking_id } = await req.json();

    if (!order_tracking_id) {
      throw new Error("order_tracking_id is required");
    }

    console.log("Checking status for order:", order_tracking_id);

    const pesapalEnv = Deno.env.get("PESAPAL_ENV") || "sandbox";
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

    // Get transaction status from Pesapal
    const statusResponse = await fetch(
      `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${order_tracking_id}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status} ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    console.log("Pesapal status response:", statusData);

    // Log the status check event
    await supabase.from("payment_events").insert({
      order_tracking_id: order_tracking_id,
      event: {
        type: "status_check",
        order_tracking_id: order_tracking_id,
        timestamp: new Date().toISOString(),
        status_data: statusData
      }
    });

    // Update payment record with latest status
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: statusData.payment_status_description || "PENDING",
        updated_at: new Date().toISOString(),
        raw: statusData
      })
      .eq("order_tracking_id", order_tracking_id);

    if (updateError) {
      console.error("Error updating payment:", updateError);
    }

    // If payment is completed, update booking status
    if (statusData.payment_status_description === "COMPLETED") {
      const { data: payment } = await supabase
        .from("payments")
        .select("booking_id")
        .eq("order_tracking_id", order_tracking_id)
        .single();

      if (payment?.booking_id) {
        await supabase
          .from("bookings")
          .update({
            payment_status: "completed",
            status: "confirmed",
            updated_at: new Date().toISOString()
          })
          .eq("id", payment.booking_id);

        console.log("Updated booking status to confirmed");
      }
    }

    return new Response(
      JSON.stringify(statusData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in pesapal-status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});