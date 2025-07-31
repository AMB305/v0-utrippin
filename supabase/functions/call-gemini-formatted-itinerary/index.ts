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

    // 🧠 Step 2: Enhanced Few-shot prompt with comprehensive structured template
    const wrappedPrompt = `
Your task is to generate a structured Markdown-formatted trip itinerary using this exact format:

--- EXAMPLE FORMAT BELOW ---

## ✈️ ${city} Trip — ${date} ($500 Budget)

### 🛫 Flights
- Book ASAP on budget airlines
- Fly into **[Airport Code] ([Airport Name])**

### 🏨 Hotel Suggestions
- All-inclusive: **[Hotel Name 1]** or **[Hotel Name 2]**
- Budget: **[Budget Option]**

### 🏖️ Day-by-Day Activities

#### ${date}
- ✅ [Check-in activity]
- 🍽️ [Dinner suggestion with cost]

### 💰 Budget Summary

| Category         | Cost (Est.)         |
|------------------|---------------------|
| Flights          | ~$XXX               |
| Hotel            | ~$XXX               |
| Activities       | ~$XXX               |
| Food             | ~$XXX               |
| Transport        | ~$XXX               |
| **Total**        | **$XXX**            |

### 🌮 Local Tips
- [Transportation tip]
- [Food/drink recommendation]
- [Cultural/safety tip]

--- END EXAMPLE ---

Now create the exact same style for this request:

**Plan a trip to ${city} on ${date} with a $500 budget.**
`;

    console.log("PROMPT SENT TO GEMINI >>>", wrappedPrompt);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: wrappedPrompt }] }],
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