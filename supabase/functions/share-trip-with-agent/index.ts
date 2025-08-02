import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShareRequest {
  trip_id: string;
  agent_emails: string[];
  user_note?: string;
  template_type?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generateAgentEmailHTML = (tripData: any, userEmail: string, shareUrl: string, userNote?: string, templateType: string = 'standard') => {
  const templateConfig = {
    standard: {
      gradient: 'linear-gradient(135deg, #ea580c, #f97316)',
      title: 'UTrippin.ai',
      subtitle: 'Travel Booking Request'
    },
    luxury: {
      gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
      title: 'UTrippin.ai Luxury',
      subtitle: 'Premium Travel Concierge Request'
    },
    budget: {
      gradient: 'linear-gradient(135deg, #166534, #22c55e)',
      title: 'UTrippin.ai Budget',
      subtitle: 'Smart Travel Booking Request'
    },
    corporate: {
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      title: 'UTrippin.ai Corporate',
      subtitle: 'Business Travel Request'
    }
  };

  const config = templateConfig[templateType as keyof typeof templateConfig] || templateConfig.standard;
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
            <td style="background: ${config.gradient}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">${config.title}</h1>
              <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">${config.subtitle}</p>
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
                <a href="${shareUrl}&email=${encodeURIComponent(userEmail)}" style="display: inline-block; background: ${config.gradient}; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px;">
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

const generateUserConfirmationHTML = (tripData: any, agentEmails: string[]) => {
  const agentList = agentEmails.length > 3 
    ? `${agentEmails.slice(0, 3).join(', ')} and ${agentEmails.length - 3} others`
    : agentEmails.join(', ');
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
                <p style="margin: 5px 0; color: #065f46;"><strong>Sent to:</strong> ${agentList}</p>
                <p style="margin: 5px 0; color: #065f46;"><strong>Total agents:</strong> ${agentEmails.length}</p>
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

    const { trip_id, agent_emails, user_note, template_type = 'standard' }: ShareRequest = await req.json();

    if (!trip_id || !agent_emails || !Array.isArray(agent_emails) || agent_emails.length === 0) {
      throw new Error('Missing required fields: trip_id, agent_emails array');
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
        agent_emails: agent_emails,
        agent_message: user_note,
        agent_template_type: template_type
      })
      .eq('id', trip_id);

    if (updateError) {
      throw new Error('Failed to update trip');
    }

    // Create share URL - ensure proper domain mapping
    const baseUrl = supabaseUrl.includes('supabase.co') 
      ? supabaseUrl.replace('.supabase.co', '.lovable.app')
      : window?.location?.origin || supabaseUrl;
    
    const shareUrl = `${baseUrl}/trip/${tripData.share_id}?ref=agent`;

    console.log('Sending emails with share URL:', shareUrl);

    // Send emails to all agents and track interactions
    const emailResults = [];
    for (const agentEmail of agent_emails) {
      try {
        // Track email sending
        await supabase
          .from('agent_interactions')
          .insert({
            trip_id: trip_id,
            agent_email: agentEmail,
            interaction_type: 'email_sent',
            interaction_data: { 
              template_type, 
              user_note: user_note || null,
              share_url: shareUrl 
            }
          });

        // Send email to agent
        const agentEmailResult = await resend.emails.send({
          from: 'UTrippin.ai <noreply@resend.dev>',
          to: [agentEmail],
          subject: `Travel Itinerary for ${tripData.trip_name} - Booking Request`,
          html: generateAgentEmailHTML(tripData, user.email!, shareUrl, user_note, template_type),
        });

        emailResults.push({ email: agentEmail, result: agentEmailResult });
        console.log(`Agent email sent to ${agentEmail}:`, agentEmailResult);

      } catch (error) {
        console.error(`Failed to send email to ${agentEmail}:`, error);
        emailResults.push({ email: agentEmail, error: error });
      }
    }

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: 'UTrippin.ai <noreply@resend.dev>',
      to: [user.email!],
      subject: `Trip Shared: ${tripData.trip_name} sent to ${agent_emails.length} agent${agent_emails.length > 1 ? 's' : ''}`,
      html: generateUserConfirmationHTML(tripData, agent_emails),
    });

    console.log('User confirmation email sent:', userEmailResult);

    // Check for any email failures
    const failedEmails = emailResults.filter(result => result.error);
    const successfulEmails = emailResults.filter(result => !result.error);

    if (failedEmails.length > 0) {
      console.warn(`${failedEmails.length} emails failed to send:`, failedEmails);
    }

    // Schedule follow-up emails for 3 days later
    for (const agentEmail of agent_emails) {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 3);
      
      await supabase
        .from('agent_follow_ups')
        .insert({
          trip_id: trip_id,
          agent_email: agentEmail,
          follow_up_type: 'reminder',
          scheduled_for: followUpDate.toISOString()
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trip shared successfully',
        share_url: shareUrl,
        agents_contacted: agent_emails.length,
        successful_emails: successfulEmails.length,
        failed_emails: failedEmails.length,
        email_results: emailResults.map(r => ({ 
          email: r.email, 
          success: !r.error,
          id: r.result?.data?.id 
        }))
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in share-trip-with-agent function:', error);
    
    // Provide specific error messages for common issues
    let errorMessage = 'Internal server error';
    if (error.message?.includes('Unauthorized')) {
      errorMessage = 'Authentication failed';
    } else if (error.message?.includes('Trip not found')) {
      errorMessage = 'Trip not found or access denied';
    } else if (error.message?.includes('email')) {
      errorMessage = 'Email delivery failed';
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
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
