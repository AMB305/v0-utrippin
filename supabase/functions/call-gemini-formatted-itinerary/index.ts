import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set in Supabase environment");
}
if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in Supabase environment");
}
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in Supabase environment");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const { city, date } = await req.json();
    const cacheKey = `${city}_${date}`;

    console.log(`Generating travel guide for ${city} on ${date}`);

    // 🔍 Step 1: Try to get cached guide
    const { data: cache, error: cacheError } = await supabase
      .from("travel_guides")
      .select("markdown")
      .eq("id", cacheKey)
      .maybeSingle();

    if (cache?.markdown) {
      console.log(`Found cached guide for ${cacheKey}`);
      return new Response(JSON.stringify({ markdown: cache.markdown }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`No cache found for ${cacheKey}, generating new guide`);

    // 🧠 Step 2: Few-shot prompt
    const fewShotPrompt = `
Your job is to generate a well-formatted multi-section travel guide in Markdown.
Structure it using **bold headers**, emoji icons, and GitHub Flavored Markdown tables.

--- Example Itinerary Format ---

## ✨ Day 1: Gaudí and Gothic Architecture

### 🌅 Morning
- Arrive at **Barcelona-El Prat Airport (BCN)** at 6:30 AM.
- 🚖 Take a taxi to your hotel (~$25, 20 mins).
- ☕️ Breakfast: Try **churros con chocolate** (€3.10–4.20) at a local café.

### 🏛️ Afternoon
- Visit **Barcelona Cathedral** (30–45 mins).
- 🛍 Explore Gothic Quarter & shop for souvenirs.
- 🍽 Lunch at La Boqueria Market: Try **patatas bravas** (€3–4.20).

### 🎭 Evening
- Stroll down **La Rambla** and enjoy live street performances.
- 🍲 Dinner: Try **paella or fideuà** (seafood noodles) (€2.50–3.25).

### 🧾 Estimated Costs (Day 1)

| Category    | Cost          |
|------------|---------------|
| Transport   | ~$25          |
| Food        | ~$40/person   |
| Activities  | Free (walking) |

### 🌍 Cultural Tips (Barcelona)
- 💸 **Tipping** isn't required, but rounding up is appreciated.
- 🍽 **Dining** starts late (after 8 PM).
- 🏖 **Beachwear** is fine at the beach, not elsewhere.
- 🗣 **Languages:** Catalan & Spanish are both common.

--- Your Task: Generate the same style for ${city} on ${date}. Use the exact format above. DO NOT use any casual tone or extra commentary. ---
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fewShotPrompt }] }],
      generationConfig: { temperature: 0.0 },
    });

    const markdown = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!markdown) {
      console.error("No response from Gemini");
      return new Response(JSON.stringify({ error: "No response from Gemini" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generated guide for ${cacheKey}, saving to cache`);

    // 💾 Step 3: Save to Supabase
    const { error: upsertError } = await supabase
      .from("travel_guides")
      .upsert([{ id: cacheKey, markdown }]);

    if (upsertError) {
      console.error("Error saving to cache:", upsertError);
    }

    return new Response(JSON.stringify({ markdown }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in call-gemini-formatted-itinerary:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});