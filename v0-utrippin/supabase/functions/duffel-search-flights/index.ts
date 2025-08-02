import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Flight search function called");
    
    const apiKey = Deno.env.get("DUFFEL_API_KEY");
    if (!apiKey) {
      console.error("❌ Missing DUFFEL_API_KEY");
      return new Response(JSON.stringify({ error: "Server misconfigured: missing API key" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const body = await req.json();
    console.log("📋 Received payload:", JSON.stringify(body, null, 2));

    // Build slices array
    const slices = [
      {
        origin: body.origin,
        destination: body.destination,
        departure_date: body.departure_date,
      }
    ];

    // Add return slice if return_date provided
    if (body.return_date) {
      slices.push({
        origin: body.destination,
        destination: body.origin,
        departure_date: body.return_date,
      });
    }

    // Build passengers array
    const passengers = Array.from(
      { length: body.passengers?.adults || 1 },
      () => ({ type: "adult" })
    );

    // Build Duffel payload
    const duffelPayload = {
      slices,
      passengers,
      cabin_class: body.cabin_class || "economy"
    };

    console.log("📡 Calling Duffel API with payload:", JSON.stringify(duffelPayload, null, 2));

    // Prepare headers for offer request
    const offerRequestHeaders = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Duffel-Version": "v2"
    };

    // Log headers for debugging
    console.log("Creating offer request with headers:", {
      Authorization: `Bearer ${apiKey ? "***PRESENT***" : "***MISSING***"}`,
      "Content-Type": "application/json",
      "Duffel-Version": "v2"
    });

    const duffelResponse = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: offerRequestHeaders,
      body: JSON.stringify({ data: duffelPayload })
    });

    if (!duffelResponse.ok) {
      const errorDetails = await duffelResponse.text();
      console.error("Duffel API error:", errorDetails);
      return new Response(JSON.stringify({
        error: "Duffel API failed",
        status: duffelResponse.status,
        details: errorDetails
      }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const offerRequestData = await duffelResponse.json();
    console.log("✅ Offer request created:", offerRequestData.data.id);

    // Prepare headers for offers request
    const offersHeaders = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Duffel-Version": "v2"
    };

    // Log headers for debugging
    console.log("Fetching offers with headers:", {
      Authorization: `Bearer ${apiKey ? "***PRESENT***" : "***MISSING***"}`,
      "Content-Type": "application/json",
      "Duffel-Version": "v2"
    });

    // Get the offers from the offer request
    const offersResponse = await fetch(`https://api.duffel.com/air/offers?offer_request_id=${offerRequestData.data.id}`, {
      headers: offersHeaders,
    });

    if (!offersResponse.ok) {
      const errorDetails = await offersResponse.text();
      console.error("Duffel offers API error:", errorDetails);
      return new Response(JSON.stringify({
        error: "Failed to fetch offers",
        status: offersResponse.status,
        details: errorDetails
      }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const offersData = await offersResponse.json();
    console.log(`✅ Retrieved ${offersData.data.length} flight offers`);

    return new Response(JSON.stringify({ data: offersData.data }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: "Unexpected error",
      details: error.message
    }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
