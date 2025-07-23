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
    
    console.log('Fetching monthly usage summary...')
    
    // Get monthly usage summary
    const { data: usageData, error: usageError } = await supabase.rpc('get_monthly_usage_summary')
    
    if (usageError) {
      console.error('Error getting usage summary:', usageError)
      throw usageError
    }
    
    // Get recent API calls (last 100)
    const { data: recentCalls, error: recentError } = await supabase
      .from('api_usage_tracking')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (recentError) {
      console.error('Error getting recent calls:', recentError)
    }
    
    // Calculate totals
    const totalCost = usageData?.reduce((sum: number, item: any) => sum + parseFloat(item.total_cost || 0), 0) || 0
    const highUsageCount = usageData?.filter((item: any) => item.usage_percentage >= 80).length || 0
    const criticalUsageCount = usageData?.filter((item: any) => item.usage_percentage >= 90).length || 0
    
    // Get alerts configuration
    const { data: alertsData, error: alertsError } = await supabase
      .from('usage_alerts')
      .select('*')
      .eq('is_active', true)
      .order('provider', { ascending: true })
    
    if (alertsError) {
      console.error('Error getting alerts:', alertsError)
    }
    
    const summary = {
      usage_data: usageData || [],
      recent_calls: recentCalls || [],
      alerts_config: alertsData || [],
      totals: {
        total_cost: totalCost,
        active_apis: usageData?.length || 0,
        high_usage_count: highUsageCount,
        critical_usage_count: criticalUsageCount
      },
      last_updated: new Date().toISOString()
    }
    
    console.log(`Usage summary generated: ${usageData?.length || 0} APIs monitored, $${totalCost.toFixed(2)} total cost`)
    
    return new Response(
      JSON.stringify(summary),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get-usage-summary:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})