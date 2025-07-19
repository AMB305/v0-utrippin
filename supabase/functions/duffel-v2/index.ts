import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DUFFEL_API_KEY = Deno.env.get("DUFFEL_API_KEY");
    if (!DUFFEL_API_KEY) {
      console.error("Missing Duffel API Key");
      return new Response(
        JSON.stringify({ error: "Missing Duffel API Key" }), 
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { mode, query, offerRequest, offerId, orderChangeRequest } = body;

    console.log(`Duffel v2 request - Mode: ${mode}`, { query, offerRequest });

    if (mode === "airport_search") {
      // Debug mode for airport search
      if (query === "DEBUG_HEADERS") {
        const debugHeaders = {
          "Authorization": `Bearer ${DUFFEL_API_KEY ? "***API_KEY_PRESENT***" : "***NO_API_KEY***"}`,
          "Duffel-Version": "2023-11-01",
          "Accept": "application/json"
        };
        console.log("DEBUG: Airport search headers:", debugHeaders);
        return new Response(JSON.stringify({ 
          debug: true, 
          mode: "airport_search",
          headers: debugHeaders 
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Use Places API for search functionality (not airports API)
      const searchUrl = query 
        ? `https://api.duffel.com/places/suggestions?query=${encodeURIComponent(query)}`
        : "https://api.duffel.com/places/suggestions";

      const airportHeaders = {
        "Authorization": `Bearer ${DUFFEL_API_KEY}`,
        "Duffel-Version": "v2",
        "Accept": "application/json"
      };

      console.log("Places search with headers:", {
        "Authorization": `Bearer ${DUFFEL_API_KEY ? "***PRESENT***" : "***MISSING***"}`,
        "Duffel-Version": "v2",
        "Accept": "application/json"
      });

      const response = await fetch(searchUrl, {
        method: "GET",
        headers: airportHeaders
      });

      if (!response.ok) {
        console.error(`Duffel airports API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return new Response(
          JSON.stringify({ error: `Duffel API error: ${response.status}` }), 
          { status: response.status, headers: corsHeaders }
        );
      }

      const data = await response.json();
      console.log(`Found ${data.data?.length || 0} places`);
      
      // Transform places data to match expected airport format
      const transformedData = {
        data: data.data?.filter((place: any) => place.type === 'airport').map((place: any) => ({
          id: place.id,
          name: place.name,
          iata_code: place.iata_code,
          city_name: place.city_name,
          country_name: place.iata_country_code, // We'll use country code for now
          latitude: place.latitude,
          longitude: place.longitude
        })) || []
      };
      return new Response(
        JSON.stringify(transformedData), 
        { status: 200, headers: corsHeaders }
      );
    }

    if (mode === "search_offers") {
      // Debug mode for offer search
      if (offerRequest && offerRequest.debug === "DEBUG_HEADERS") {
        const debugHeaders = {
          "Authorization": `Bearer ${DUFFEL_API_KEY ? "***API_KEY_PRESENT***" : "***NO_API_KEY***"}`,
          "Duffel-Version": "2023-11-01",
          "Content-Type": "application/json",
          "Accept": "application/json"
        };
        console.log("DEBUG: Offer search headers:", debugHeaders);
        return new Response(JSON.stringify({ 
          debug: true, 
          mode: "search_offers",
          headers: debugHeaders 
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const offerHeaders = {
        "Authorization": `Bearer ${DUFFEL_API_KEY}`,
        "Duffel-Version": "2023-11-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      };

      // Log headers for debugging
      console.log("Offer search with headers:", {
        "Authorization": `Bearer ${DUFFEL_API_KEY ? "***PRESENT***" : "***MISSING***"}`,
        "Duffel-Version": "2023-11-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      });

      // Create offer request for flight search
      const response = await fetch("https://api.duffel.com/air/offer_requests", {
        method: "POST",
        headers: offerHeaders,
        body: JSON.stringify(offerRequest)
      });

      if (!response.ok) {
        console.error(`Duffel offers API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return new Response(
          JSON.stringify({ error: `Duffel API error: ${response.status}` }), 
          { status: response.status, headers: corsHeaders }
        );
      }

      const data = await response.json();
      console.log(`Found ${data.data?.offers?.length || 0} offers`);
      
      return new Response(
        JSON.stringify(data), 
        { status: 200, headers: corsHeaders }
      );
    }

    if (mode === "seat_maps") {
      if (!offerId) {
        return new Response(
          JSON.stringify({ error: "Offer ID required for seat maps" }), 
          { status: 400, headers: corsHeaders }
        );
      }

      const seatMapHeaders = {
        "Authorization": `Bearer ${DUFFEL_API_KEY}`,
        "Duffel-Version": "2023-11-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      };

      console.log(`Fetching seat maps for offer: ${offerId}`);

      const response = await fetch("https://api.duffel.com/air/seat_maps", {
        method: "POST",
        headers: seatMapHeaders,
        body: JSON.stringify({ offer_id: offerId })
      });

      if (!response.ok) {
        console.error(`Duffel seat maps API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return new Response(
          JSON.stringify({ error: `Duffel API error: ${response.status}` }), 
          { status: response.status, headers: corsHeaders }
        );
      }

      const data = await response.json();
      console.log(`Found seat maps for offer ${offerId}`);
      
      return new Response(
        JSON.stringify(data), 
        { status: 200, headers: corsHeaders }
      );
    }

    if (mode === "order_changes") {
      if (!orderChangeRequest) {
        return new Response(
          JSON.stringify({ error: "Order change request required" }), 
          { status: 400, headers: corsHeaders }
        );
      }

      const orderChangeHeaders = {
        "Authorization": `Bearer ${DUFFEL_API_KEY}`,
        "Duffel-Version": "2023-11-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      };

      console.log("Creating order change request:", orderChangeRequest);

      const response = await fetch("https://api.duffel.com/air/order_changes", {
        method: "POST",
        headers: orderChangeHeaders,
        body: JSON.stringify(orderChangeRequest)
      });

      if (!response.ok) {
        console.error(`Duffel order changes API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return new Response(
          JSON.stringify({ error: `Duffel API error: ${response.status}` }), 
          { status: response.status, headers: corsHeaders }
        );
      }

      const data = await response.json();
      console.log("Order change response received");
      
      return new Response(
        JSON.stringify(data), 
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid mode. Use 'airport_search', 'search_offers', 'seat_maps', or 'order_changes'" }), 
      { status: 400, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Duffel v2 function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500, headers: corsHeaders }
    );
  }
})