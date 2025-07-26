// FILE: supabase/functions/ai-travel-chat/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { z } from "https://deno.land/x/zod@v3.23.4/mod.ts";

// NOTE: This assumes you have created the schemas.ts file in a location
// accessible to your edge function. Adjust the import path if necessary.
// You may need to copy the schemas.ts file into your supabase/functions/_shared directory.
// For now, we will define it directly here to ensure zero external dependencies.

const DaySchema = z.object({
  day: z.string(),
  title: z.string(),
  activities: z.array(z.string())
});

const DetailedItinerarySchema = z.object({
  destination: z.string(),
  overview: z.object({
    title: z.string(),
    summary: z.string().min(50)
  }),
  days: z.array(DaySchema).min(1),
  culture_tips: z.record(z.string(), z.string()).optional(),
  actionable_suggestions: z.array(z.string()).optional()
});


const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const systemPrompt = `You are Keila, an expert travel AI. Your task is to generate a travel itinerary based on the user's request. You MUST respond with a single, valid JSON object and nothing else. Do not include any text, markdown, or explanations before or after the JSON.

    If the user's request is specific enough to generate an itinerary (e.g., contains a destination and a timeframe), use the following JSON schema:
    {
      "destination": "City, Country",
      "overview": {
        "title": "A catchy and descriptive title for the trip",
        "summary": "A detailed summary of the trip, at least 50 characters long."
      },
      "days": [
        {
          "day": "Day 1",
          "title": "Arrival and Exploration",
          "activities": ["Meaningful activity description 1", "Meaningful activity description 2"]
        }
      ],
      "culture_tips": { "Tipping": "A useful tip about local tipping customs." },
      "actionable_suggestions": ["A practical suggestion for the traveler."]
    }

    If you do not have enough information, you MUST use this simple schema instead:
    {
      "response": "A polite message asking for more information (e.g., dates, budget, interests).",
      "quickReplies": ["Helpful suggestion 1", "Helpful suggestion 2"]
    }`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        response_format: { type: "json_object" },
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const aiJson = await response.json();
    const aiContent = aiJson.choices[0].message.content;
    const parsedJson = JSON.parse(aiContent);

    const validationResult = DetailedItinerarySchema.safeParse(parsedJson);

    if (validationResult.success) {
      return new Response(JSON.stringify({
        isDetailedItinerary: true,
        detailedItinerary: validationResult.data
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({
        isDetailedItinerary: false,
        response: parsedJson.response || "I need a few more details to help plan your trip!",
        quickReplies: parsedJson.quickReplies || []
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({
      isDetailedItinerary: false,
      response: "I'm having trouble connecting right now. Please try again.",
      quickReplies: ["Try again"]
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});