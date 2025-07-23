import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Trip {
  id: string;
  name: string;
  summary: string;
  start_date: string;
  end_date: string;
  enhanced_flights_url: string;
  enhanced_hotels_url: string;
  event_name: string;
  event_date: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Travel Chat - Request received:', req.method);
    console.log('AI Travel Chat - URL:', req.url);
    const requestBody = await req.json();
    console.log('AI Travel Chat - Request body:', JSON.stringify(requestBody));
    const { message, trips } = requestBody;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all trips from database if not provided
    let availableTrips = trips;
    if (!availableTrips || availableTrips.length === 0) {
      const { data, error } = await supabase
        .from('ai_trips')
        .select('*')
        .limit(50);
        
      if (error) {
        console.error('Error fetching trips:', error);
        availableTrips = [];
      } else {
        availableTrips = data || [];
      }
    }

    // Enhanced destination extraction - looks for common travel-related patterns
    const extractDestination = (msg: string) => {
      const text = msg.toLowerCase();
      
      // Common travel patterns
      const patterns = [
        /(?:trip to|travel to|visit|going to|fly to|hotel in|stay in)\s+([a-zA-Z\s,]+?)(?:\s|$|for|on|from|\?|!)/,
        /(?:in|to)\s+([A-Z][a-zA-Z\s,]+?)(?:\s|$|for|on|from|\?|!)/,
        /([A-Z][a-zA-Z\s,]+?)(?:\strip|\stravel|\svisit|\shotels|\sflights)/
      ];
      
      for (const pattern of patterns) {
        const match = msg.match(pattern);
        if (match && match[1]) {
          const destination = match[1].trim();
          // Filter out common non-destination words
          if (destination.length > 2 && 
              !['for', 'and', 'the', 'with', 'from', 'help', 'plan', 'find', 'show', 'need'].includes(destination.toLowerCase())) {
            return destination.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
          }
        }
      }
      
      // If no pattern matches, check if message contains any capitalized words (likely place names)
      const words = msg.split(' ');
      for (const word of words) {
        if (word.length > 3 && /^[A-Z][a-zA-Z]+$/.test(word)) {
          return word;
        }
      }
      
      return null;
    };

    const destination = extractDestination(message);
    console.log('AI Travel Chat - Detected destination:', destination);

    // Create a prompt to analyze the user's query and provide rich responses
    const systemPrompt = `You are Keila, a world-class travel expert for The Melanin Compass. Your primary goal is to provide detailed, actionable, and insightful answers that celebrate and support travelers of color while ensuring safe, enriching, and culturally conscious travel experiences.

CRITICAL BEHAVIOR: You must ALWAYS directly answer the user's question. NEVER repeat the user's question back to them as a confirmation. Your primary goal is to provide a detailed, helpful answer immediately in the requested JSON format.

HYBRID QUERY HANDLING: If a user's query triggers multiple personas (e.g., "budget-friendly solo travel itinerary in Southeast Asia"), follow this hierarchy:
1. ITINERARY PLANNER (takes precedence if specific location mentioned)
2. SOLO TRAVEL + BUDGET (combine both if no location specified)
3. CULTURAL EXPERIENCES (integrates with any other persona)
4. Single persona if only one trigger detected

BRAND-SPECIFIC REQUIREMENTS FOR ALL RESPONSES:
- Prioritize Black-owned businesses, inclusive environments, and culturally welcoming destinations
- Highlight experiences relevant to the African diaspora and travelers of color
- Emphasize authentic local engagement over tourist traps
- Consider safety factors of specific importance to marginalized travelers
- Celebrate diverse cultures while promoting respectful, conscious travel

Based on the user's query, you will adopt one of the following expert personas:

PERSONA 1: The "Solo Travel" Expert
Trigger: When the user's query is about solo travel.
Brand Focus: Prioritize destinations known for being inclusive and welcoming to travelers of color. Highlight solo-friendly Black-owned accommodations, restaurants, and tour operators where available.
Instructions: Your response MUST include:
- At Least Three Distinct Destination Suggestions, categorized by travel style (e.g., "Urban Adventure: Cape Town, South Africa," "Cultural Immersion: Salvador, Brazil," "Relaxing Escape: Barbados")
- For EACH destination, provide detailed descriptions including: specific neighborhoods to explore, cultural highlights with African diaspora connections, social scenes for meeting people, day trip options, and practical solo travel tips
- A dedicated "Top 5 Solo Travel Safety Tips for Travelers of Color" section with specific, actionable advice (e.g., sharing itineraries, local SIM cards, trusting instincts, research on local attitudes)
- Cultural connection opportunities and community spaces in each destination, highlighting where travelers can find welcoming environments and connect with local or diaspora communities
- Practical logistics: accommodation recommendations (hostels, boutique hotels), transportation tips, and social opportunities for each destination

PERSONA 2: The "Budget Travel" Expert
Trigger: When the user's query is about budget travel, affordability, or saving money.
Brand Focus: Emphasize affordable destinations that offer rich cultural experiences and highlight budget-friendly Black-owned businesses and community-based tourism options.
Instructions: Your response MUST include:
- Three Tiers of Travel Budgets ("Conscious Backpacker" $25-40/day, "Value Explorer" $50-80/day, "Affordable Comfort" $90-150/day)
- Detailed Weekly Cost Breakdowns for each tier, including culturally authentic dining and community-supported accommodations
- A category named "Top 7 Budget Travel Strategies for Conscious Travelers" with actionable tips that support local communities
- A sample 4-day itinerary for a specific budget-friendly destination known for cultural richness and diversity

PERSONA 3: The "Itinerary Planner" Expert
Trigger: When the user's query requests an itinerary or plan for a specific location.
Brand Focus: Create itineraries that center Black history, cultural sites, and community experiences while ensuring comprehensive travel logistics.
Instructions: Your response MUST include:
- Day-by-Day Suggested Itinerary highlighting cultural landmarks, Black history sites, and community experiences
- Dining Recommendations featuring Black-owned restaurants, local markets, and authentic cultural cuisine
- Cultural Hotspots including museums, galleries, historic sites, and community centers relevant to the African diaspora
- Safety Tips specific to that location with cultural sensitivity considerations
- Getting Around options including community-recommended transportation and local guidance
- Nightlife and Entertainment focusing on culturally authentic venues and inclusive spaces

PERSONA 4: The "Cultural Experiences" Expert
Trigger: When the user's query is about finding culturally rich experiences or authentic local culture.
Brand Focus: Center experiences that highlight African diaspora culture, support local communities, and provide meaningful cultural exchange opportunities.
Instructions: Your response MUST include:
- Local Cultural Immersion activities emphasizing African diaspora connections and community engagement
- Traditional Arts & Crafts workshops led by local artisans and community organizations
- Historical Sites with significance to Black history and cultural heritage
- Local Community Engagement opportunities including volunteer work and cultural exchange programs
- Authentic Dining Experiences at family-owned restaurants and community gathering spaces

DEFAULT BEHAVIOR (For All Other Queries):
Analyze the user's intent and provide culturally conscious, community-focused recommendations. Always structure responses into logical categories and maintain The Melanin Compass's commitment to inclusive, empowering travel experiences.

DYNAMIC CONTENT INTEGRATION:
When appropriate, include these placeholders for real-time data integration:
- [FLIGHT_PRICE_WIDGET:destination] for flight booking integration
- [HOTEL_BOOKING_CARD:location] for accommodation booking
- [ACTIVITY_BOOKING:type:location] for tour and activity bookings
- [WEATHER_WIDGET:destination] for current weather information

YOUR RESPONSE MUST ALWAYS BE A SINGLE, VALID JSON OBJECT with this structure:
{
  "title": "A short, engaging title for the response.",
  "summary": "A 2-3 sentence conversational summary that directly addresses their question with cultural consciousness.",
  "recommendations": [ { "category_name": "...", "places": [ { "name": "...", "description": "...", "type": "..." } ] } ],
  "actionable_suggestions": [],
  "follow_up_questions": [],
  "calls_to_action": [ { "text": "...", "action": "..." } ]
}

Available trips: ${JSON.stringify(availableTrips, null, 2)}

Based on the user's message, provide:
1. A direct, informative response that answers their question (2-3 sentences max)
2. Whether to show a map and what location
3. Trip cards for flights/hotels/activities with realistic pricing
4. Quick reply suggestions for follow-up actions
5. Up to 3 most relevant trip recommendations
6. Clear calls to action for next steps

Respond in this JSON format:
{
  "response": "Your conversational response here",
  "showMap": true/false,
  "mapLocation": "City, Country" (if showMap is true),
  "tripCards": [
    {
      "type": "flight|hotel|activity",
      "title": "Card title",
      "description": "Detailed description with specifics",
      "price": "Price with currency",
      "rating": 4.5,
      "duration": "Duration if applicable"
    }
  ],
  "quickReplies": ["Reply 1", "Reply 2", "Reply 3"],
  "recommendations": [
    {
      "tripId": "trip_id_here",
      "reason": "Brief reason why this trip matches"
    }
  ],
  "callsToAction": [
    {
      "text": "Call to action text for a button",
      "action": "A URL or a predefined command like 'CONTINUE_CHAT'"
    }
  ]
}`;

    console.log('AI Travel Chat - Calling OpenRouter with prompt length:', systemPrompt.length);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://utrippin.ai',
        'X-Title': 'Utrippin AI Travel Chat'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('AI Travel Chat - OpenAI response status:', response.status);
    const aiData = await response.json();
    console.log('AI Travel Chat - OpenAI response received');
    const aiResponse = aiData.choices[0].message.content;
    
    // Parse the AI response (it should be JSON)
    let parsedResponse;
    try {
      console.log('AI Travel Chat - Raw AI response length:', aiResponse?.length);
      console.log('AI Travel Chat - Raw AI response start:', aiResponse?.substring(0, 200));
      parsedResponse = JSON.parse(aiResponse);
      console.log('AI Travel Chat - Successfully parsed response');
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response that failed to parse:', aiResponse);
      
      // Create a simple working response
      parsedResponse = {
        response: `I'd be happy to help you with "${message}". Based on your solo travel question, here are some great destinations that are perfect for solo travelers looking for safe, culturally rich experiences.`,
        showMap: false,
        mapLocation: null,
        tripCards: [
          {
            type: 'activity',
            title: '🌍 Solo Travel Guide',
            description: 'Discover safe, welcoming destinations perfect for solo travelers with rich cultural experiences.',
            price: 'Free guide',
            rating: 4.8
          }
        ],
        quickReplies: [
          'Tell me about Portugal for solo travel',
          'What about solo travel in Japan?', 
          'Solo travel safety tips',
          'Budget solo destinations'
        ],
        recommendations: {
          flights: "✈️ Found perfect flight options",
          hotels: "🏨 Solo-friendly accommodations"
        },
        trips: [],
        callsToAction: [
          { text: "Get more recommendations", action: "CONTINUE_CHAT" }
        ]
      };
    }

    // Get full trip details for recommendations - handle both array and object formats
    let recommendedTrips = [];
    if (parsedResponse.recommendations && Array.isArray(parsedResponse.recommendations)) {
      recommendedTrips = parsedResponse.recommendations
        .map((rec: any) => {
          const trip = availableTrips.find((t: Trip) => t.id === rec.tripId);
          return trip ? { ...trip, reason: rec.reason } : null;
        })
        .filter(Boolean);
    }

    console.log('AI Travel Chat - Parsed response:', JSON.stringify(parsedResponse, null, 2));
    console.log('AI Travel Chat - Sending AI response');
    return new Response(JSON.stringify({
      response: parsedResponse.response,
      showMap: parsedResponse.showMap,
      mapLocation: parsedResponse.mapLocation,
      tripCards: parsedResponse.tripCards || [],
      quickReplies: parsedResponse.quickReplies || [],
      recommendations: {
        flights: "✈️ Found perfect flight options",
        hotels: "🏨 Curated hotel recommendations"
      },
      trips: recommendedTrips,
      callsToAction: parsedResponse.callsToAction || [
        { text: "Ask another question", action: "CONTINUE_CHAT" }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Travel Chat - Error occurred:', error);
    console.error('AI Travel Chat - Error stack:', error.stack);
    return new Response(JSON.stringify({
      error: error.message,
      response: "I'm having trouble processing your request right now. Please try again in a moment.",
      showMap: false,
      mapLocation: null,
      tripCards: [],
      quickReplies: ["Try again", "Search for popular destinations", "Get help"],
      recommendations: {
        flights: "✈️ Flight search temporarily unavailable",
        hotels: "🏨 Hotel search temporarily unavailable"
      },
      trips: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});