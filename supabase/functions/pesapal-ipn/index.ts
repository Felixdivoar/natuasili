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

    const url = new URL(req.url);
    const orderTrackingId = url.searchParams.get("OrderTrackingId");

    if (!orderTrackingId) {
      console.log("IPN request missing OrderTrackingId");
      return new Response("Missing OrderTrackingId", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    console.log("Processing IPN for order:", orderTrackingId);

    // Log the IPN event
    await supabase.from("payment_events").insert({
      order_tracking_id: orderTrackingId,
      event: {
        type: "ipn_received",
        order_tracking_id: orderTrackingId,
        timestamp: new Date().toISOString(),
        query_params: Object.fromEntries(url.searchParams.entries())
      }
    });

    // Get the transaction status from Pesapal
    const statusResponse = await fetch(`${req.headers.get("origin")}/functions/v1/pesapal-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ order_tracking_id: orderTrackingId })
    });

    if (!statusResponse.ok) {
      console.error("Failed to get transaction status");
      return new Response("OK", { headers: corsHeaders }); // Still return OK to prevent retries
    }

    const statusData = await statusResponse.json();
    console.log("Transaction status:", statusData);

    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: statusData.payment_status_description || "PENDING",
        updated_at: new Date().toISOString(),
        raw: statusData
      })
      .eq("order_tracking_id", orderTrackingId);

    if (updateError) {
      console.error("Error updating payment:", updateError);
    }

    // If payment is completed, update booking status
    if (statusData.payment_status_description === "COMPLETED") {
      const { data: payment } = await supabase
        .from("payments")
        .select("booking_id")
        .eq("order_tracking_id", orderTrackingId)
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

    return new Response("OK", { headers: corsHeaders });

  } catch (error) {
    console.error("Error in pesapal-ipn:", error);
    return new Response("OK", { headers: corsHeaders }); // Still return OK to prevent retries
  }
});