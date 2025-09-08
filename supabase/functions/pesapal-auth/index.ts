import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory token cache
let cachedToken: { token: string; expires: number } | null = null;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");
    const pesapalEnv = Deno.env.get("PESAPAL_ENV") || "sandbox";

    if (!consumerKey || !consumerSecret) {
      throw new Error("Pesapal credentials not configured");
    }

    const baseUrl = pesapalEnv === "live" 
      ? "https://pay.pesapal.com/v3" 
      : "https://cybqa.pesapal.com/pesapalv3";

    // Check if we have a valid cached token
    const now = Date.now();
    if (cachedToken && cachedToken.expires > now) {
      return new Response(
        JSON.stringify({ token: cachedToken.token }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching new Pesapal token...");

    const response = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
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

    if (!response.ok) {
      throw new Error(`Auth request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.token) {
      console.error("Auth response:", data);
      throw new Error(`Failed to get token: ${data.message || 'Unknown error'}`);
    }

    // Cache token for 25 minutes (expires in 30, but we refresh early)
    cachedToken = {
      token: data.token,
      expires: now + (25 * 60 * 1000)
    };

    console.log("Successfully obtained Pesapal token");

    return new Response(
      JSON.stringify({ token: data.token }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in pesapal-auth:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});