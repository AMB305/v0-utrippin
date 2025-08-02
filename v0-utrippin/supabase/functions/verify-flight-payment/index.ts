import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, offerId } = await req.json();

    // Create Duffel order after successful payment
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get booking details
    const { data: booking } = await supabaseService
      .from("bookings")
      .select("*")
      .eq("stripe_payment_id", sessionId)
      .single();

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create Duffel order
    const duffelOrderData = {
      selected_offers: [offerId],
      passengers: [{
        id: "passenger_1",
        given_name: booking.details.passenger_data.firstName,
        family_name: booking.details.passenger_data.lastName,
        born_on: booking.details.passenger_data.dateOfBirth,
        email: booking.details.passenger_data.email,
        phone_number: booking.details.passenger_data.phone,
        type: "adult"
      }],
      payments: [{
        type: "balance",
        amount: booking.details.duffel_offer.total_amount,
        currency: booking.details.duffel_offer.total_currency
      }]
    };

    const duffelResponse = await fetch('https://api.duffel.com/air/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get("DUFFEL_API_KEY")}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
      },
      body: JSON.stringify({ data: duffelOrderData }),
    });

    if (!duffelResponse.ok) {
      throw new Error('Failed to create Duffel order');
    }

    const orderResult = await duffelResponse.json();

    // Update booking with order details
    await supabaseService
      .from("bookings")
      .update({
        payment_status: 'paid',
        details: {
          ...booking.details,
          duffel_order: orderResult.data,
          booking_reference: orderResult.data.booking_reference,
        }
      })
      .eq("id", booking.id);

    return new Response(JSON.stringify({ 
      success: true, 
      booking_reference: orderResult.data.booking_reference,
      order: orderResult.data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error verifying flight payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
