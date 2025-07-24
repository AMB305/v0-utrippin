import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterSignupRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterSignupRequest = await req.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Utrippin <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Utrippin - Your AI Travel Companion!",
      html: `
        <h1>Welcome to Utrippin!</h1>
        <p>Thank you for joining our community of travel enthusiasts!</p>
        <p>You're now part of a community that believes in making travel accessible to everyone through innovative AI and expert guidance.</p>
        <p>Here's what you can expect:</p>
        <ul>
          <li>🎯 Exclusive travel deals and insider tips</li>
          <li>🤖 AI-powered personalized travel recommendations</li>
          <li>🌍 Discover hidden gems and unique destinations</li>
          <li>💡 Budget-friendly travel hacks and advice</li>
        </ul>
        <p>Get ready to embark on amazing adventures with Utrippin!</p>
        <p>Safe travels,<br>The Utrippin Team</p>
      `,
    });

    console.log("Newsletter signup email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Successfully subscribed to newsletter!",
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in newsletter-signup function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send welcome email. Please try again.",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);