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
    const { city, date, budget = 500 } = await req.json();
    const cacheKey = `${city}_${date}_${budget}`;

    console.log(`Generating travel guide for ${city} on ${date} with budget $${budget}`);

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

    // 🧠 Step 2: Keila-style friendly prompt with structure
    const keilaPrompt = `
You are Keila, a smart, friendly AI travel assistant. 
Generate a clear, Markdown-formatted itinerary for a trip to **${city}**, starting **${date}**, with a budget of **$${budget}**.

✅ Use this structure exactly:
- Friendly intro paragraph
- Emoji headers for each section
- Budget table
- Insider tips
- Expedia booking links

Keep tone helpful and encouraging, like a well-traveled friend planning the perfect getaway.

---

## 🏖 ${city} Trip – ${date} – Budget: $${budget}

Hey there! ✨ Here's how to explore ${city} on a $${budget} budget and still have an amazing time.

### ✈️ Flights  
**Here's the move:** Search early and fly into the nearest major airport.  
Try budget airlines like JetBlue, Spirit, or Aeroméxico.  
📍 Tip: Mid-week flights are often cheaper!

### 🏨 Where to Stay  
**Let's keep it comfy and budget-friendly:**
- 💎 All-Inclusive? Try Riu or Krystal
- 💰 Budget? Hostels like Selina or Freehand

### 📆 Daily Game Plan

#### Day 1 – Arrival  
- ✈️ Land and check-in  
- 🏖 Beach time at a popular free spot  
- 🍽 Street food dinner (~$12)

#### Day 2 – Local Adventure  
- 🚌 Visit ruins or cultural site (~$60)  
- 🌮 Lunch at a local café  
- 🎟 Explore markets

#### Day 3 – Water Fun  
- ⛴ Ferry to nearby island/snorkeling  
- 🐠 Beach time and street tacos

#### Day 4 – Wind Down  
- 🧘 Chill day and fly home

### 💸 Budget Breakdown

| Category       | Estimated Cost |
|----------------|----------------|
| Flights        | $XXX           |
| Hotel          | $XXX           |
| Food           | $XXX           |
| Activities     | $XXX           |
| Transport      | $XXX           |
| **Total**      | **$${budget}** |

### 💡 Keila's Tips  
- Bring sunscreen + refillable water bottle  
- Use public transport like R1 or R2  
- Book ferries or excursions in advance!

---

🔗 [Book Flights](https://www.expedia.com/Flights?siteid=1&clickref=1100lBkVXSGk) | [Book Hotels](https://www.expedia.com/Hotels?siteid=1&clickref=1100lBkVXSGk)

Only return Markdown — no extra text or apologies.
`;

    console.log("KEILA PROMPT SENT TO GEMINI >>>", keilaPrompt);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      generationConfig: { temperature: 0.0 }
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: keilaPrompt }] }],
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