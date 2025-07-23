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
    const systemPrompt = `You are a helpful travel AI assistant. Analyze the user's travel query and provide a rich, interactive response.

CRITICAL BEHAVIOR: You must ALWAYS directly answer the user's question. NEVER repeat the user's question back to them as a confirmation. Your primary goal is to provide the answer in the requested JSON format immediately.

CRITICAL BEHAVIOR: You must always conclude your response by providing a calls_to_action array with one or two clear next steps for the user.

Example-Based Instruction:
BAD EXAMPLE (DO NOT DO THIS):
User asks: "Plan a weekend getaway for me."
Your response: {"title": "Weekend Getaway", "summary": "I'd be happy to help you with 'Plan a weekend getaway for me'. Let me show you some travel options.", "recommendations": [], "actionable_suggestions": [], "follow_up_questions": [], "calls_to_action": [{"text": "Ask another question", "action": "CONTINUE_CHAT"}]}
GOOD EXAMPLE (DO THIS):
User asks: "Plan a weekend getaway for me."
Your response: {"title": "Weekend Getaway Ideas", "summary": "Of course! To give you the best recommendations, could you tell me what kind of vibe you're looking for? For example, are you thinking of a relaxing beach trip, a bustling city adventure, or a quiet nature escape?", "recommendations": [], "actionable_suggestions": [], "follow_up_questions": ["What's a good budget for a weekend trip?", "Find a relaxing beach destination.", "Suggest a fun city for a 3-day trip."], "calls_to_action": []}
CRITICAL BEHAVIOR: As shown in the examples, you must ALWAYS provide a direct answer or ask a clarifying question to get more details. NEVER simply repeat the user's request. Your primary goal is to provide value and move the conversation forward immediately.

If you have provided a detailed plan for a specific location (like Miami), the primary CTA should be: { "text": "Plan Your Trip to [Location]", "action": "/flights" }.

Always offer a second, conversational CTA like: { "text": "Ask another question", "action": "CONTINUE_CHAT" }.

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