import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { provider, endpoint, usage_count = 1, metadata = {} } = await req.json()
    
    console.log(`Tracking API usage: ${provider}/${endpoint} - ${usage_count} calls`)
    
    // Validate required fields
    if (!provider || !endpoint) {
      throw new Error('Provider and endpoint are required')
    }
    
    // Call the database function to track usage
    const { error: trackError } = await supabase.rpc('track_api_call', {
      p_provider: provider,
      p_endpoint: endpoint,
      p_usage_count: usage_count,
      p_metadata: metadata
    })
    
    if (trackError) {
      console.error('Error tracking API usage:', trackError)
      throw trackError
    }
    
    // Get current usage summary for this provider/endpoint
    const { data: usageData, error: usageError } = await supabase.rpc('get_monthly_usage_summary')
    
    if (usageError) {
      console.error('Error getting usage summary:', usageError)
    }
    
    // Find the current usage for this specific provider/endpoint
    const currentUsage = usageData?.find(
      (item: any) => item.provider === provider && item.endpoint === endpoint
    )
    
    // Check if we need to send alerts (80% threshold)
    if (currentUsage && currentUsage.usage_percentage >= 80) {
      console.log(`High usage detected for ${provider}/${endpoint}: ${currentUsage.usage_percentage}%`)
      
      // Check if we need to send an alert
      const { data: alertData } = await supabase
        .from('usage_alerts')
        .select('*')
        .eq('provider', provider)
        .eq('endpoint', endpoint)
        .eq('is_active', true)
        .single()
      
      if (alertData) {
        const shouldSendAlert = !alertData.last_alert_sent || 
          (new Date().getTime() - new Date(alertData.last_alert_sent).getTime()) > 24 * 60 * 60 * 1000 // 24 hours
        
        if (shouldSendAlert && currentUsage.usage_percentage >= alertData.threshold_percentage) {
          // Trigger alert email (we'll implement this in check-usage-alerts function)
          console.log(`Alert needed for ${provider}/${endpoint}`)
          
          // Update last alert sent time
          await supabase
            .from('usage_alerts')
            .update({ last_alert_sent: new Date().toISOString() })
            .eq('id', alertData.id)
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        current_usage: currentUsage || null,
        message: `Tracked ${usage_count} API call(s) for ${provider}/${endpoint}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in track-api-usage:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})