import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    const { offerId, passengerData } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get offer details from Duffel
    const duffelResponse = await fetch(`https://api.duffel.com/air/offers/${offerId}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get("DUFFEL_API_KEY")}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
      },
    });

    if (!duffelResponse.ok) {
      throw new Error('Failed to fetch offer from Duffel');
    }

    const offerData = await duffelResponse.json();
    const offer = offerData.data;

    // Add 5% markup to Duffel price
    const baseAmount = parseFloat(offer.total_amount);
    const markupAmount = Math.round(baseAmount * 0.05 * 100); // 5% markup in cents
    const totalAmount = Math.round(baseAmount * 100) + markupAmount; // Convert to cents

    // Check if customer exists
    const customers = await stripe.customers.list({ 
      email: user?.email || 'guest@example.com', 
      limit: 1 
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : (user?.email || 'guest@example.com'),
      line_items: [
        {
          price_data: {
            currency: offer.total_currency.toLowerCase(),
            product_data: {
              name: `Flight: ${offer.slices[0].origin.iata_code} → ${offer.slices[0].destination.iata_code}`,
              description: `Passenger: ${passengerData.firstName} ${passengerData.lastName}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/flight-booking-success?session_id={CHECKOUT_SESSION_ID}&offer_id=${offerId}`,
      cancel_url: `${req.headers.get("origin")}/flight-booking?offerId=${offerId}`,
      metadata: {
        offer_id: offerId,
        user_id: user?.id || 'guest',
        passenger_data: JSON.stringify(passengerData),
      },
    });

    // Store booking in Supabase
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("bookings").insert({
      user_id: user?.id,
      type: 'flight',
      stripe_payment_id: session.id,
      payment_status: 'pending',
      total_price: totalAmount / 100,
      details: {
        offer_id: offerId,
        passenger_data: passengerData,
        duffel_offer: offer,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating flight booking:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
