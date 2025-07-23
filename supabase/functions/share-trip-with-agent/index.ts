import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShareRequest {
  trip_id: string;
  agent_email: string;
  user_note?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generateAgentEmailHTML = (tripData: any, userEmail: string, shareUrl: string, userNote?: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Travel Itinerary Booking Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">UTrippin.ai</h1>
              <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Travel Booking Request</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">New Booking Request</h2>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Trip Details</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Destination:</strong> ${tripData.destination}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Trip Name:</strong> ${tripData.trip_name}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Created:</strong> ${new Date(tripData.created_at).toLocaleDateString()}</p>
              </div>
              
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Client Information</h3>
                <p style="margin: 5px 0; color: #1e40af;"><strong>Email:</strong> ${userEmail}</p>
                <p style="margin: 5px 0; color: #1e40af;"><strong>Contact:</strong> Please respond directly to this email</p>
              </div>
              
              ${userNote ? `
              <div style="background-color: #fef7e0; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Personal Message from Client</h3>
                <p style="color: #92400e; margin: 0; font-style: italic; line-height: 1.6;">"${userNote}"</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${shareUrl}" style="display: inline-block; background: linear-gradient(135deg, #ea580c, #f97316); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                  📋 View Complete Itinerary
                </a>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Next Steps</h3>
                <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Click the link above to view the complete travel itinerary</li>
                  <li>Review all trip details, preferences, and recommendations</li>
                  <li>Contact the client directly at ${userEmail} to discuss booking</li>
                  <li>Provide quotes and assistance with reservations</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                This trip was shared via <strong style="color: #ffffff;">UTrippin.ai</strong> - AI-powered travel planning
              </p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                Professional travel agent services requested by verified user
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

const generateUserConfirmationHTML = (tripData: any, agentEmail: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trip Shared Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ Trip Shared!</h1>
              <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 16px;">Confirmation from UTrippin.ai</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Your trip has been successfully shared!</h2>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #10b981;">
                <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">Sharing Details</h3>
                <p style="margin: 5px 0; color: #065f46;"><strong>Trip:</strong> ${tripData.trip_name}</p>
                <p style="margin: 5px 0; color: #065f46;"><strong>Sent to:</strong> ${agentEmail}</p>
                <p style="margin: 5px 0; color: #065f46;"><strong>Shared on:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">What happens next?</h3>
                <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Your travel agent will receive the complete itinerary via email</li>
                  <li>They can view all trip details through a secure link</li>
                  <li>The agent will contact you directly to discuss booking options</li>
                  <li>You can track the sharing status on your Trip Board</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Thank you for using <strong style="color: #ffffff;">UTrippin.ai</strong>
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
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { trip_id, agent_email, user_note }: ShareRequest = await req.json();

    if (!trip_id || !agent_email) {
      throw new Error('Missing required fields');
    }

    // Fetch trip data and verify ownership
    const { data: tripData, error: tripError } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('id', trip_id)
      .eq('user_id', user.id)
      .single();

    if (tripError || !tripData) {
      throw new Error('Trip not found or unauthorized');
    }

    // Make trip public and update sharing info
    const { error: updateError } = await supabase
      .from('saved_trips')
      .update({
        is_public: true,
        shared_with_agent_at: new Date().toISOString(),
        agent_email: agent_email,
        agent_message: user_note
      })
      .eq('id', trip_id);

    if (updateError) {
      throw new Error('Failed to update trip');
    }

    // Create share URL
    const shareUrl = `${supabaseUrl.replace('https://', 'https://').replace('.supabase.co', '.lovable.app')}/trip/${tripData.share_id}?ref=agent`;

    // Send email to agent
    const agentEmailResult = await resend.emails.send({
      from: 'UTrippin.ai <noreply@utrippin.ai>',
      to: [agent_email],
      subject: `Travel Itinerary for ${tripData.trip_name} - Booking Request`,
      html: generateAgentEmailHTML(tripData, user.email!, shareUrl, user_note),
    });

    console.log('Agent email sent:', agentEmailResult);

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: 'UTrippin.ai <noreply@utrippin.ai>',
      to: [user.email!],
      subject: `Trip Shared: ${tripData.trip_name} sent to ${agent_email}`,
      html: generateUserConfirmationHTML(tripData, agent_email),
    });

    console.log('User confirmation email sent:', userEmailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trip shared successfully',
        share_url: shareUrl 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in share-trip-with-agent function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);