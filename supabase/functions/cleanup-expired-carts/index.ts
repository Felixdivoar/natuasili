import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    console.log("Starting cart cleanup process");

    // Call the database function to clean up expired carts
    const { error } = await supabase.rpc('cleanup_expired_carts');

    if (error) {
      console.error("Cart cleanup failed:", error);
      throw new Error(`Cart cleanup failed: ${error.message}`);
    }

    console.log("Cart cleanup completed successfully");

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Expired carts cleaned up successfully",
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Cart cleanup error:", error);
    
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message || "Failed to cleanup expired carts"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});