import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATEHAWK_API_KEY = Deno.env.get("RATEHAWK_API_KEY")!;
const RATEHAWK_KEY_ID = Deno.env.get("RATEHAWK_KEY_ID")!;
const RATEHAWK_BASE_URL = "https://api-sandbox.emergingtravel.com/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 0) Quick connectivity probe
  try {
    const ping = await fetch("https://postman-echo.com/get");
    console.log("🔔 Connectivity Test OK:", ping.status);
  } catch (err) {
    console.error("❌ Connectivity Test FAILED:", err);
  }

  try {
    // Check API credentials
    if (!RATEHAWK_API_KEY || !RATEHAWK_KEY_ID) {
      console.error("❌ RATEHAWK credentials missing:", { 
        key_id: !!RATEHAWK_KEY_ID, 
        api_key: !!RATEHAWK_API_KEY 
      });
      return new Response(
        JSON.stringify({ error: "Ratehawk API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the incoming query
    const { query } = await req.json();
    console.log("🔔 ratehawk-suggest: incoming query:", query);

    // Create Basic Auth header (Key ID:API Key base64 encoded)
    const credentials = `${RATEHAWK_KEY_ID}:${RATEHAWK_API_KEY}`;
    const base64Credentials = btoa(credentials);
    
    console.log("🔔 ratehawk-suggest: using Key ID:", RATEHAWK_KEY_ID?.slice(0,4) + "…");
    console.log("🔔 ratehawk-suggest: using API key:", RATEHAWK_API_KEY?.slice(0,4) + "…");

    // Call the sandbox suggest endpoint
    const apiUrl = `${RATEHAWK_BASE_URL}/search/suggest`;
    console.log("🔔 ratehawk-suggest: calling API URL:", apiUrl);

    const apiRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error("❌ ratehawk-suggest non-200:", apiRes.status, text);
      return new Response(text, {
        status: apiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await apiRes.json();
    console.log("✅ ratehawk-suggest SUCCESS:", JSON.stringify(data));
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ ratehawk-suggest NETWORK ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
