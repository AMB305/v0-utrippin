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
    const { message, userId, conversationHistory = [] } = await req.json();

    // Add Supabase client for user data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create user conversation memory
    let conversationMemory = null;
    let storedExtractedInfo = {};
    
    if (userId) {
      const { data: existingConversation } = await supabase
        .from('user_conversations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingConversation) {
        conversationMemory = existingConversation;
        storedExtractedInfo = existingConversation.extracted_info || {};
      }
    }

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
          .maybeSingle();
        
        // Get travel preferences
        const { data: preferences } = await supabase
          .from('travel_preferences')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
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

    // Use stored memory + current conversation for extraction
    const storedMessages = conversationMemory?.messages || [];
    const allMessageHistory = [...storedMessages, ...conversationHistory.map(msg => ({ role: 'user', content: msg.question }), { role: 'assistant', content: msg.response }).flat(), { role: 'user', content: message }];
    const allMessages = allMessageHistory.map(msg => msg.content).join('\n\n');
    
    // Smart information extraction - merge with stored info
    const extractedInfo = {
      destination: storedExtractedInfo.destination || null,
      dates: storedExtractedInfo.dates || null,
      duration: storedExtractedInfo.duration || null,
      budget: storedExtractedInfo.budget || null,
      travelers: storedExtractedInfo.travelers || null,
      preferences: storedExtractedInfo.preferences || []
    };

    // Extract destination - Enhanced patterns with known locations
    const knownLocations = ['paris', 'tokyo', 'cancun', 'london', 'barcelona', 'dubai', 'japan', 'colombia', 'italy', 'spain', 'greece', 'thailand', 'bali', 'mexico', 'miami', 'new york', 'los angeles'];
    const destinationMatch = allMessages.toLowerCase().match(/(?:to|visit|go to|travel to|trip to)\s+([a-z\s,]+?)(?:\s+with|\s|$|for|in|during)/i) ||
                           allMessages.match(/(japan|colombia?|paris|london|italy|spain|greece|thailand|bali|tokyo|mexico|[a-z]{3,})/i);
    const cityMatch = knownLocations.find(loc => allMessages.toLowerCase().includes(loc));
    const fallbackDestination = null; // do not assume destination if uncertain
    
    if (!extractedInfo.destination) {
      if (cityMatch) {
        extractedInfo.destination = cityMatch;
      } else if (destinationMatch) {
        extractedInfo.destination = destinationMatch[1]?.trim() || fallbackDestination;
      }
    }

    // Extract dates and duration - Improved detection
    const durationMatch = allMessages.match(/(\d+)[-\s]*(days?|nights?)/i);
    const tripDuration = durationMatch ? parseInt(durationMatch[1]) : null;
    if (durationMatch && !extractedInfo.duration) {
      extractedInfo.duration = durationMatch[0];
    }
    
    const dateMatch = allMessages.match(/(aug|august|sep|september|oct|october|nov|november|dec|december|jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july)\s*(\d{1,2})?(?:\s*-\s*(\d{1,2}))?/i);
    if (dateMatch && !extractedInfo.dates) {
      extractedInfo.dates = dateMatch[0];
    }

    // Extract budget - Enhanced to catch various formats
    const budgetMatch = allMessages.match(/\$(\d+(?:,\d{3})*)/) || 
                       allMessages.match(/(?:I have|budget of?|around|about)\s*\$?(\d+(?:,\d{3})*)/i) ||
                       allMessages.match(/(\d+(?:,\d{3})*)\s*(?:dollars?|usd|budget)/i) ||
                       allMessages.match(/\b(\d{3,5})\b/); // Fallback for standalone numbers like "2000"
    if (budgetMatch && !extractedInfo.budget) {
      const amount = budgetMatch[1] || budgetMatch[0];
      extractedInfo.budget = amount.includes('$') ? amount : `$${amount}`;
    }

    // Extract traveler info - Improved detection
    if (!extractedInfo.travelers) {
      if (allMessages.match(/(alone|myself|solo)/i)) extractedInfo.travelers = 'solo';
      else if (allMessages.match(/(wife|husband|partner|girlfriend|boyfriend)/i)) extractedInfo.travelers = 'couple';
      else if (allMessages.match(/(family|kids|children)/i)) extractedInfo.travelers = 'family';
    }

    // Build conversation context
    let conversationContext = '';
    if (allMessageHistory.length > 0) {
      conversationContext = `
**CONVERSATION HISTORY:**
${allMessageHistory.slice(-10).map(msg => `${msg.role === 'user' ? 'User' : 'Keila'}: ${msg.content}`).join('\n\n')}

**EXTRACTED INFORMATION SO FAR:**
- Destination: ${extractedInfo.destination || 'Not specified'}
- Duration: ${extractedInfo.duration || 'Not specified'}  
- Dates: ${extractedInfo.dates || 'Not specified'}
- Budget: ${extractedInfo.budget || 'Not specified'}
- Travelers: ${extractedInfo.travelers || 'Not specified'}

**CRITICAL: DO NOT ask about information already provided above. NEVER repeat questions about details the user has already shared.**
`;
    }

    // Ensure trip duration OR date is known before attempting itinerary
    const hasDatesOrDuration = extractedInfo.duration || extractedInfo.dates;
    const hasEnoughInfo = extractedInfo.destination && extractedInfo.budget && hasDatesOrDuration;

    const systemPrompt = `You are Keila, an expert AI travel agent that creates comprehensive, visually rich travel itineraries and engages in intelligent conversation. You MUST respond with a single, valid JSON object and nothing else.

    **NEW MODE**: Answer direct travel-related questions directly, THEN ask about trip planning if relevant.
    If a user asks "What are the best beaches in Greece?" answer directly, THEN ask about trip planning.
    Use JSON format always. Return follow-up quick replies if relevant.

    ${personalizationContext}
    ${conversationContext}

    **CRITICAL INSTRUCTIONS:**
    1. **CONVERSATION MEMORY**: You can see the full conversation history above. NEVER ask about information already provided.
    2. **INFORMATION DETECTION**: If user has provided destination, budget, and dates/duration, CREATE AN ITINERARY immediately.
    3. **SMART QUESTIONING**: Only ask for missing information, never repeat previous questions.
    4. **EXAMPLES OF SUFFICIENT INFO**: 
       - "Japan, 3 days, $2000, solo" = CREATE ITINERARY
       - "Tokyo August 1-3 for couple" = Ask only about budget
       - "somewhere warm" = Ask about destination, dates, budget
    5. **Your response MUST be either COMPREHENSIVE_ITINERARY_SCHEMA or INTELLIGENT_QUESTIONING_SCHEMA**
    6. **All booking links MUST use Expedia with camref=1101l5dQSW for affiliate tracking.**

    **SUFFICIENT INFO CHECK**: ${hasEnoughInfo ? 'USER HAS PROVIDED SUFFICIENT INFO - CREATE ITINERARY NOW' : 'More info needed - ask smart questions'}

    **INTELLIGENT QUESTIONING GUIDELINES:**
    - Analyze what the user DID provide and acknowledge it
    - Ask 2-3 specific questions that build toward comprehensive planning
    - Include destination clarification if ambiguous (e.g., "Columbia" could be SC or Colombia)
    - Ask about travel companions, style preferences, and must-do activities
    - Use engaging, conversational tone with emojis
    - Show expertise by mentioning relevant seasonal considerations or local highlights

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
              "bookingLink": "https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:ORIGIN,to:DESTINATION,departure:DATE&passengers=adults:2&camref=1101l5dQSW",
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
              "bookingLink": "https://www.expedia.com/Hotel-Search?destination=DESTINATION&startDate=CHECKIN&endDate=CHECKOUT&adults=2&camref=1101l5dQSW",
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

    **INTELLIGENT_QUESTIONING_SCHEMA:**
    {
      "response": "Engaging response that acknowledges what the user provided and asks 2-3 specific follow-up questions with emojis and expert insights",
      "quickReplies": ["Specific quick reply option 1", "Specific quick reply option 2", "Specific quick reply option 3"],
      "showMap": false,
      "mapLocation": null
    }

    **EXAMPLES OF INTELLIGENT RESPONSES:**

    For "plan a trip to columbia aug 1-3":
    {
      "response": "A trip to Columbia from August 1-3 sounds exciting! 🌟 I want to make sure I plan the perfect getaway for you. A few quick questions:\n\n🗺️ Just to confirm - are you thinking Columbia, South Carolina, or did you mean Colombia, South America?\n👥 Who's joining you on this adventure?\n🎯 What's drawing you there - are you after outdoor activities, cultural experiences, great food, or maybe a mix of everything?\n\nOnce I know a bit more about your travel style, I can create an amazing 3-day itinerary with specific recommendations, timing, and booking options!",
      "quickReplies": ["Columbia, South Carolina", "Colombia, South America", "Solo traveler looking for adventure"]
    }

    For "I want to go somewhere warm":
    {
      "response": "I love helping people escape to warm, sunny destinations! ☀️ Let me ask a few questions to find your perfect warm-weather getaway:\n\n🗓️ When are you planning to travel? This helps me recommend the best destinations for that time of year.\n✈️ How far are you willing to travel - thinking domestic US, Caribbean, or maybe somewhere more exotic?\n🏖️ Are you dreaming of beaches, or would you also consider warm desert destinations or tropical cities?\n💰 What's your rough budget range per person?\n\nWith these details, I can suggest some incredible warm destinations and create a detailed itinerary!",
      "quickReplies": ["Beach vacation in Caribbean", "Warm US destination", "I have 2 weeks and flexible budget"]
    }
    
    **IMPORTANT FAILSAFE:**
    - Never ask the same question twice if the user has already answered it.
    - Always return valid JSON with either a 'response' and 'quickReplies', or a full 'comprehensiveItinerary' object.
    - Never include markdown, HTML, or plain text outside of the JSON block.
    `;

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
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        max_tokens: 8000,
        temperature: 0.7,
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
      const lastBrace = messageContent.lastIndexOf('}');
      const fixedJson = messageContent.slice(0, lastBrace + 1);
      parsedJson = JSON.parse(fixedJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Raw content (first 1000 chars):', messageContent.substring(0, 1000));
      
      // Fallback with intelligent response
      return new Response(JSON.stringify({
        isDetailedItinerary: false,
        response: "I need just a bit more info to complete your trip plan. Could you confirm your destination or dates?",
        quickReplies: ["📍 Paris", "📅 Next Month", "💰 Budget: $2000"]
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Update conversation memory with new message and extracted info
    if (userId) {
      const newMessages = [...(conversationMemory?.messages || []), { role: 'user', content: message }, { role: 'assistant', content: messageContent }];
      
      if (conversationMemory) {
        // Update existing conversation
        await supabase
          .from('user_conversations')
          .update({
            messages: newMessages,
            extracted_info: extractedInfo,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationMemory.id);
      } else {
        // Create new conversation
        await supabase
          .from('user_conversations')
          .insert({
            user_id: userId,
            messages: newMessages,
            extracted_info: extractedInfo
          });
      }
    }

    // Validate against schemas with improved fallback
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
    
    // Enhanced fallback for structured responses
    if (parsedJson.response || parsedJson.quickReplies) {
      return new Response(JSON.stringify({
        isDetailedItinerary: false,
        response: parsedJson.response || "I'd love to help you plan your trip! Let me ask a few questions.",
        quickReplies: parsedJson.quickReplies || ["📍 Choose destination", "📅 Pick dates", "💰 Set budget"],
        showMap: parsedJson.showMap || false,
        mapLocation: parsedJson.mapLocation || null
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Final fallback
    return new Response(JSON.stringify({ 
      isDetailedItinerary: false, 
      response: "I need just a bit more info to complete your trip plan. Could you confirm your destination or dates?",
      quickReplies: ["📍 Paris", "📅 Next Month", "💰 Budget: $2000"]
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Edge Function Error:', error.message);
    
    // Smart fallback with intelligent questioning
    const smartFallback = {
      isDetailedItinerary: false,
      response: "I'd love to help you plan an amazing trip! ✈️ Let me ask a few questions to get started:\n\n🗺️ Where are you thinking of traveling?\n📅 When are you planning to go?\n👥 Who's traveling with you?\n\nOnce I have these details, I can create a personalized itinerary just for you!",
      quickReplies: ["Plan a weekend getaway", "International vacation", "Family trip"]
    };
    
    return new Response(JSON.stringify(smartFallback), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});