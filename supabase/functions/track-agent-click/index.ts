import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shareId = url.searchParams.get('share_id');
    const agentEmail = url.searchParams.get('email');
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'Unknown';

    if (!shareId || !agentEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing share_id or email parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Find the trip by share_id
    const { data: tripData, error: tripError } = await supabase
      .from('saved_trips')
      .select('id, trip_name, destination')
      .eq('share_id', shareId)
      .eq('is_public', true)
      .single();

    if (tripError || !tripData) {
      return new Response(
        JSON.stringify({ error: 'Trip not found or not public' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Track the link click interaction
    const { error: trackingError } = await supabase
      .from('agent_interactions')
      .insert({
        trip_id: tripData.id,
        agent_email: decodeURIComponent(agentEmail),
        interaction_type: 'link_clicked',
        interaction_data: {
          clicked_at: new Date().toISOString(),
          user_agent: userAgent,
          referrer: req.headers.get('referer') || null
        },
        user_agent: userAgent,
        ip_address: ipAddress
      });

    if (trackingError) {
      console.error('Failed to track interaction:', trackingError);
      // Don't fail the request if tracking fails
    }

    console.log(`Agent link clicked: ${agentEmail} for trip ${tripData.trip_name}`);

    // Redirect to the actual trip page
    const redirectUrl = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/trip/${shareId}?ref=agent`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        ...corsHeaders
      }
    });

  } catch (error: any) {
    console.error('Error in track-agent-click function:', error);
    
    // Redirect to trip page even if tracking fails
    const shareId = new URL(req.url).searchParams.get('share_id');
    if (shareId) {
      const fallbackUrl = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/trip/${shareId}?ref=agent`;
      return new Response(null, {
        status: 302,
        headers: {
          'Location': fallbackUrl,
          ...corsHeaders
        }
      });
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Tracking failed',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
