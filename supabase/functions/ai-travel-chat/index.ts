
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
    const requestBody = await req.json();
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

    // Enhanced destination, dates, and budget extraction
    const extractTripDetails = (msg: string) => {
      const text = msg.toLowerCase();
      
      // Destination patterns
      const destinationPatterns = [
        /(?:trip to|travel to|visit|going to|fly to|hotel in|stay in)\s+([a-zA-Z\s,]+?)(?:\s|$|for|on|from|in\s+\w+|\?|!)/,
        /(?:in|to)\s+([A-Z][a-zA-Z\s,]+?)(?:\s|$|for|on|from|in\s+\w+|\?|!)/,
        /([A-Z][a-zA-Z\s,]+?)(?:\strip|\stravel|\svisit|\shotels|\sflights)/
      ];
      
      let destination = null;
      for (const pattern of destinationPatterns) {
        const match = msg.match(pattern);
        if (match && match[1]) {
          const dest = match[1].trim();
          if (dest.length > 2 && 
              !['for', 'and', 'the', 'with', 'from', 'help', 'plan', 'find', 'show', 'need'].includes(dest.toLowerCase())) {
            destination = dest.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
            break;
          }
        }
      }
      
      // Date patterns
      const datePatterns = [
        /(\w+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*-\s*\d{1,2}(?:st|nd|rd|th)?)?)/g,
        /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?(?:\s*-\s*\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)?)/g,
        /(\d{1,2}-\d{1,2}(?:-\d{2,4})?)/g
      ];
      
      let dates = null;
      for (const pattern of datePatterns) {
        const matches = msg.match(pattern);
        if (matches && matches.length > 0) {
          dates = matches[0];
          break;
        }
      }
      
      // Budget patterns
      const budgetPatterns = [
        /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
        /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|bucks?)/g,
        /budget\s+(?:of\s+)?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/g
      ];
      
      let budget = null;
      for (const pattern of budgetPatterns) {
        const matches = msg.match(pattern);
        if (matches && matches.length > 0) {
          budget = matches[0];
          break;
        }
      }
      
      return { destination, dates, budget };
    };

    const tripDetails = extractTripDetails(message);
    console.log('AI Travel Chat - Detected trip details:', tripDetails);

    // Create enhanced system prompt for detailed itinerary responses
    const systemPrompt = `You are Keila, a world-class travel expert for The Melanin Compass. Your primary goal is to provide detailed, actionable, and insightful answers that celebrate and support travelers of color while ensuring safe, enriching, and culturally conscious travel experiences.

CRITICAL BEHAVIOR: You must ALWAYS directly answer the user's question. NEVER repeat the user's question back to them as a confirmation. Your primary goal is to provide a detailed, helpful answer immediately in the requested JSON format.

BRAND-SPECIFIC REQUIREMENTS FOR ALL RESPONSES:
- Prioritize Black-owned businesses, inclusive environments, and culturally welcoming destinations
- Highlight experiences relevant to the African diaspora and travelers of color
- Emphasize authentic local engagement over tourist traps
- Consider safety factors of specific importance to marginalized travelers
- Celebrate diverse cultures while promoting respectful, conscious travel

PERSONA ACTIVATION RULES:
When a user provides ANY DESTINATION (with or without dates/budget), you MUST activate the "Itinerary Planner" persona and provide the DETAILED JSON FORMAT below. This ensures users get comprehensive, rich itineraries immediately.

PERSONA: The "Itinerary Planner" Expert
When activated, your response MUST include:
- Day-by-Day Suggested Itinerary highlighting cultural landmarks, Black history sites, and community experiences
- Dining Recommendations featuring Black-owned restaurants, local markets, and authentic cultural cuisine  
- Cultural Hotspots including museums, galleries, historic sites, and community centers relevant to the African diaspora
- Safety Tips specific to that location with cultural sensitivity considerations
- Getting Around options including community-recommended transportation and local guidance
- Nightlife and Entertainment focusing on culturally authentic venues and inclusive spaces

YOUR RESPONSE MUST ALWAYS BE A SINGLE, VALID JSON OBJECT with this EXACT structure:
{
  "title": "A specific, engaging title for the itinerary (e.g., 'Your Custom 5-Day Miami Staycation Itinerary ($1000 Budget)')",
  "summary": "A 2-3 sentence conversational summary that directly addresses their question with cultural consciousness and budget awareness.",
  "recommendations": [
    {
      "category_name": "Suggested X-Day Itinerary (Avg. Cost ~$XX/day)",
      "places": [
        {
          "name": "Day 1: Specific Activity/Area Focus",
          "description": "Detailed description of the day's activities, cultural significance, and budget considerations",
          "type": "Day Plan",
          "image_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=PHOTO_REF&key=API_KEY",
          "location": "Specific Area/Neighborhood",
          "rating": 4.5,
          "price_range": "$50-100"
        }
      ]
    },
    {
      "category_name": "Budget-Friendly Dining Spots",
      "places": [
        {
          "name": "Restaurant Name",
          "description": "Description including cultural significance, average cost, and why it's special",
          "type": "Restaurant",
          "image_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=PHOTO_REF&key=API_KEY",
          "location": "Neighborhood/Area",
          "rating": 4.3,
          "price_range": "$15-25"
        }
      ]
    },
    {
      "category_name": "Cultural Hotspots & Black History Sites",
      "places": [
        {
          "name": "Site/Museum Name",
          "description": "Cultural significance, cost, and community connection",
          "type": "Cultural Site",
          "image_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=PHOTO_REF&key=API_KEY",
          "location": "District/Area",
          "rating": 4.7,
          "price_range": "Free-$15"
        }
      ]
    },
    {
      "category_name": "Nightlife & Entertainment",
      "places": [
        {
          "name": "Venue Name", 
          "description": "Description of atmosphere, cultural relevance, and approximate costs",
          "type": "Bar/Club/Entertainment",
          "image_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=PHOTO_REF&key=API_KEY",
          "location": "Entertainment District",
          "rating": 4.4,
          "price_range": "$8-15 drinks"
        }
      ]
    },
    {
      "category_name": "Free & Low-Cost Activities",
      "places": [
        {
          "name": "Activity Name",
          "description": "How to access, cultural significance, and community value", 
          "type": "Activity",
          "image_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=PHOTO_REF&key=API_KEY",
          "location": "Area/Park",
          "rating": 4.6,
          "price_range": "Free"
        }
      ]
    }
  ],
  "actionable_suggestions": [
    "Practical tip 1 for budget travel with cultural consciousness",
    "Practical tip 2 for community engagement and safety",
    "Practical tip 3 for authentic cultural experiences"
  ],
  "follow_up_questions": [
    "Would you like me to find specific budget hotels or hostels in these areas?",
    "Are you interested in particular cultural experiences or music scenes?",
    "Should we build out one of these days into a more detailed, hour-by-hour plan?"
  ]
}

For OTHER QUERIES (without destination + dates + budget), use the simpler response format:
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
}

Available trips: ${JSON.stringify(availableTrips, null, 2)}`;

    console.log('AI Travel Chat - Calling OpenRouter with enhanced prompt');
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
        max_tokens: 3000,
      }),
    });

    console.log('AI Travel Chat - OpenRouter response status:', response.status);
    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;
    
    // Parse the AI response
    let parsedResponse;
    try {
      console.log('AI Travel Chat - Raw AI response length:', aiResponse?.length);
      parsedResponse = JSON.parse(aiResponse);
      console.log('AI Travel Chat - Successfully parsed detailed response');
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response that failed to parse:', aiResponse);
      
      // Create a simple working response
      parsedResponse = {
        response: `I'd be happy to help you with "${message}". Let me provide you with some detailed recommendations for your trip.`,
        showMap: false,
        mapLocation: null,
        tripCards: [
          {
            type: 'activity',
            title: '🌍 Travel Planning Guide',
            description: 'Get detailed itinerary recommendations with cultural experiences and budget-friendly options.',
            price: 'Free consultation',
            rating: 4.8
          }
        ],
        quickReplies: [
          'Create a detailed day-by-day itinerary',
          'Find Black-owned restaurants and businesses',
          'Show cultural sites and museums',
          'Budget travel tips'
        ],
        recommendations: [],
        callsToAction: [
          { text: "Get personalized itinerary", action: "CONTINUE_CHAT" }
        ]
      };
    }

    // Handle detailed itinerary response format
    if (parsedResponse.title && parsedResponse.summary && parsedResponse.recommendations) {
      console.log('AI Travel Chat - Detected detailed itinerary response');
      
      // Enhanced detailed response with Google Places integration
      const detailedResponse = {
        response: parsedResponse.summary,
        showMap: tripDetails.destination ? true : false,
        mapLocation: tripDetails.destination || null,
        tripCards: [],
        quickReplies: parsedResponse.follow_up_questions || [],
        recommendations: [],
        callsToAction: [],
        detailedItinerary: {
          title: parsedResponse.title,
          summary: parsedResponse.summary,
          recommendations: parsedResponse.recommendations,
          actionable_suggestions: parsedResponse.actionable_suggestions,
          follow_up_questions: parsedResponse.follow_up_questions
        },
        isDetailedItinerary: true // Flag to trigger detailed UI
      };
      
      console.log('AI Travel Chat - Sending detailed itinerary response');
      return new Response(JSON.stringify(detailedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle simple response format
    const responseData = {
      response: parsedResponse.response,
      showMap: parsedResponse.showMap,
      mapLocation: parsedResponse.mapLocation,
      tripCards: parsedResponse.tripCards || [],
      quickReplies: parsedResponse.quickReplies || [],
      recommendations: {
        flights: "✈️ Found perfect flight options",
        hotels: "🏨 Curated hotel recommendations"
      },
      trips: [],
      callsToAction: parsedResponse.callsToAction || [
        { text: "Ask another question", action: "CONTINUE_CHAT" }
      ]
    };

    console.log('AI Travel Chat - Sending simple response');
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Travel Chat - Error occurred:', error);
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
