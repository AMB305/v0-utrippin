import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { action, recommendationId } = await req.json();

    if (action === 'generate') {
      // Generate new recommendations using the database function
      const { data: recommendations, error: recommendationsError } = await supabaseClient
        .rpc('generate_trip_recommendations', { target_user_id: user.user.id });

      if (recommendationsError) {
        console.error('Error generating recommendations:', recommendationsError);
        return new Response(JSON.stringify({ error: 'Failed to generate recommendations' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Store the recommendations in the database
      const recommendationsToStore = recommendations.map((rec: any) => ({
        user_id: user.user.id,
        destination: rec.destination,
        title: rec.title,
        description: rec.description,
        confidence_score: rec.confidence_score,
        estimated_budget: rec.estimated_budget,
        duration_days: rec.duration_days,
        activities: rec.activities,
        based_on_preferences: {
          recommendation_reason: rec.recommendation_reason,
          generated_at: new Date().toISOString()
        }
      }));

      const { data: storedRecommendations, error: storeError } = await supabaseClient
        .from('trip_recommendations')
        .insert(recommendationsToStore)
        .select();

      if (storeError) {
        console.error('Error storing recommendations:', storeError);
      }

      // Log user activity
      await supabaseClient
        .from('user_activity_log')
        .insert({
          user_id: user.user.id,
          activity_type: 'recommendation_generated',
          activity_data: { count: recommendations.length }
        });

      return new Response(JSON.stringify({ 
        success: true, 
        recommendations: storedRecommendations || recommendations 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'mark_viewed' && recommendationId) {
      const { error } = await supabaseClient
        .from('trip_recommendations')
        .update({ is_viewed: true })
        .eq('id', recommendationId)
        .eq('user_id', user.user.id);

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to update recommendation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'save' && recommendationId) {
      const { error } = await supabaseClient
        .from('trip_recommendations')
        .update({ is_saved: true })
        .eq('id', recommendationId)
        .eq('user_id', user.user.id);

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to save recommendation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Log user activity
      await supabaseClient
        .from('user_activity_log')
        .insert({
          user_id: user.user.id,
          activity_type: 'recommendation_saved',
          activity_data: { recommendation_id: recommendationId }
        });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-trip-recommendations function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});