
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

    // Enhanced context inference from user prompt
    const inferUserContext = (prompt: string) => {
      const text = prompt.toLowerCase();
      
      // Family trip detection
      const isFamilyTrip = /kid|child|family|children|toddler|mom|dad|parent|baby|infant|us with kids|family-friendly|playground/i.test(prompt);
      
      // Couples trip detection  
      const isCouplesTrip = /romantic|getaway with wife|getaway with husband|honeymoon|couple|partner|date night|anniversary|romantic dinner|intimate/i.test(prompt);
      
      // Group trip detection
      const isGroupTrip = /\bus\b|group of|we\b|our trip|friends|gang|crew|squad|party of|together with/i.test(prompt);
      
      // Solo trip detection
      const isSoloTrip = /\bi\b|myself|solo|alone|individual|personal|just me/i.test(prompt);
      
      // Adventure/activity preferences
      const isAdventureTrip = /adventure|hiking|extreme|thrill|adrenaline|climbing|safari|diving|surfing/i.test(prompt);
      const isRelaxationTrip = /relax|spa|peaceful|quiet|calm|beach|resort|unwind|chill/i.test(prompt);
      const isCulturalTrip = /culture|museum|history|heritage|local|traditional|art|historic/i.test(prompt);
      const isFoodTrip = /food|cuisine|culinary|restaurant|local food|street food|dining|cooking|gastronomy/i.test(prompt);
      
      // Budget indicators
      const isBudgetTrip = /budget|cheap|affordable|economical|low cost|save money|inexpensive/i.test(prompt);
      const isLuxuryTrip = /luxury|high-end|premium|upscale|fancy|expensive|5-star|first class/i.test(prompt);
      
      const travelerContext = isFamilyTrip
        ? 'a family with kids'
        : isCouplesTrip
          ? 'a couple seeking romance'
          : isGroupTrip
            ? 'a group of friends'
            : isSoloTrip
              ? 'a solo traveler'
              : 'travelers';
              
      const travelStyle = isAdventureTrip
        ? 'adventure'
        : isRelaxationTrip
          ? 'relaxation'
          : isCulturalTrip
            ? 'cultural'
            : isFoodTrip
              ? 'food-focused'
              : 'general interest';
              
      const budgetLevel = isBudgetTrip
        ? 'budget-conscious'
        : isLuxuryTrip
          ? 'luxury'
          : 'mid-range';
          
      return {
        travelerContext,
        travelStyle,
        budgetLevel,
        isFamilyTrip,
        isCouplesTrip,
        isGroupTrip,
        isSoloTrip,
        isAdventureTrip,
        isRelaxationTrip,
        isCulturalTrip,
        isFoodTrip,
        isBudgetTrip,
        isLuxuryTrip
      };
    };

    const userContext = inferUserContext(message);
    console.log('AI Travel Chat - Inferred user context:', userContext);

    // Check if this is a vague request that needs clarification
    const isVagueRequest = (msg: string, details: any, context: any) => {
      const lowerMsg = msg.toLowerCase();
      
      // Check for greetings without travel context
      if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))\s*[!.]*$/i.test(msg.trim())) {
        return true;
      }
      
      // If we have clear destination AND context (family/couple/etc), don't ask for clarification
      if (details.destination && (context.isFamilyTrip || context.isCouplesTrip || context.isGroupTrip || context.isSoloTrip)) {
        return false;
      }
      
      // Check for vague destination requests like "Columbia" that could be multiple places
      if (details.destination) {
        const ambiguousDestinations = ['columbia', 'paris', 'london', 'georgia', 'florence'];
        if (ambiguousDestinations.some(dest => details.destination.toLowerCase().includes(dest))) {
          return true;
        }
      }
      
      // Check for requests missing key details (but not if we have good context)
      if (details.destination && (!details.dates && !details.budget) && !context.travelerContext) {
        return true;
      }
      
      return false;
    };

    // Handle vague requests with clarifying questions
    if (isVagueRequest(message, tripDetails, userContext)) {
      const clarifyingResponse = {
        response: tripDetails.destination 
          ? `I'd love to help you plan a trip to ${tripDetails.destination}! To create the perfect itinerary, could you tell me:\n\n• When would you like to travel?\n• How many days are you planning?\n• What's your approximate budget?\n• Are you traveling solo, as a couple, or with family?`
          : "Hello! I'm Keila, your AI travel assistant. I'd love to help you plan an amazing trip! Where would you like to go, and when are you thinking of traveling?",
        quickReplies: tripDetails.destination 
          ? ["1-3 days", "4-7 days", "1-2 weeks", "Budget-friendly", "Mid-range", "Luxury"]
          : ["Plan a weekend getaway", "Plan a week-long vacation", "Inspire me with destinations", "Budget-friendly trip", "Luxury travel"],
        callsToAction: [
          { text: "Get Trip Inspiration", action: "CONTINUE_CHAT" },
          { text: "Popular Destinations", action: "CONTINUE_CHAT" }
        ]
      };
      
      return new Response(JSON.stringify(clarifyingResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

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

    // Build dynamic system prompt based on inferred context
    let contextualPrompt = '';
    if (userContext.travelerContext !== 'travelers') {
      contextualPrompt += `\n\nIMPORTANT USER CONTEXT: This request is for ${userContext.travelerContext}. `;
      
      if (userContext.isFamilyTrip) {
        contextualPrompt += 'Focus heavily on family-friendly activities, kid-safe locations, playgrounds, interactive museums, easy walkability, and family restaurants. Include safety tips for traveling with children.';
      } else if (userContext.isCouplesTrip) {
        contextualPrompt += 'Focus on romantic experiences, intimate dining, sunset spots, couples activities, and romantic accommodations. Avoid large group activities.';
      } else if (userContext.isGroupTrip) {
        contextualPrompt += 'Focus on group-friendly activities, nightlife, larger venues, group dining options, and activities that work well for multiple people.';
      } else if (userContext.isSoloTrip) {
        contextualPrompt += 'Focus on solo-friendly activities, safe areas for solo travelers, social opportunities to meet people, and independent exploration options.';
      }
    }
    
    if (userContext.travelStyle !== 'general interest') {
      contextualPrompt += `\n\nTRAVEL STYLE: This is an ${userContext.travelStyle} trip. `;
      
      if (userContext.isAdventureTrip) {
        contextualPrompt += 'Prioritize outdoor activities, hiking, water sports, adventure tours, and active experiences.';
      } else if (userContext.isRelaxationTrip) {
        contextualPrompt += 'Prioritize beaches, spas, peaceful locations, resorts, and low-key activities.';
      } else if (userContext.isCulturalTrip) {
        contextualPrompt += 'Prioritize museums, historical sites, cultural experiences, local traditions, and educational activities.';
      } else if (userContext.isFoodTrip) {
        contextualPrompt += 'Prioritize local cuisine, food tours, cooking classes, markets, and unique dining experiences.';
      }
    }
    
    if (userContext.budgetLevel !== 'mid-range') {
      contextualPrompt += `\n\nBUDGET CONTEXT: This is a ${userContext.budgetLevel} trip. `;
      
      if (userContext.isBudgetTrip) {
        contextualPrompt += 'Focus on free activities, budget accommodations, local transportation, street food, and money-saving tips.';
      } else if (userContext.isLuxuryTrip) {
        contextualPrompt += 'Focus on high-end accommodations, fine dining, premium experiences, private tours, and luxury services.';
      }
    }

    const systemPrompt = `You are Keila, an AI travel planning assistant. 

CRITICAL JSON RESPONSE RULE: 
You MUST respond with VALID JSON ONLY. NO explanatory text before or after. NO conversational text outside the JSON structure.

RESPONSE FORMAT RULES:
- For travel planning requests with destinations, return the complete structured itinerary JSON below
- For simple greetings without destinations, return the simple JSON format  
- NEVER include text like "For a detailed insight..." or explanations outside JSON
- START your response with { and END with }${contextPrompt}${contextualPrompt}

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
Create itineraries that match the user's inferred context and preferences. Provide balanced recommendations with:
- Day-by-Day Suggested Itinerary highlighting attractions and activities suited to the traveler type
- Dining Recommendations appropriate for the travel style and group type
- Transportation guidance suitable for the traveler context
- Activities and experiences matching the inferred preferences
- Safety tips and practical advice relevant to the trip type

YOUR RESPONSE MUST ALWAYS BE A SINGLE, VALID JSON OBJECT with this EXACT structure:
{
  "destination": "[City, Country]",
  "dates": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "travelers": {
    "count": 2,
    "rooms": 1,
    "isFamilyTrip": false
  },
  "overview": {
    "title": "X-Day [Destination] Adventure",
    "summary": "Perfect overview of the trip highlighting main themes and experiences"
  },
  "themes": ["Beach", "Culture", "Family-friendly", "Nightlife", "Walkable", "Parks & Rec"],
  "images": ["https://example.com/hero.jpg", "https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "transportation": {
    "arrival": "[Airport/Station]",
    "local": ["Hotel Shuttle", "Bike Rentals", "Public Bus"],
    "walkabilityScore": 85
  },
  "flights": [
    {
      "airline": "American Airlines",
      "from": "JFK",
      "to": "CUN",
      "duration": "4h 50m",
      "price": "$349",
      "departure": "Aug 1 - 07:00",
      "arrival": "Aug 1 - 10:50"
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "pricePerNight": "$85",
      "rating": "4.2",
      "location": "Near Hotel Zone",
      "amenities": ["Pool", "Family Room", "Free Shuttle"],
      "link": "https://booking.utrippin.ai/hotel"
    }
  ],
  "days": [
    {
      "day": "Day 1",
      "date": "YYYY-MM-DD",
      "title": "Arrival + Beach Relaxation",
      "costEstimate": "$60",
      "morning": ["Activity 1", "Activity 2"],
      "afternoon": ["Activity 3", "Activity 4"],
      "evening": ["Activity 5", "Activity 6"]
    }
  ],
  "culture_tips": {
    "Tipping Etiquette": "10-15% is appreciated but not mandatory",
    "Dining Customs": "Lunch is the largest meal",
    "Public Behavior": "Casual attire is fine in tourist areas",
    "Language Tips": "Basic Spanish phrases go a long way",
    "Beach Etiquette": "Use reef-safe sunscreen"
  },
  "sources": ["TripAdvisor", "Booking.com", "Google Maps"],
  "buttons": ["Book Flights", "Book Hotels", "Add Travel Buddy", "View on Map"]
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

    // Strict schema validation - no fallbacks allowed
    if (parsedResponse.destination && parsedResponse.overview && parsedResponse.days) {
      console.log('AI Travel Chat - Detected structured itinerary response');
      
      // Validate complete schema
      const requiredFields = ['destination', 'dates', 'travelers', 'overview', 'themes', 'images', 'transportation', 'flights', 'hotels', 'days', 'culture_tips', 'sources', 'buttons'];
      const missingFields = requiredFields.filter(field => !parsedResponse[field]);
      
      if (missingFields.length > 0) {
        console.error('AI Travel Chat - Schema validation failed. Missing fields:', missingFields);
        return new Response(JSON.stringify({
          error: "Keila failed to return a complete itinerary. Please try again.",
          missingFields: missingFields
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Store session context
      if (sessionId && (tripDetails.destination || tripDetails.dates || tripDetails.budget)) {
        const sessionData = {
          session_id: sessionId,
          destination: tripDetails.destination || sessionContext?.destination,
          dates: tripDetails.dates || sessionContext?.dates,
          budget: tripDetails.budget || sessionContext?.budget,
          context: { last_itinerary: parsedResponse },
          last_activity_at: new Date().toISOString()
        };

        if (sessionContext) {
          await supabase.from('chat_sessions').update(sessionData).eq('session_id', sessionId);
        } else {
          await supabase.from('chat_sessions').insert(sessionData);
        }
      }
      
      const structuredResponse = {
        response: parsedResponse.overview.summary,
        showMap: true,
        mapLocation: parsedResponse.destination,
        tripCards: [],
        quickReplies: parsedResponse.buttons || [],
        recommendations: [],
        callsToAction: [
          { text: "Book Flights", action: "book_flights" },
          { text: "Find Hotels", action: "book_hotels" },
          { text: "Add Travel Buddy", action: "add_buddy" }
        ],
        detailedItinerary: {
          title: parsedResponse.overview.title,
          summary: parsedResponse.overview.summary,
          days: parsedResponse.days.map((day: any) => ({
            day: day.day,
            activities: [
              ...(day.morning || []),
              ...(day.afternoon || []),
              ...(day.evening || [])
            ]
          })),
          actionable_suggestions: Object.values(parsedResponse.culture_tips || {}),
          follow_up_questions: [
            "Tell me more about nightlife",
            "What are the best family activities?", 
            "Show me local restaurants",
            "What's the transportation like?"
          ]
        },
        isDetailedItinerary: true
      };
      
      return new Response(JSON.stringify(structuredResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // For non-itinerary responses (greetings, clarifications)
    if (parsedResponse.response) {
      return new Response(JSON.stringify({
        response: parsedResponse.response,
        quickReplies: parsedResponse.quickReplies || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // If we get here, the AI failed to provide valid response
    console.error('AI Travel Chat - Invalid response structure');
    return new Response(JSON.stringify({
      error: "Keila failed to provide a valid response format. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('AI Travel Chat - Error occurred:', error);
    return new Response(JSON.stringify({
      error: "I'm having trouble processing your request right now. Please try again.",
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
