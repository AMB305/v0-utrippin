
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
    const { message, trips, sessionId } = requestBody;
    
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

    // Session context management
    let sessionContext = null;
    if (sessionId) {
      // Try to retrieve existing session context
      const { data: existingSession } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      sessionContext = existingSession;
      console.log('AI Travel Chat - Retrieved session context:', sessionContext);
    }

    // Check if this is a follow-up question click (should trigger immediate action)
    const isFollowUpQuestion = sessionContext && 
      (sessionContext.destination || sessionContext.dates || sessionContext.budget) &&
      message.toLowerCase().includes('would you like') || 
      message.toLowerCase().includes('are you interested') ||
      message.toLowerCase().includes('nightlife') ||
      message.toLowerCase().includes('water sports') ||
      message.toLowerCase().includes('boat tours');

    // Create enhanced system prompt for detailed itinerary responses with session context
    let contextPrompt = '';
    if (sessionContext && (sessionContext.destination || sessionContext.dates || sessionContext.budget)) {
      contextPrompt = `\n\nIMPORTANT CONVERSATION CONTEXT:
Previous conversation context for this session:
- Destination: ${sessionContext.destination || 'Not specified'}
- Dates: ${sessionContext.dates || 'Not specified'}  
- Budget: ${sessionContext.budget || 'Not specified'}
- Trip Type: ${sessionContext.trip_type || 'Not specified'}

${isFollowUpQuestion ? 
  'This is a follow-up question from a suggestion button. Provide an immediate, natural confirmation (like "Perfect! Here are some great nightlife spots in [destination]...") followed immediately by specific recommendations in the simple response format.' :
  'Since this is a follow-up question in an ongoing conversation, use this context to provide a relevant answer. DO NOT ask for the destination again if it\'s already known from the context above.'
}`;
    }

    const systemPrompt = `You are Keila, an AI travel planning assistant. Your primary goal is to provide detailed, actionable, and insightful travel recommendations.

CRITICAL BEHAVIOR: 
- If the user provides a simple greeting like "hello", "hi", "hey" without any travel context, respond with a friendly greeting and ask them where they'd like to travel or what kind of trip they're planning.
- Only create detailed itineraries when the user clearly indicates a destination or travel intent.
- NEVER repeat the user's question back to them as a confirmation.
- Your primary goal is to provide a detailed, helpful answer immediately in the requested JSON format.${contextPrompt}

PERSONA ACTIVATION RULES:
When a user provides ANY DESTINATION (with or without dates/budget), you MUST activate the "Itinerary Planner" persona and provide the DETAILED JSON FORMAT below. This ensures users get comprehensive, rich itineraries immediately.

SIMPLE GREETING HANDLING:
For simple greetings without travel context, use this simple JSON format:
{
  "title": "Welcome to Keila - Your AI Travel Assistant",
  "summary": "Hello! I'm Keila, your personal AI travel assistant. I'd love to help you plan an amazing trip! Where would you like to go, or what kind of travel experience are you looking for?",
  "recommendations": [],
  "actionable_suggestions": ["Tell me your dream destination", "Let me know your budget range", "Share what type of trip you want (romantic, adventure, family, etc.)"],
  "follow_up_questions": ["Where would you like to travel?", "What's your ideal vacation like?", "Do you have a specific destination in mind?"]
}

PERSONA: The "Itinerary Planner" Expert
Create GENERAL INTEREST itineraries that appeal to a broad audience unless the user specifically requests a theme (e.g., "family-friendly," "nightlife focused," "cultural trip," "food tour"). Provide balanced recommendations with:
- Day-by-Day Suggested Itinerary highlighting popular attractions, cultural landmarks, and diverse activities
- Dining Recommendations with THREE distinct categories: Fine Dining, Budget-Friendly Local Favorites, and Family-Friendly options
- Family & Kids' Activities including interactive museums, local movie theaters, large parks/playgrounds, and attractions suitable for children of various ages
- Cultural Hotspots including museums, galleries, historic sites, and entertainment venues
- Shopping Recommendations including malls, outlets, and local markets
- Free Activities including parks, public spaces, and no-cost attractions
- Getting Around with specific transportation options and local guidance
- Safety Tips and practical travel advice for that location

YOUR RESPONSE MUST ALWAYS BE A SINGLE, VALID JSON OBJECT with this EXACT structure:
{
  "title": "X-day itinerary for [destination]",
  "summary": "A brief overview like 'Here is a X-day itinerary for your trip to [destination], packed with iconic sights, cultural hotspots, and fun activities!'",
  "recommendations": [
    {
      "category_name": "Day 1",
      "places": [
        {
          "name": "Specific Place/Activity Name",
          "description": "Detailed description of the place and what to expect",
          "type": "Museum" | "Restaurant" | "Park" | "Activity" | "Hotel" | etc,
          "image_url": "https://example.com/image.jpg (use a real, accessible image URL if possible)",
          "location": "Address or general location",
          "rating": 4.5,
          "price_range": "$" | "$$" | "$$$" | "$$$$",
          "estimated_cost": "~$25/person" | "~$129/ticket" | "$25-$40 entrees",
          "booking_url": "VERIFIED_LINK_ONLY" (CRITICAL: NEVER generate URLs - only use verified links from Google Places API. If no verified website available, use Google Maps link format: "https://www.google.com/maps/place/[Place+Name]/[coordinates]")
        }
      ]
    },
    {
      "category_name": "Day 2",
      "places": [
        {
          "name": "Place Name",
          "description": "Description including what makes it special and visit details",
          "type": "Activity" | "Restaurant" | "Cultural Site" | etc,
          "image_url": "https://example.com/image.jpg",
          "location": "Neighborhood/Area",
          "rating": 4.3,
          "price_range": "$$"
        }
      ]
    },
    {
      "category_name": "Fine Dining",
      "places": [
        {
          "name": "Upscale Restaurant Name",
          "description": "Description of cuisine, atmosphere, and signature dishes",
          "type": "Restaurant",
          "image_url": "https://example.com/image.jpg",
          "location": "District/Area",
          "rating": 4.7,
          "price_range": "$$$",
          "estimated_cost": "$50-$80 per person",
           "booking_url": "VERIFIED_LINK_ONLY" (use verified website URL from Google Places API or Google Maps link)
        }
      ]
    },
    {
      "category_name": "Budget-Friendly Local Favorites",
      "places": [
        {
          "name": "Local Favorite Name",
          "description": "Popular local spot with authentic cuisine and great value",
          "type": "Restaurant",
          "image_url": "https://example.com/image.jpg",
          "location": "District/Area",
          "rating": 4.4,
          "price_range": "$",
          "estimated_cost": "$12-$20 per person",
          "booking_url": "VERIFIED_LINK_ONLY" (use verified website URL from Google Places API or Google Maps link)
        }
      ]
    },
    {
      "category_name": "Family-Friendly Dining",
      "places": [
        {
          "name": "Family Restaurant Name",
          "description": "Great for families with kids, casual atmosphere",
          "type": "Restaurant",
          "image_url": "https://example.com/image.jpg",
          "location": "District/Area",
          "rating": 4.3,
          "price_range": "$$",
          "estimated_cost": "$15-$25 per person",
          "booking_url": "VERIFIED_LINK_ONLY" (use verified website URL from Google Places API or Google Maps link)
        }
      ]
    },
    {
      "category_name": "Family & Kids' Activities",
      "places": [
        {
          "name": "Family Activity Name",
          "description": "Description of interactive museums, movie theaters, parks, playgrounds, or kid-friendly attractions",
          "type": "Family Activity" | "Museum" | "Entertainment" | "Park",
          "image_url": "https://example.com/image.jpg",
          "location": "Family District/Area",
          "rating": 4.5,
          "price_range": "$" | "$$",
          "estimated_cost": "~$15/child, ~$20/adult",
          "booking_url": "VERIFIED_LINK_ONLY" (use verified website URL from Google Places API or Google Maps link)
        }
      ]
    },
    {
      "category_name": "Cultural Attractions",
      "places": [
        {
          "name": "Museum/Site Name", 
          "description": "Description of exhibits, significance, and visitor information",
          "type": "Museum" | "Cultural Site" | "Gallery",
          "image_url": "https://example.com/image.jpg",
          "location": "Cultural District",
          "rating": 4.4,
          "price_range": "$$",
          "estimated_cost": "~$25/adult ticket",
          "booking_url": "VERIFIED_LINK_ONLY" (use verified website URL from Google Places API or Google Maps link)
        }
      ]
    },
    {
      "category_name": "Shopping Recommendations", 
      "places": [
        {
          "name": "Shopping Center/Mall Name",
          "description": "Description of shopping options, brands, and atmosphere",
          "type": "Shopping",
          "image_url": "https://example.com/image.jpg",
          "location": "Shopping District",
          "rating": 4.2,
          "price_range": "$$",
          "estimated_cost": "Varies by store",
          "booking_url": "VERIFIED_LINK_ONLY" (use verified website URL from Google Places API or Google Maps link)
        }
      ]
    },
    {
      "category_name": "Free Activities",
      "places": [
        {
          "name": "Park/Public Space Name",
          "description": "Description of free attractions and activities available",
          "type": "Park" | "Public Space",
          "image_url": "https://example.com/image.jpg", 
          "location": "Area/District",
          "rating": 4.3,
          "price_range": "Free",
          "estimated_cost": "Free",
          "booking_url": ""
        }
      ]
    },
    {
      "category_name": "Getting Around",
      "places": [
        {
          "name": "Transportation Options",
          "description": "Recommended transportation methods including public transit, ride-sharing, rental cars, and walking",
          "type": "Transportation",
          "image_url": "",
          "location": "City-wide",
          "rating": 0,
          "price_range": "$",
          "estimated_cost": "Varies by method",
          "booking_url": ""
        }
      ]
    }
  ],
  "actionable_suggestions": [
    "Practical travel tip 1 for the destination",
    "Transportation and logistics tip",
    "Local etiquette or safety advice"
  ],
  "follow_up_questions": [
    "What specific cuisine would you like to try?",
    "Are you interested in nightlife recommendations?",
    "Would you like more details about any particular day?"
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
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
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
      
      // Store or update session context when we have a detailed itinerary
      if (sessionId && (tripDetails.destination || tripDetails.dates || tripDetails.budget)) {
        console.log('AI Travel Chat - Storing session context for future use');
        
        const sessionData = {
          session_id: sessionId,
          destination: tripDetails.destination || sessionContext?.destination,
          dates: tripDetails.dates || sessionContext?.dates,
          budget: tripDetails.budget || sessionContext?.budget,
          context: {
            last_itinerary: parsedResponse,
            conversation_history: [message]
          },
          last_activity_at: new Date().toISOString()
        };

        if (sessionContext) {
          // Update existing session
          await supabase
            .from('chat_sessions')
            .update(sessionData)
            .eq('session_id', sessionId);
        } else {
          // Create new session
          await supabase
            .from('chat_sessions')
            .insert(sessionData);
        }
      }
      
      // Enhanced detailed response with Expedia affiliate links integration
      const detailedResponse = {
        response: parsedResponse.summary,
        showMap: tripDetails.destination ? true : false,
        mapLocation: tripDetails.destination || null,
        tripCards: [],
        quickReplies: parsedResponse.follow_up_questions || [],
        recommendations: [],
        callsToAction: [],
        detailedItinerary: await enhanceItineraryWithAffiliateLinks({
          title: parsedResponse.title,
          summary: parsedResponse.summary,
          recommendations: parsedResponse.recommendations,
          actionable_suggestions: parsedResponse.actionable_suggestions,
          follow_up_questions: parsedResponse.follow_up_questions
        }, tripDetails.destination, supabase),
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

// Function to enhance itinerary with Expedia affiliate links
async function enhanceItineraryWithAffiliateLinks(itinerary: any, destination: string, supabase: any) {
  console.log('AI Travel Chat - Enhancing itinerary with affiliate links for destination:', destination);
  
  // Create enhanced recommendations with affiliate booking URLs
  const enhancedRecommendations = await Promise.all(
    itinerary.recommendations.map(async (category: any) => {
      // Only add affiliate links for hotel/restaurant categories
      const isBookableCategory = ['hotel', 'restaurant', 'dining', 'accommodation'].some(type => 
        category.category_name.toLowerCase().includes(type) ||
        category.places?.some((place: any) => place.type?.toLowerCase().includes(type))
      );

      if (!isBookableCategory) {
        return category;
      }

      const enhancedPlaces = await Promise.all(
        category.places.map(async (place: any) => {
          // Only add affiliate links for hotels and restaurants
          const isHotelOrRestaurant = ['hotel', 'restaurant', 'accommodation', 'dining'].some(type =>
            place.type?.toLowerCase().includes(type)
          );

          if (!isHotelOrRestaurant) {
            return place;
          }

          try {
            console.log(`AI Travel Chat - Getting Expedia link for: ${place.name} in ${destination}`);
            
            // Call our Expedia hotel lookup function
            const { data: expediaData, error } = await supabase.functions.invoke('expedia-hotel-lookup', {
              body: {
                hotelName: place.name,
                destination: destination
              }
            });

            if (error) {
              console.error('AI Travel Chat - Error calling expedia-hotel-lookup:', error);
              return place;
            }

            if (expediaData && expediaData.bookingUrl) {
              console.log(`AI Travel Chat - Successfully got Expedia affiliate link for ${place.name}`);
              return {
                ...place,
                booking_url: expediaData.bookingUrl,
                // Also update image if Expedia provides a better one
                image_url: expediaData.imageUrl || place.image_url,
                // Update pricing info if available
                estimated_cost: expediaData.price || place.estimated_cost
              };
            }

            return place;
          } catch (error) {
            console.error(`AI Travel Chat - Error enhancing ${place.name} with affiliate link:`, error);
            return place;
          }
        })
      );

      return {
        ...category,
        places: enhancedPlaces
      };
    })
  );

  return {
    ...itinerary,
    recommendations: enhancedRecommendations
  };
}
