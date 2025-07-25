import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATEHAWK_API_KEY = Deno.env.get("RATEHAWK_API_KEY")!;
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
    // Check API key first
    if (!RATEHAWK_API_KEY) {
      console.error("❌ RATEHAWK_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Ratehawk API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the incoming query
    const { query } = await req.json();
    console.log("🔔 ratehawk-suggest: incoming query:", query);

    // Call the sandbox suggest endpoint
    const apiUrl = `${RATEHAWK_BASE_URL}/search/suggest`;
    console.log("🔔 ratehawk-suggest: calling API URL:", apiUrl);
    console.log("🔔 Using API key (first 4 chars):", RATEHAWK_API_KEY?.slice(0,4) + "…");

    const apiRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RATEHAWK_API_KEY}`,
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