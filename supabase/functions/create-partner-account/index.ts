import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreatePartnerAccountRequest {
  partnerProfileId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { partnerProfileId }: CreatePartnerAccountRequest = await req.json();

    console.log("Creating partner account for profile:", partnerProfileId);

    // Get partner profile details
    const { data: partnerProfile, error: profileError } = await supabaseAdmin
      .from("partner_profiles")
      .select("*")
      .eq("id", partnerProfileId)
      .single();

    if (profileError || !partnerProfile) {
      throw new Error(`Partner profile not found: ${profileError?.message}`);
    }

    if (partnerProfile.kyc_status !== "approved") {
      throw new Error("Partner profile must be approved before creating account");
    }

    console.log("Found partner profile:", partnerProfile.org_name);

    // Check if user already exists
    const { data: existingUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(
      partnerProfile.user_id
    );

    if (getUserError && getUserError.message !== "User not found") {
      throw new Error(`Error checking existing user: ${getUserError.message}`);
    }

    let userId = partnerProfile.user_id;

    // If user doesn't exist, create them using the contact email
    if (!existingUser?.user) {
      const contactEmail = partnerProfile.contacts?.[0]?.email || "";
      if (!contactEmail) {
        throw new Error("No contact email found in partner profile");
      }

      console.log("Creating new user account for:", contactEmail);

      // Generate a temporary password
      const tempPassword = `TempPass${Math.random().toString(36).slice(2)}!`;

      const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: contactEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          role: "partner",
          first_name: partnerProfile.contacts?.[0]?.name?.split(" ")[0] || "",
          last_name: partnerProfile.contacts?.[0]?.name?.split(" ").slice(1).join(" ") || "",
          org_name: partnerProfile.org_name,
        },
      });

      if (createUserError || !newUser.user) {
        throw new Error(`Failed to create user: ${createUserError?.message}`);
      }

      userId = newUser.user.id;
      console.log("Created new user with ID:", userId);

      // Update partner profile with new user_id
      const { error: updateProfileError } = await supabaseAdmin
        .from("partner_profiles")
        .update({ user_id: userId })
        .eq("id", partnerProfileId);

      if (updateProfileError) {
        console.error("Error updating partner profile with user_id:", updateProfileError);
      }

      // Send password reset email so they can set their own password
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: contactEmail,
      });

      if (resetError) {
        console.error("Error sending password reset email:", resetError);
      }
    }

    // Check if partner already exists in partners table
    const { data: existingPartner, error: partnerCheckError } = await supabaseAdmin
      .from("partners")
      .select("id")
      .eq("slug", partnerProfile.slug)
      .maybeSingle();

    if (partnerCheckError) {
      console.error("Error checking existing partner:", partnerCheckError);
    }

    // Create or update partner entry in partners table
    if (!existingPartner) {
      console.log("Creating new partner entry for:", partnerProfile.org_name);

      const { error: createPartnerError } = await supabaseAdmin
        .from("partners")
        .insert({
          name: partnerProfile.org_name,
          slug: partnerProfile.slug,
          tagline: partnerProfile.bio || "Conservation partner working to protect Kenya's wildlife and ecosystems",
          short_bio: partnerProfile.bio || "Conservation partner dedicated to wildlife protection and community engagement",
          long_bio: partnerProfile.bio || "Our organization is committed to conservation efforts that benefit both wildlife and local communities.",
          location_text: partnerProfile.location,
          contact_email: partnerProfile.contacts?.[0]?.email,
          logo_image_url: partnerProfile.logo,
          hero_image_url: partnerProfile.logo,
          website: partnerProfile.contacts?.[0]?.website || "",
          stats: {
            experiences_created: 0,
            total_bookings: 0,
            conservation_impact: "Getting started"
          }
        });

      if (createPartnerError) {
        console.error("Error creating partner:", createPartnerError);
        throw new Error(`Failed to create partner: ${createPartnerError.message}`);
      }
    } else {
      console.log("Partner already exists, updating information");
      
      const { error: updatePartnerError } = await supabaseAdmin
        .from("partners")
        .update({
          name: partnerProfile.org_name,
          tagline: partnerProfile.bio || "Conservation partner working to protect Kenya's wildlife and ecosystems",
          short_bio: partnerProfile.bio || "Conservation partner dedicated to wildlife protection and community engagement",
          location_text: partnerProfile.location,
          contact_email: partnerProfile.contacts?.[0]?.email,
          logo_image_url: partnerProfile.logo,
          hero_image_url: partnerProfile.logo,
          website: partnerProfile.contacts?.[0]?.website || "",
          updated_at: new Date().toISOString()
        })
        .eq("slug", partnerProfile.slug);

      if (updatePartnerError) {
        console.error("Error updating partner:", updatePartnerError);
      }
    }

    // Create notification for the partner
    const { error: notificationError } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: userId,
        title: "Welcome to NatuAsili!",
        message: "Your partner application has been approved! You can now start creating conservation experiences and managing your partnership with NatuAsili.",
        type: "success",
        related_id: partnerProfileId,
        related_type: "partner_application"
      });

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    console.log("Successfully created partner account for:", partnerProfile.org_name);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Partner account created successfully",
        userId: userId,
        partnerSlug: partnerProfile.slug
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in create-partner-account function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);