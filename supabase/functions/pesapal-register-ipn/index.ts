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

    // Get the IPN URL - should be the deployed pesapal-ipn function URL
    const ipnUrl = `${req.headers.get("origin")}/functions/v1/pesapal-ipn`;

    console.log("Registering IPN URL:", ipnUrl);

    const response = await fetch(`${baseUrl}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "GET"
      }),
    });

    if (!response.ok) {
      throw new Error(`IPN registration failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.ipn_id) {
      console.error("IPN registration response:", data);
      throw new Error(`Failed to register IPN: ${data.message || 'Unknown error'}`);
    }

    console.log("Successfully registered IPN with ID:", data.ipn_id);

    return new Response(
      JSON.stringify({ 
        ipn_id: data.ipn_id,
        message: "IPN registered successfully. Store this IPN ID as PESAPAL_NOTIFICATION_ID secret.",
        ipn_url: ipnUrl
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in pesapal-register-ipn:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});