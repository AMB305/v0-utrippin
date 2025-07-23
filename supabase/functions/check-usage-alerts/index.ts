import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const resendApiKey = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = resendApiKey ? new Resend(resendApiKey) : null
    
    console.log('Checking for usage alerts...')
    
    // Get current usage summary
    const { data: usageData, error: usageError } = await supabase.rpc('get_monthly_usage_summary')
    
    if (usageError) {
      console.error('Error getting usage summary:', usageError)
      throw usageError
    }
    
    // Get active alerts
    const { data: alertsData, error: alertsError } = await supabase
      .from('usage_alerts')
      .select('*')
      .eq('is_active', true)
    
    if (alertsError) {
      console.error('Error getting alerts config:', alertsError)
      throw alertsError
    }
    
    const alertsToSend = []
    const now = new Date()
    
    // Check each usage metric against alerts
    for (const usage of usageData || []) {
      const alert = alertsData?.find(
        (a: any) => a.provider === usage.provider && a.endpoint === usage.endpoint
      )
      
      if (!alert) continue
      
      // Check if usage exceeds threshold
      if (usage.usage_percentage >= alert.threshold_percentage) {
        // Check if we haven't sent an alert in the last 24 hours
        const lastAlertSent = alert.last_alert_sent ? new Date(alert.last_alert_sent) : null
        const hoursSinceLastAlert = lastAlertSent ? 
          (now.getTime() - lastAlertSent.getTime()) / (1000 * 60 * 60) : Infinity
        
        if (hoursSinceLastAlert >= 24) {
          alertsToSend.push({
            alert,
            usage,
            severity: usage.usage_percentage >= 90 ? 'CRITICAL' : 'WARNING'
          })
        }
      }
    }
    
    console.log(`Found ${alertsToSend.length} alerts to send`)
    
    // Send email alerts if Resend is configured
    if (resend && alertsToSend.length > 0) {
      for (const { alert, usage, severity } of alertsToSend) {
        try {
          const subject = `API USAGE ${severity}: ${usage.provider} ${usage.endpoint} at ${usage.usage_percentage.toFixed(1)}%`
          
          const emailContent = `
            <h2>🚨 API Usage Alert</h2>
            <p><strong>Severity:</strong> ${severity}</p>
            <p><strong>Provider:</strong> ${usage.provider}</p>
            <p><strong>Endpoint:</strong> ${usage.endpoint}</p>
            <p><strong>Current Usage:</strong> ${usage.current_usage.toLocaleString()} / ${usage.monthly_limit.toLocaleString()} (${usage.usage_percentage.toFixed(1)}%)</p>
            <p><strong>Remaining Calls:</strong> ${usage.remaining_calls.toLocaleString()}</p>
            ${usage.total_cost > 0 ? `<p><strong>Cost This Month:</strong> $${usage.total_cost.toFixed(2)}</p>` : ''}
            <p><strong>Threshold:</strong> ${alert.threshold_percentage}%</p>
            
            <h3>Recommended Actions:</h3>
            <ul>
              <li>Monitor usage closely to avoid hitting limits</li>
              <li>Consider implementing caching to reduce API calls</li>
              <li>Review API usage patterns in the admin dashboard</li>
              ${usage.usage_percentage >= 95 ? '<li><strong>URGENT:</strong> Usage is critically high - take immediate action</li>' : ''}
            </ul>
            
            <p>Check the <a href="https://utrippin.com/admin/dashboard">Admin Dashboard</a> for real-time monitoring.</p>
            
            <hr>
            <small>This alert was sent because usage exceeded ${alert.threshold_percentage}% threshold. You will not receive another alert for this API for 24 hours.</small>
          `
          
          const emailResponse = await resend.emails.send({
            from: 'Utrippin API Monitor <admin@utrippin.com>',
            to: [alert.alert_email],
            subject: subject,
            html: emailContent
          })
          
          if (emailResponse.error) {
            console.error('Error sending email:', emailResponse.error)
          } else {
            console.log(`Alert email sent for ${usage.provider}/${usage.endpoint}`)
            
            // Update last alert sent time
            await supabase
              .from('usage_alerts')
              .update({ last_alert_sent: now.toISOString() })
              .eq('id', alert.id)
          }
          
        } catch (emailError) {
          console.error('Error sending alert email:', emailError)
        }
      }
    }
    
    // Prepare response
    const response = {
      success: true,
      alerts_checked: alertsData?.length || 0,
      alerts_sent: alertsToSend.length,
      high_usage_apis: usageData?.filter((u: any) => u.usage_percentage >= 80) || [],
      email_configured: !!resend,
      timestamp: now.toISOString()
    }
    
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in check-usage-alerts:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})