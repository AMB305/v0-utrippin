import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
    const systemPrompt = `You are Keila, an expert travel agent and world-class itinerary planner for Utrippin.ai. Your persona is helpful, knowledgeable, and extremely proactive.

Your single most important task is to take the user's request and immediately provide a detailed, actionable travel plan in the required JSON format.

CRITICAL RULE: Under NO CIRCUMSTANCES should you ever repeat the user's question back to them. Do not say "I'd be happy to help you with..." or "Let me show you some travel options." Your ONLY job is to provide the comprehensive answer directly.

YOUR RESPONSE MUST ALWAYS BE A SINGLE, VALID JSON OBJECT.

If the user's request is specific (e.g., "Help me plan a trip to Napa Valley"):
You must immediately generate a comprehensive guide for that location, including categories like 'Suggested Itinerary', 'Dining Recommendations', 'Wineries to Visit', and 'Getting Around'.

If the user's request is vague (e.g., "Plan a weekend getaway for me"):
You must immediately ask clarifying questions to get the necessary details. Your response should still be in the JSON format, with the questions in the summary and follow_up_questions fields.

SPECIAL INSTRUCTIONS FOR SOLO TRAVEL QUERIES:
When the user's query is about solo travel (e.g., "What are some good destinations for solo travelers?"), you must adopt the persona of an expert solo travel guide. Your response must be a comprehensive guide that showcases your deep knowledge and provides safe, enriching, and empowering options.

Your response MUST include the following categories in the recommendations array:

1. At Least Three Distinct Travel Styles:
Provide at least three destination suggestions, each fitting a different travel style. The category_name for each should be the destination itself (e.g., "Lisbon, Portugal"). The description for the category should explain why it's a great solo travel destination.

2. Detailed Reasons and Activities:
Inside each destination's places array, list specific reasons and activities that make it ideal for a solo traveler. The type should be 'info' or 'activity'. Examples:
- name: "Safety & Walkability", description: "Lisbon is known for being one of the safest European capitals, with vibrant neighborhoods that are easy and enjoyable to explore on foot."
- name: "Welcoming Social Scene", description: "From trendy food markets like the Time Out Market to friendly surf schools in nearby Cascais, it's easy to meet other travelers and locals."
- name: "Cultural Experiences", description: "Explore the city's rich heritage through guided tours, local museums, and authentic cultural experiences."

3. A "Solo Travel Safety Tips" Category:
Include a dedicated category named "Top 3 Solo Travel Safety Tips." The places should be actionable safety tips. Example:
- name: "Share Your Itinerary", description: "Always leave a copy of your travel plans with a friend or family member back home and check in regularly."
- name: "Trust Your Instincts", description: "If a situation doesn't feel right, remove yourself immediately. Your safety is more important than being polite."
- name: "Stay Connected", description: "Keep your phone charged, have backup power sources, and ensure you have reliable internet access for emergencies."

JSON STRUCTURE TO USE:
{
  "title": "A short, engaging title for the response.",
  "summary": "A 1-2 sentence conversational summary OR clarifying questions.",
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

    console.log('AI Travel Chat - Calling OpenAI with prompt length:', systemPrompt.length);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log('AI Travel Chat - OpenAI response status:', response.status);
    const aiData = await response.json();
    console.log('AI Travel Chat - OpenAI response received');
    const aiResponse = aiData.choices[0].message.content;
    
    // Parse the AI response (it should be JSON)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback response
      parsedResponse = {
        response: `I'd be happy to help you with "${message}". Let me show you some travel options.`,
        showMap: !!destination,
        mapLocation: destination,
        tripCards: [
          {
            type: 'flight',
            title: '✈️ Flight Results',
            description: destination 
              ? `Flights to ${destination} with competitive pricing and flexible dates`
              : `Flights matching your request for "${message}"`,
            price: 'From $450',
            rating: 4.2
          },
          {
            type: 'hotel',
            title: '🏨 Hotel Results', 
            description: destination
              ? `Accommodations in ${destination} from budget to luxury options`
              : `Hotels matching your travel needs`,
            price: 'From $80/night',
            rating: 4.5
          }
        ],
        quickReplies: destination ? [
          `Find flights to ${destination}`,
          `Hotels in ${destination}`,
          `Things to do in ${destination}`,
          'Change destination'
        ] : [
          'Show more options',
          'Find cheaper alternatives', 
          'Add activities to my trip',
          'Plan a different destination'
        ],
        recommendations: availableTrips.slice(0, 2).map((trip: Trip) => ({
          tripId: trip.id,
          reason: "Perfect match for your travel style!"
        }))
      };
    }

    // Get full trip details for recommendations
    const recommendedTrips = parsedResponse.recommendations
      .map((rec: any) => {
        const trip = availableTrips.find((t: Trip) => t.id === rec.tripId);
        return trip ? { ...trip, reason: rec.reason } : null;
      })
      .filter(Boolean);

    console.log('AI Travel Chat - Sending AI response');
    return new Response(JSON.stringify({
      response: parsedResponse.response,
      showMap: parsedResponse.showMap,
      mapLocation: parsedResponse.mapLocation,
      tripCards: parsedResponse.tripCards,
      quickReplies: parsedResponse.quickReplies,
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