import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  isSignup?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email, confirmationUrl, isSignup = true }: VerificationEmailRequest = await req.json();

    console.log("Sending verification email to:", email);

    const emailResponse = await resend.emails.send({
      from: "UTrippin <onboarding@resend.dev>",
      to: [email],
      subject: isSignup ? "Welcome to UTrippin - Verify your email" : "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="display: inline-flex; align-items: center; gap: 8px;">
                <div style="display: flex; gap: 2px;">
                  <span style="display: inline-block; width: 20px; height: 20px; background: #0070f3; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">U</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #0066e0; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">T</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #005ccc; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">R</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #0052b8; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">I</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #0048a4; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">P</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #003e90; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">P</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #00347c; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">I</span>
                  <span style="display: inline-block; width: 20px; height: 20px; background: #002a68; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 20px;">N</span>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #1f2937; text-align: center;">
                ${isSignup ? 'Welcome to UTrippin!' : 'Verify Your Email'}
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #6b7280; text-align: center;">
                ${isSignup 
                  ? 'Thanks for joining our travel community! To get started, please verify your email address by clicking the button below.'
                  : 'Please verify your email address to continue.'
                }
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #0070f3, #0052b8); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(0, 112, 243, 0.4);">
                  Verify Email Address
                </a>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #9ca3af; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmationUrl}" style="color: #0070f3; word-break: break-all;">${confirmationUrl}</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                This email was sent by UTrippin. If you didn't request this, you can safely ignore it.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send verification email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);