import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generateFollowUpEmailHTML = (tripData: any, agentEmail: string, shareUrl: string, followUpType: string) => {
  const isReminder = followUpType === 'reminder';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isReminder ? 'Friendly Reminder' : 'Final Notice'} - Travel Booking Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">UTrippin.ai</h1>
              <p style="color: #fde68a; margin: 10px 0 0 0; font-size: 16px;">
                ${isReminder ? 'Friendly Reminder' : 'Final Notice'}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
                ${isReminder ? 'Following up on Travel Booking Request' : 'Last chance to assist this client'}
              </h2>
              
              <p style="color: #6b7280; margin: 0 0 20px 0; line-height: 1.6;">
                ${isReminder 
                  ? `We wanted to follow up on the travel booking request for <strong>${tripData.trip_name}</strong> that was shared with you a few days ago.`
                  : `This is our final follow-up regarding the travel booking request for <strong>${tripData.trip_name}</strong>.`
                }
              </p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Trip Details</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Destination:</strong> ${tripData.destination}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Trip Name:</strong> ${tripData.trip_name}</p>
              </div>
              
              <p style="color: #6b7280; margin: 0 0 30px 0; line-height: 1.6;">
                ${isReminder 
                  ? 'If you\'re interested in assisting this client, please click the link below to review the complete itinerary and get in touch.'
                  : 'If you\'re unable to assist with this booking, no worries! We just wanted to give you one final opportunity to review this request.'
                }
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${shareUrl}&email=${encodeURIComponent(agentEmail)}&followup=${followUpType}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                  📋 View Trip Details
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
                ${isReminder 
                  ? 'We\'ll send one final reminder if we don\'t hear back.'
                  : 'This is our final follow-up for this booking request.'
                }
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Professional travel booking request via <strong style="color: #ffffff;">UTrippin.ai</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    console.log('Processing follow-up emails...');

    // Get all pending follow-ups that are due
    const { data: followUps, error: followUpsError } = await supabase
      .from('agent_follow_ups')
      .select(`
        id, 
        trip_id, 
        agent_email, 
        follow_up_type,
        saved_trips!inner(trip_name, destination, share_id)
      `)
      .is('sent_at', null)
      .lte('scheduled_for', new Date().toISOString());

    if (followUpsError) {
      console.error('Error fetching follow-ups:', followUpsError);
      throw followUpsError;
    }

    if (!followUps || followUps.length === 0) {
      console.log('No follow-ups due at this time');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No follow-ups due',
          processed: 0 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`Processing ${followUps.length} follow-up emails`);

    const results = [];
    
    for (const followUp of followUps) {
      try {
        const tripData = followUp.saved_trips;
        const shareUrl = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/trip/${tripData.share_id}?ref=agent`;
        
        // Send follow-up email
        const emailResult = await resend.emails.send({
          from: 'UTrippin.ai <noreply@resend.dev>',
          to: [followUp.agent_email],
          subject: `${followUp.follow_up_type === 'reminder' ? 'Reminder' : 'Final Notice'}: ${tripData.trip_name} - Travel Booking Request`,
          html: generateFollowUpEmailHTML(tripData, followUp.agent_email, shareUrl, followUp.follow_up_type),
        });

        // Mark as sent
        await supabase
          .from('agent_follow_ups')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', followUp.id);

        // Track the interaction
        await supabase
          .from('agent_interactions')
          .insert({
            trip_id: followUp.trip_id,
            agent_email: followUp.agent_email,
            interaction_type: 'follow_up_sent',
            interaction_data: { 
              follow_up_type: followUp.follow_up_type,
              email_id: emailResult.data?.id 
            }
          });

        results.push({
          success: true,
          agent_email: followUp.agent_email,
          follow_up_type: followUp.follow_up_type,
          trip_name: tripData.trip_name
        });

        console.log(`Follow-up sent to ${followUp.agent_email} for ${tripData.trip_name}`);

      } catch (error) {
        console.error(`Failed to send follow-up to ${followUp.agent_email}:`, error);
        results.push({
          success: false,
          agent_email: followUp.agent_email,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Follow-up processing complete`,
        processed: followUps.length,
        successful: successCount,
        failed: failureCount,
        results: results
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-follow-ups function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Follow-up processing failed',
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
