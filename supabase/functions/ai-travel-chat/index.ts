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
    const { message, userId } = await req.json();

    // Add Supabase client for user data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user profile and preferences for personalization
    let personalizationContext = "";
    
    if (userId) {
      try {
        // Get user profile data
        const { data: profile } = await supabase
          .from('users')
          .select(`
            email,
            age,
            bio,
            location,
            travel_style,
            interests,
            preferred_destinations,
            languages_spoken,
            expedia_affiliate_id,
            booking_affiliate_id,
            agoda_affiliate_id
          `)
          .eq('id', userId)
          .single();
        
        // Get travel preferences
        const { data: preferences } = await supabase
          .from('travel_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        // Check if user is an agent
        const isAgent = !!(profile?.expedia_affiliate_id || profile?.booking_affiliate_id || profile?.agoda_affiliate_id);
        
        // Build personalization context
        if (profile) {
          personalizationContext = `
**USER PROFILE FOR PERSONALIZATION:**
- Age: ${profile.age || 'Not specified'}
- Location: ${profile.location || 'Not specified'}
- Travel Style: ${profile.travel_style || 'Not specified'}
- Interests: ${profile.interests?.join(', ') || 'Not specified'}
- Preferred Destinations: ${profile.preferred_destinations?.join(', ') || 'Not specified'}
- Languages: ${profile.languages_spoken?.join(', ') || 'Not specified'}
${isAgent ? '- **AGENT USER**: This user is a travel agent. Tailor suggestions with commission optimization in mind.' : ''}

**TRAVEL PREFERENCES:**
${preferences ? `
- Budget Range: $${preferences.budget_range_min}-$${preferences.budget_range_max}
- Accommodation Types: ${preferences.accommodation_type?.join(', ') || 'Not specified'}
- Preferred Activities: ${preferences.preferred_activities?.join(', ') || 'Not specified'}
- Travel Pace: ${preferences.travel_pace || 'Not specified'}
- Group Size Preference: ${preferences.group_size_preference || 'Not specified'}
- Dietary Restrictions: ${preferences.dietary_restrictions?.join(', ') || 'None'}
` : '- No specific preferences set'}

**PERSONALIZATION INSTRUCTIONS:**
- Tailor itineraries to match the user's travel style and interests
- Consider their age and location when suggesting activities
- Respect budget preferences if specified
- Include activities that match their preferred pace
${isAgent ? '- For agents: Subtly favor destinations/activities with good affiliate opportunities' : ''}
          `;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    const systemPrompt = `You are Keila, an expert AI travel agent that creates comprehensive, visually rich travel itineraries. You MUST respond with a single, valid JSON object and nothing else.

    ${personalizationContext}

    **CRITICAL INSTRUCTIONS:**
    1. **Analyze the user's request** for destination, duration, budget, and travel style.
    2. **Generate a COMPREHENSIVE itinerary** with rich details, specific timing, and visual elements.
    3. **Your entire response MUST conform to the COMPREHENSIVE_ITINERARY_SCHEMA** provided below.
    4. If the user's request is too vague (e.g., "hi"), use the SIMPLE_FALLBACK_SCHEMA.

    **COMPREHENSIVE_ITINERARY_SCHEMA:**
    {
      "itineraryId": "unique-id-string",
      "tripTitle": "Engaging trip title",
      "destinationCity": "City Name",
      "destinationCountry": "Country Name", 
      "startDate": "2024-09-02",
      "endDate": "2024-09-05",
      "numberOfTravelers": 2,
      "travelStyle": "adventure/luxury/budget/cultural",
      "introductoryMessage": "Engaging welcome message about the trip",
      "imageCollageUrls": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
      ],
      "bookingModules": {
        "flights": {
          "title": "Flight Options",
          "items": [
            {
              "name": "Round-trip Economy",
              "price": "$450",
              "rating": 4.2,
              "bookingLink": "https://booking.com/flights",
              "description": "Direct flights with major airline"
            }
          ]
        },
        "accommodations": {
          "title": "Hotel Recommendations", 
          "items": [
            {
              "name": "Luxury Beach Resort",
              "price": "$280/night",
              "rating": 4.7,
              "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
              "bookingLink": "https://booking.com/hotels",
              "amenities": ["Pool", "Spa", "Beach Access"],
              "description": "Oceanfront resort with world-class amenities"
            }
          ]
        }
      },
      "dailyPlan": [
        {
          "day": "Day 1",
          "date": "September 2, 2024",
          "title": "Arrival & Beach Exploration", 
          "events": [
            {
              "time": "10:00 AM",
              "title": "Airport Arrival & Hotel Check-in",
              "description": "Welcome to Miami! Check into your beachfront hotel",
              "type": "accommodation",
              "location": "South Beach",
              "cost": "Included",
              "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
            },
            {
              "time": "2:00 PM", 
              "title": "South Beach Walking Tour",
              "description": "Explore the Art Deco architecture and vibrant culture",
              "type": "activity",
              "location": "Ocean Drive",
              "cost": "$25",
              "imageUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
            }
          ],
          "totalEstimatedCost": "$125"
        }
      ],
      "additionalInfo": {
        "cultureAdapter": [
          {
            "category": "Language",
            "title": "Essential Spanish Phrases",
            "content": "Hola (Hello), Gracias (Thank you), ¿Habla inglés? (Do you speak English?)"
          }
        ],
        "categoryBasedRecommendations": [
          {
            "category": "Food & Dining",
            "title": "Must-Try Local Cuisine",
            "items": [
              {
                "name": "Cuban Sandwich", 
                "description": "Authentic pressed sandwich with ham, pork, and pickles",
                "location": "Versailles Restaurant",
                "cost": "$12-15"
              }
            ]
          }
        ]
      },
      "utility": {
        "sources": ["TripAdvisor", "Lonely Planet", "Local Tourism Board"],
        "downloadPdfLink": "https://example.com/itinerary.pdf"
      }
    }

    **SIMPLE_FALLBACK_SCHEMA:**
    { "response": "A polite message asking for more information.", "quickReplies": ["Plan a 3-day trip"] }`;

    // Check API key and log its status
    console.log('OpenRouter API key status:', openRouterApiKey ? 'Present' : 'Missing');
    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found in environment variables');
      return new Response(JSON.stringify({ 
        isDetailedItinerary: false, 
        response: "API configuration missing. Please check OpenRouter API key setup." 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log('Making OpenRouter API request for message:', message);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openRouterApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        response_format: { type: "json_object" },
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const aiJson = await response.json();
    console.log('OpenRouter API response received');
    
    // Validate response structure
    if (!aiJson.choices || !aiJson.choices[0] || !aiJson.choices[0].message || !aiJson.choices[0].message.content) {
      console.error('Invalid API response structure:', aiJson);
      throw new Error('Invalid API response structure');
    }

    const messageContent = aiJson.choices[0].message.content;
    console.log('AI message content length:', messageContent.length);
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(messageContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Raw content:', messageContent);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    // Try comprehensive schema first
    const comprehensiveValidation = ComprehensiveItinerarySchema.safeParse(parsedJson);
    
    if (comprehensiveValidation.success) {
      return new Response(JSON.stringify({ 
        isComprehensiveItinerary: true, 
        comprehensiveItinerary: comprehensiveValidation.data 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Fallback to old schema for backward compatibility
    const legacyValidation = MultiItinerarySchema.safeParse(parsedJson);
    
    if (legacyValidation.success) {
      return new Response(JSON.stringify({ 
        isDetailedItinerary: true, 
        detailedItinerary: legacyValidation.data 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Simple fallback response
    return new Response(JSON.stringify({ 
      isDetailedItinerary: false, 
      response: parsedJson.response || "I need a few more details to help plan your trip!", 
      quickReplies: parsedJson.quickReplies || [] 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ isDetailedItinerary: false, response: "I'm having trouble connecting right now. Please try again." }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});