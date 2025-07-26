// supabase/functions/ai-travel-chat/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.23.4/mod.ts";

// Legacy schemas for backward compatibility
const DaySchema = z.object({ day: z.string(), title: z.string(), activities: z.array(z.string()) });
const ItineraryOptionSchema = z.object({ title: z.string(), estimated_cost: z.string(), summary: z.string(), days: z.array(DaySchema).min(1) });
const MultiItinerarySchema = z.object({ destination: z.string(), overview_summary: z.string(), options: z.array(ItineraryOptionSchema).length(3) });

// New comprehensive schema
const BookingItemSchema = z.object({
  name: z.string(),
  price: z.string(),
  rating: z.number().optional(),
  imageUrl: z.string().optional(),
  bookingLink: z.string(),
  agentUrl: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional()
});

const BookingModuleSchema = z.object({
  title: z.string(),
  items: z.array(BookingItemSchema),
  defaultUrl: z.string().optional()
});

const EventSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['activity', 'transport', 'dining', 'accommodation']),
  location: z.string().optional(),
  cost: z.string().optional(),
  imageUrl: z.string().optional(),
  bookingUrl: z.string().optional()
});

const DayPlanSchema = z.object({
  day: z.string(),
  date: z.string(),
  title: z.string(),
  events: z.array(EventSchema),
  totalEstimatedCost: z.string().optional()
});

const CultureTipSchema = z.object({
  category: z.string(),
  title: z.string(),
  content: z.string()
});

const CategoryRecommendationSchema = z.object({
  category: z.string(),
  title: z.string(),
  items: z.array(z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
    location: z.string().optional(),
    cost: z.string().optional()
  }))
});

const ComprehensiveItinerarySchema = z.object({
  itineraryId: z.string(),
  tripTitle: z.string(),
  destinationCity: z.string(),
  destinationCountry: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  numberOfTravelers: z.number(),
  travelStyle: z.string(),
  introductoryMessage: z.string(),
  imageCollageUrls: z.array(z.string()).min(3).max(6),
  bookingModules: z.object({
    flights: BookingModuleSchema,
    accommodations: BookingModuleSchema
  }),
  dailyPlan: z.array(DayPlanSchema).min(1),
  additionalInfo: z.object({
    cultureAdapter: z.array(CultureTipSchema),
    categoryBasedRecommendations: z.array(CategoryRecommendationSchema)
  }),
  utility: z.object({
    sources: z.array(z.string()),
    downloadPdfLink: z.string().optional()
  })
});

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { message } = await req.json();
    const systemPrompt = `You are Keila, an expert AI travel agent that creates inspiring and detailed itineraries. Your primary goal is to generate THREE distinct, high-quality travel itineraries based on a user's request. You MUST respond with a single, valid JSON object and nothing else.

    **CRITICAL INSTRUCTIONS:**
    1.  **Analyze the user's request** for a destination, duration, and budget.
    2.  **Generate THREE distinct itinerary options**: "Budget Saver", "Balanced Choice", and "Luxury Experience".
    3.  **Each activity must be a specific place or event**, not a generic category. For example, instead of "Visit a museum", write "Visit the Louvre Museum to see the Mona Lisa".
    4.  **Your entire response MUST conform to the MULTI_ITINERARY_SCHEMA** provided below.
    5.  If the user's request is too vague (e.g., "hi"), you MUST use the SIMPLE_FALLBACK_SCHEMA.

    **MULTI_ITINERARY_SCHEMA:**
    {
      "destination": "City, Country",
      "overview_summary": "A brief, engaging summary of the trip concept, highlighting the key experiences.",
      "options": [
        { "title": "The Budget Saver", "estimated_cost": "Approximate total cost, e.g., '$500 - $700'", "summary": "A description of this budget-friendly option, focusing on value and free/low-cost activities.", "days": [{"day": "Day 1", "title": "Arrival & Local Exploration", "activities": ["Free walking tour", "Local market visit"]}] },
        { "title": "The Balanced Choice", "estimated_cost": "Approximate total cost, e.g., '$1200 - $1500'", "summary": "Balance of cost and comfort.", "days": [{"day": "Day 1", "title": "Arrival & Cultural Immersion", "activities": ["3-star hotel check-in", "Museum visit"]}] },
        { "title": "The Luxury Experience", "estimated_cost": "$2500+", "summary": "Premium comfort and unique experiences.", "days": [{"day": "Day 1", "title": "Arrival in Style", "activities": ["Private transfer to 5-star hotel", "Fine dining"]}] }
      ]
    }

    **SIMPLE_FALLBACK_SCHEMA:**
    { "response": "A polite message asking for more information.", "quickReplies": ["Plan a 3-day trip"] }`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openRouterApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        response_format: { type: "json_object" },
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const aiJson = await response.json();
    const parsedJson = JSON.parse(aiJson.choices[0].message.content);
    const validationResult = MultiItinerarySchema.safeParse(parsedJson);

    if (validationResult.success) {
      return new Response(JSON.stringify({ isDetailedItinerary: true, detailedItinerary: validationResult.data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ isDetailedItinerary: false, response: parsedJson.response || "I need a few more details to help plan your trip!", quickReplies: parsedJson.quickReplies || [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ isDetailedItinerary: false, response: "I'm having trouble connecting right now. Please try again." }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});