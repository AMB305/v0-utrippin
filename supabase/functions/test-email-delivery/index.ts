import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { email, subject, content } = await req.json();

    if (!email || !subject || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, subject, content' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Test email delivery - in production this would use a real email service
    console.log('Test Email Delivery:', {
      to: email,
      subject: subject,
      content: content.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });

    // Simulate email delivery delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        deliveryId: `test_${Date.now()}`,
        provider: 'test'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in test-email-delivery function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Email delivery test failed',
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