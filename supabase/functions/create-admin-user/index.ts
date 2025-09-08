import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating admin user...');

    // Create the admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'natuasili@gmail.com',
      password: 'TempPassword123!', // Temporary password
      email_confirm: true, // Skip email verification
      user_metadata: {
        first_name: 'NatuAsili',
        last_name: 'Admin',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: authError.message }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created:', authData.user?.id);

    // Create profile entry
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'natuasili@gmail.com',
        role: 'admin',
        first_name: 'NatuAsili',
        last_name: 'Admin'
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Continue anyway as the trigger should handle this
    }

    // Add admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Role error:', roleError);
      // Continue anyway as the trigger should handle this
    }

    // Create partner profile for the admin (so they can manage experiences)
    const { error: partnerError } = await supabaseAdmin
      .from('partner_profiles')
      .insert({
        user_id: authData.user.id,
        org_name: 'NatuAsili Admin',
        slug: 'natuasili-admin',
        kyc_status: 'approved',
        bio: 'Official NatuAsili administration account for managing curated conservation experiences.'
      });

    if (partnerError) {
      console.error('Partner profile error:', partnerError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        userId: authData.user.id,
        tempPassword: 'TempPassword123!',
        note: 'User can reset password through forgot password flow'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});