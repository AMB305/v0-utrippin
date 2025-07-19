import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

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
    let query = "";
    
    // Support both GET with query params and POST with JSON body
    if (req.method === 'GET') {
      const url = new URL(req.url);
      query = url.searchParams.get("query") || "";
    } else if (req.method === 'POST') {
      const body = await req.json();
      query = body.query || "";
    }

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query param" }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Debug: Check for special debug query
    if (query === "DEBUG_HEADERS") {
      const debugHeaders = {
        "Authorization": `Bearer ${Deno.env.get("DUFFEL_API_KEY") ? "***API_KEY_PRESENT***" : "***NO_API_KEY***"}`,
        "Duffel-Version": "2024-11-07",
        "Accept": "application/json"
      };
      console.log("DEBUG: Headers being sent to Duffel API:", debugHeaders);
      return new Response(JSON.stringify({ 
        debug: true, 
        headers: debugHeaders,
        message: "Headers verification for duffel-search-airports"
      }), { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Prepare headers for Duffel API
    const requestHeaders = {
      "Authorization": `Bearer ${Deno.env.get("DUFFEL_API_KEY")}`,
      "Duffel-Version": "2024-11-07",
      "Accept": "application/json"
    };

    // Log headers for debugging (without exposing API key)
    console.log("Calling Duffel API with headers:", {
      "Authorization": `Bearer ${Deno.env.get("DUFFEL_API_KEY") ? "***PRESENT***" : "***MISSING***"}`,
      "Duffel-Version": "2024-11-07",
      "Accept": "application/json"
    });

    // Call Duffel API with proper headers
    const duffelRes = await fetch(`https://api.duffel.com/air/airports?query=${encodeURIComponent(query)}`, {
      headers: requestHeaders
    });

    if (!duffelRes.ok) {
      const errorBody = await duffelRes.text();
      return new Response(JSON.stringify({ error: "Duffel API failed", details: errorBody }), {
        status: duffelRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await duffelRes.json();
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});