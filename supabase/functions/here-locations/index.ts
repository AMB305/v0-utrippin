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

    const hereApiKey = Deno.env.get("HERE_API_KEY");
    if (!hereApiKey) {
      console.error("HERE_API_KEY not found");
      return new Response(JSON.stringify({ error: "HERE API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`Searching HERE locations for: ${query}`);

    // Call HERE Geocoding and Search API
    const hereUrl = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=40.7128,-74.0060&q=${encodeURIComponent(query)}&apiKey=${hereApiKey}`;
    
    const hereRes = await fetch(hereUrl);

    if (!hereRes.ok) {
      const errorBody = await hereRes.text();
      console.error("HERE API failed:", errorBody);
      return new Response(JSON.stringify({ error: "HERE API failed", details: errorBody }), {
        status: hereRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await hereRes.json();
    
    // Transform HERE API response to match expected format
    const transformedResults = data.items?.map((item: any) => ({
      id: item.id,
      address: {
        label: item.title,
        city: item.address?.city || '',
        state: item.address?.state || '',
        country: item.address?.countryName || ''
      },
      position: item.position ? {
        lat: item.position.lat,
        lng: item.position.lng
      } : null
    })) || [];

    console.log(`Found ${transformedResults.length} location results`);

    return new Response(JSON.stringify({ results: transformedResults }), { 
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error in here-locations function:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});