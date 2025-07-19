import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterSubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { email }: NewsletterSubscribeRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send welcome email to the subscriber
    const emailResponse = await resend.emails.send({
      from: "UTrippin <onboarding@resend.dev>",
      to: [email],
      subject: "✈️ Welcome to Utrippin! Your passport to endless adventures 🌍",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Utrippin Newsletter</title>
          <style>
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .logo-letter {
              display: inline-block;
              width: 28px;
              height: 28px;
              color: white;
              font-weight: bold;
              text-align: center;
              line-height: 28px;
              font-size: 14px;
              margin: 0 1px;
              animation: fadeIn 0.6s ease-out forwards;
            }
            .logo-container {
              text-align: center;
              margin: 20px 0;
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          
          <!-- Logo Section -->
          <div class="logo-container">
            <span class="logo-letter" style="background-color: #0070f3; animation-delay: 0ms;">U</span>
            <span class="logo-letter" style="background-color: #0066e0; animation-delay: 100ms;">T</span>
            <span class="logo-letter" style="background-color: #005ccc; animation-delay: 200ms;">R</span>
            <span class="logo-letter" style="background-color: #0052b8; animation-delay: 300ms;">I</span>
            <span class="logo-letter" style="background-color: #0048a4; animation-delay: 400ms;">P</span>
            <span class="logo-letter" style="background-color: #003e90; animation-delay: 500ms;">P</span>
            <span class="logo-letter" style="background-color: #00347c; animation-delay: 600ms;">I</span>
            <span class="logo-letter" style="background-color: #002a68; animation-delay: 700ms;">N</span>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <h2 style="font-size: 26px; font-weight: bold; color: #1E3A8A; margin-top: 0;">Welcome to Utrippin!</h2>
            
            <p style="font-size: 16px; color: #374151;">
              Hey traveler 👋,
            </p>
            
            <p style="font-size: 16px; color: #374151;">
              We're thrilled you joined the Utrippin family — your ultimate hub for discovering amazing places, finding the best deals, and making memories that last a lifetime.
            </p>

            <p style="font-size: 16px; color: #374151;">
              <strong>Want to see something awesome?</strong> Try our brand new 
              <a href="https://utrippin.ai/ai-travel" style="color: #3B82F6; text-decoration: underline;">
                Staycation & Vacation tool
              </a>. Set your budget, group size, even your zip code, and our smart AI instantly finds trips perfect for you — from cozy local stays to epic adventures worldwide.
            </p>

            <h3 style="font-size: 20px; color: #1E3A8A; margin-top: 30px;">Here's what else you can explore:</h3>
            
            <ul style="font-size: 16px; color: #374151; padding-left: 20px;">
              <li style="margin: 10px 0;">✈️ <strong>Flights</strong> – <a href="https://www.expedia.com/Flights?CAMREF=1110l15dQSW" style="color: #3B82F6; text-decoration: none;">book now</a></li>
              <li style="margin: 10px 0;">🏨 <strong>Hotels</strong> – <a href="https://www.expedia.com/Hotels?CAMREF=1110l15dQSW" style="color: #3B82F6; text-decoration: none;">find your stay</a></li>
              <li style="margin: 10px 0;">🚗 <strong>Rental Cars</strong> – <a href="https://www.expedia.com/Cars?CAMREF=1110l15dQSW" style="color: #3B82F6; text-decoration: none;">grab a deal</a></li>
              <li style="margin: 10px 0;">🎟️ <strong>Event Tickets</strong> – <a href="https://utrippin.ai/experience" style="color: #3B82F6; text-decoration: none;">explore events</a></li>
              <li style="margin: 10px 0;">🐭 <strong>Disney Tickets</strong> – <a href="https://utrippin.ai/experience" style="color: #3B82F6; text-decoration: none;">start the magic</a></li>
              <li style="margin: 10px 0;">🤝 <strong>Travel Buddies</strong> – <a href="https://utrippin.ai/travel-buddies" style="color: #3B82F6; text-decoration: none;">find companions</a></li>
            </ul>

            <p style="font-size: 16px; color: #374151; margin-top: 30px;">
              Keep an eye on your inbox — we'll be sending you handpicked travel inspiration, exclusive offers, and smart tips to help you travel better (and cheaper!).
            </p>

            <p style="font-size: 16px; color: #374151;">
              Ready to start your next adventure? Click below and let's get Utrippin!
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://utrippin.ai" style="background: #3B82F6; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block; font-weight: bold;">
                Explore Now 🌍
              </a>
            </div>

            <p style="font-size: 14px; color: #6B7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Happy travels,<br/>
              The Utrippin Team
            </p>
            
            <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 30px;">
              You received this email because you subscribed to Utrippin newsletter.<br>
              If you no longer wish to receive these emails, you can unsubscribe at any time.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    console.log("Newsletter subscription email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process newsletter subscription",
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