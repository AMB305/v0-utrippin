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
  totalEstimatedCost: z.string().optional(),
  niceToKnow: z.object({
    freeThingsToDo: z.array(z.string()),
    walkability: z.string(),
    transportation: z.string(),
    foodOptions: z.object({
      budget: z.string(),
      splurge: z.string()
    }),
    mallOptions: z.array(z.string()),
    kidsActivities: z.array(z.string()),
    nightlife: z.array(z.string()),
    bestBreakfast: z.string(),
    beaches: z.array(z.string()),
    bestCoffeeShop: z.string(),
    drugStores: z.array(z.string()),
    tours: z.array(z.string()),
    parks: z.array(z.string()),
    fishingSpots: z.array(z.string()),
    horsebackRiding: z.string(),
    sportingEvents: z.string(),
    groceryStores: z.array(z.string()),
    scenicRoutes: z.string(),
    hospital: z.string(),
    nailSalon: z.string()
  }).optional()
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

const CustomizationCallToActionSchema = z.object({
  title: z.string(),
  message: z.string(),
  quickReplies: z.array(z.string())
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
  }),
  customizationCallToAction: CustomizationCallToActionSchema.optional()
});

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { message: userPrompt, userId, conversationHistory = [] } = await req.json();
    
    if (!userPrompt) {
      console.error("No message provided in request body");
      return new Response(JSON.stringify({ error: "Sorry, something went wrong reading your message." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const message = userPrompt; // rename for clarity

    // Add Supabase client for user data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create user conversation memory
    let conversationMemory = null;
    let storedExtractedInfo = {};
    let retryCount = 0;
    
    if (userId) {
      const { data: existingConversation } = await supabase
        .from('user_conversations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingConversation) {
        conversationMemory = existingConversation;
        storedExtractedInfo = existingConversation.extracted_info || {};
        retryCount = existingConversation.retry_count || 0;
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
    
    // Fix conversation history handling
    const conversationHistoryFlat = conversationHistory.flatMap(chatMsg => [
      { role: 'user', content: chatMsg.question },
      ...(chatMsg.response ? [{ role: 'assistant', content: chatMsg.response }] : [])
    ]);
    
    const allMessageHistory = [
      ...storedMessages, 
      ...conversationHistoryFlat, 
      { role: 'user', content: message }
    ];
    
    const allMessages = allMessageHistory.map(msgItem => msgItem.content).join('\n\n');
    
    // Smart information extraction - merge with stored info
    const extractedInfo = {
      destination: storedExtractedInfo.destination || null,
      dates: storedExtractedInfo.dates || null,
      duration: storedExtractedInfo.duration || null,
      budget: storedExtractedInfo.budget || null,
      travelers: storedExtractedInfo.travelers || null,
      preferences: storedExtractedInfo.preferences || []
    };

    // Extract destination - Fixed to catch "Plan me a trip to Cancun"
    if (!extractedInfo.destination) {
      // First try to extract from trip-related phrases  
      const tripPattern = /(?:plan.*?trip to|trip to|go to|visit|travel to)\s+([a-zA-Z\s]+?)(?:\s+for|\s+in|\s+with|\s*\$|\s*\d|$)/i;
      const destinationMatch = allMessages.match(tripPattern);
      
      if (destinationMatch) {
        const dest = destinationMatch[1].trim();
        extractedInfo.destination = dest.charAt(0).toUpperCase() + dest.slice(1);
      } else {
        // Fallback to known locations
        const knownLocations = ['paris', 'tokyo', 'cancun', 'london', 'barcelona', 'dubai', 'japan', 'colombia', 'italy', 'spain', 'greece', 'thailand', 'bali', 'mexico', 'miami', 'new york', 'los angeles', 'rome', 'amsterdam', 'berlin', 'prague', 'budapest'];
        const cityMatch = knownLocations.find(loc => allMessages.toLowerCase().includes(loc));
        if (cityMatch) {
          extractedInfo.destination = cityMatch.charAt(0).toUpperCase() + cityMatch.slice(1);
        }
      }
    }

    // Extract dates and duration - Enhanced patterns
    if (!extractedInfo.duration) {
      // Expanded duration patterns to catch "for a week", "2 weeks", etc.
      const durationPatterns = [
        /\bfor\s+(\d{1,2})\s*(days?|weeks?)\b/gi,
        /\b(\d+)\s*(days?|weeks?)\b/gi,
        /\bfor\s+a\s+(week|month)\b/gi,
        /for\s+(\d+)\s+(days?|nights?|weeks?)/i,  // "for 5 days" - prioritize this pattern
        /(\d+)[-\s]*(days?|nights?|weeks?)/i      // "5 days" or "5-days"
      ];
      
      for (const pattern of durationPatterns) {
        const match = allMessages.match(pattern);
        if (match) {
          extractedInfo.duration = match[0];
          break;
        }
      }
    }
    
    if (!extractedInfo.dates) {
      const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const monthRegex = new RegExp(`\\b(${monthNames.join("|")})\\b`, "i");
      
      // Enhanced date patterns
      const datePatterns = [
        /(aug|august|sep|september|oct|october|nov|november|dec|december|jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july)\s*(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?/i,
        /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/,  // 8/1 or 8/1/24
        /(\d{1,2})[-–](\d{1,2})/  // 1-6 or 1–6
      ];
      
      // Check for month name mentions
      if (monthRegex.test(allMessages)) {
        const monthMatch = allMessages.match(monthRegex);
        if (monthMatch) {
          extractedInfo.dates = monthMatch[0];
        }
      } else {
        // Use existing patterns
        for (const pattern of datePatterns) {
          const match = allMessages.match(pattern);
          if (match) {
            extractedInfo.dates = match[0];
            break;
          }
        }
      }
    }

    // Extract budget - Fixed to catch "$5000" in the test case
    if (!extractedInfo.budget) {
      const budgetPatterns = [
        /for\s+\$(\d+(?:,\d{3})*)/i,  // "for $5000" - prioritize this pattern
        /\$(\d+(?:,\d{3})*)/,  // $5000 or $5,000  
        /budget.*?(\d+(?:,\d{3})*)/i,  // budget 5000
        /(\d{4,})/  // standalone 4+ digit numbers like 5000
      ];
      
      for (const pattern of budgetPatterns) {
        const match = allMessages.match(pattern);
        if (match) {
          const amount = match[1];
          extractedInfo.budget = `$${amount.replace(/,/g, '')}`;
          break;
        }
      }
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
${allMessageHistory.slice(-10).map(msgItem => `${msgItem.role === 'user' ? 'User' : 'Keila'}: ${msgItem.content}`).join('\n\n')}

**EXTRACTED INFORMATION SO FAR:**
- Destination: ${extractedInfo.destination || 'Not specified'}
- Duration: ${extractedInfo.duration || 'Not specified'}  
- Dates: ${extractedInfo.dates || 'Not specified'}
- Budget: ${extractedInfo.budget || 'Not specified'}
- Travelers: ${extractedInfo.travelers || 'Not specified'}

**CRITICAL: DO NOT ask about information already provided above. NEVER repeat questions about details the user has already shared.**
`;
    }

    // Debug logging for extraction
    console.log('=== EXTRACTION DEBUG ===');
    console.log('Message:', message);
    console.log('All Messages:', allMessages);
    console.log('Extracted Info:', extractedInfo);
    console.log('Retry Count:', retryCount);
    
    // NEW UX FLOW: Use smart defaults and always generate itinerary if destination is provided
    const fallbackDefaults = (input) => {
      const today = new Date();
      const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      return {
        destination: extractedInfo.destination || "Cancun",
        budget: extractedInfo.budget || "$2000", 
        travelers: extractedInfo.travelers || "1",
        duration: extractedInfo.duration || "5 days",
        dates: extractedInfo.dates || futureDate.toISOString().split('T')[0]
      };
    };
    
    // Apply smart defaults when we have at least a destination
    const smartDefaults = fallbackDefaults(message);
    
    // NEW LOGIC: Generate itinerary if we have destination OR if user asks for trip planning
    const hasTripPlanningIntent = /plan.*trip|trip to|travel to|vacation|holiday|itinerary|visit/i.test(message);
    const hasEnoughInfo = extractedInfo.destination || hasTripPlanningIntent;
    
    // Always force itinerary when we detect trip planning intent
    const shouldForceItinerary = hasEnoughInfo;
    
    console.log('Has enough info?', hasEnoughInfo);
    console.log('Should force itinerary?', shouldForceItinerary);
    console.log('- Destination:', extractedInfo.destination);
    console.log('- Budget:', extractedInfo.budget);
    console.log('- Duration/Dates:', extractedInfo.duration, extractedInfo.dates);
    console.log('- Retry count:', retryCount);

    const systemPrompt = `You are Keila, an expert AI travel planner for Utrippin. 
    Always respond with a full itinerary, even if the user's input is vague or incomplete. 
    Use your best assumptions. Then ask follow-up questions to help refine the plan.

    **CRITICAL: ALWAYS GENERATE FULL ITINERARY FIRST** - Never ask questions before providing value.
    When someone says "Plan me a trip to Cancun", immediately create a comprehensive itinerary using smart defaults.
    
    **SMART DEFAULTS TO USE:**
    - Destination: ${smartDefaults.destination}
    - Budget: ${smartDefaults.budget} 
    - Duration: ${smartDefaults.duration}
    - Dates: ${smartDefaults.dates}
    - Travelers: ${smartDefaults.travelers} person(s)

    **CRITICAL: Each day MUST include comprehensive "Nice to Know" section with ALL categories:**
    - Free things to do
    - Walkability assessment 
    - Transportation options with costs
    - Food options (budget & splurge dining with cost ranges)
    - Mall/shopping options
    - Kids activities (always list them)
    - Best nightlife (bars, clubs, dancing)
    - Best breakfast places
    - Beaches in the area
    - Best coffee shops
    - Drug stores (CVS, Target, Walmart equivalents)
    - Tours available with prices
    - Parks and recreational areas
    - Fishing spots
    - Horseback riding options
    - Sporting events (check local teams)
    - Grocery stores
    - Scenic routes for tourists
    - Nearest hospital/medical
    - Nail salon recommendations

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

    **SUFFICIENT INFO CHECK**: ${hasEnoughInfo || shouldForceItinerary ? 'CREATE COMPREHENSIVE ITINERARY IMMEDIATELY using the smart defaults above. Include customization options at the end.' : 'More info needed - ask smart questions but do not repeat already answered ones'}

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
           "totalEstimatedCost": "$125",
           "niceToKnow": {
             "freeThingsToDo": ["Beach walks", "Art Deco District viewing", "Lincoln Road people watching"],
             "walkability": "Excellent sidewalks in South Beach, very pedestrian-friendly",
             "transportation": "Metro: $2.25, Taxi: $8-15 local rides, Uber/Lyft available",
             "foodOptions": {
               "budget": "Joe's Stone Crab ($), Burger & Beer Joint ($)",
               "splurge": "Prime 112 ($$$), Nobu Miami ($$$$)"
             },
             "mallOptions": ["Lincoln Road Mall (outdoor)", "Aventura Mall (20 min drive)"],
             "kidsActivities": ["Miami Seaquarium", "Jungle Island", "Miami Children's Museum"],
             "nightlife": ["LIV at Fontainebleau", "Story Nightclub", "Mango's Tropical Cafe"],
             "bestBreakfast": "Yardbird Southern Table & Bar, News Cafe",
             "beaches": ["South Beach", "Mid Beach", "North Beach"],
             "bestCoffeeShop": "Panther Coffee, Joe & The Juice",
             "drugStores": ["CVS Pharmacy (multiple locations)", "Walgreens", "Publix Pharmacy"],
             "tours": ["Art Deco Walking Tour (~$25)", "Miami Vice Boat Tour (~$40)"],
             "parks": ["Lummus Park", "South Pointe Park"],
             "fishingSpots": ["South Pointe Pier", "Miami Beach Marina"],
             "horsebackRiding": "Tropical Trail Rides (~$75 per ride)",
             "sportingEvents": "Check Miami Heat (basketball) or Miami Dolphins (football) schedules",
             "groceryStores": ["Publix", "Whole Foods Market", "Fresh Market"],
             "scenicRoutes": "Ocean Drive, Collins Avenue waterfront drive",
             "hospital": "Mount Sinai Medical Center",
             "nailSalon": "Tenoverten (Lincoln Road), Polish Bar"
           }
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
      },
      "customizationCallToAction": {
        "title": "✨ Want to customize this trip?",
        "message": "Would you like to:\n\n🗓️ Choose specific dates\n👫 Add more travelers\n📍 Change focus (family, nightlife, food, beaches)\n📤 Download or share with a friend or agent\n✏️ Customize the activities\n\nType what you'd like to do next!",
        "quickReplies": ["Set specific dates", "Add travelers", "Focus on nightlife", "Download trip", "Customize activities"]
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
    - If hasEnoughInfo is true, you MUST create a comprehensive itinerary using COMPREHENSIVE_ITINERARY_SCHEMA
    - Always return valid JSON with either a response and quickReplies, or a full comprehensiveItinerary object.
    - Never include markdown, HTML, or plain text outside of the JSON block.
    - STOP REPEATING QUESTIONS when user has given destination, budget, and duration/dates.
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
        max_tokens: 16000, // Increased from 8000 to handle longer itineraries
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
    
    // Enhanced JSON parsing with retry logic
    let parsedJson;
    let retryAttempt = 0;
    const maxRetries = 2;
    
    const attemptParsing = async (attempt) => {
      try {
        // Clean up the response - remove any markdown code blocks
        let cleanedContent = messageContent.trim();
        if (cleanedContent.startsWith('```json')) {
          cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        }
        if (cleanedContent.startsWith('```')) {
          cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Remove any text before the first { and after the last }
        const firstBrace = cleanedContent.indexOf('{');
        const lastBrace = cleanedContent.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanedContent = cleanedContent.slice(firstBrace, lastBrace + 1);
        }
        
        // Try to repair common JSON issues
        cleanedContent = cleanedContent
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/([{,]\s*)"([^"]+)"\s*:\s*"([^"]*)"([^",}]*)/g, (match, prefix, key, value, suffix) => {
            // Fix unescaped quotes in values
            const cleanValue = value.replace(/"/g, '\\"');
            return `${prefix}"${key}": "${cleanValue}"${suffix}`;
          });
        
        console.log(`Parsing attempt ${attempt + 1} - Content length:`, cleanedContent.length);
        console.log('Cleaned content (first 500 chars):', cleanedContent.substring(0, 500));
        
        return JSON.parse(cleanedContent);
        
      } catch (parseError) {
        console.error(`JSON parse error on attempt ${attempt + 1}:`, parseError.message);
        
        if (attempt < maxRetries - 1) {
          console.log('Retrying with shorter prompt...');
          // Retry with a shorter, more focused prompt if parsing fails
          const shortPrompt = `Create a comprehensive travel itinerary for ${extractedInfo.destination || 'the specified destination'} using this exact JSON format. Ensure valid JSON syntax:
          
          ${hasEnoughInfo ? 'COMPREHENSIVE_ITINERARY_SCHEMA' : 'INTELLIGENT_QUESTIONING_SCHEMA'}`;
          
          const retryResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${openRouterApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'anthropic/claude-3-haiku',
              messages: [{ role: 'system', content: shortPrompt }, { role: 'user', content: `Plan a trip to ${extractedInfo.destination} with budget ${extractedInfo.budget} for ${extractedInfo.duration}` }],
              max_tokens: 12000,
              temperature: 0.3, // Lower temperature for more structured output
            })
          });
          
          if (retryResponse.ok) {
            const retryJson = await retryResponse.json();
            const retryContent = retryJson.choices[0]?.message?.content;
            if (retryContent) {
              return attemptParsing(attempt + 1, retryContent);
            }
          }
        }
        
        throw parseError;
      }
    };
    
    try {
      parsedJson = await attemptParsing(0);
    } catch (finalError) {
      console.error('All parsing attempts failed:', finalError.message);
      console.error('Raw content (first 1000 chars):', messageContent.substring(0, 1000));
      
      // If we have enough info but got bad JSON, try to extract basic info and create a proper itinerary
      if (hasEnoughInfo && (extractedInfo.destination || hasTripPlanningIntent)) {
        console.log('Forcing itinerary generation due to sufficient info...');
        
        // Generate a comprehensive itinerary directly using the smart defaults
        const destination = extractedInfo.destination || 'Your Destination';
        const fallbackItinerary = {
          itineraryId: `${destination.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          tripTitle: `Amazing ${destination} Adventure`,
          destinationCity: destination,
          destinationCountry: 'TBD',
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          numberOfTravelers: extractedInfo.travelers || 1,
          travelStyle: 'adventure',
          introductoryMessage: `Get ready for an incredible journey to ${destination}! Here's your personalized itinerary created just for you. ${extractedInfo.budget ? `Budget: ${extractedInfo.budget}.` : ''} ${extractedInfo.duration ? `Duration: ${extractedInfo.duration}.` : ''}`,
          imageCollageUrls: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
          ],
          bookingModules: {
            flights: { 
              title: 'Flight Options', 
              items: [
                {
                  name: 'Round-trip Economy',
                  price: extractedInfo.budget ? (parseInt(extractedInfo.budget.replace(/\D/g, '')) * 0.3).toFixed(0) + '$' : '$450',
                  rating: 4.2,
                  bookingLink: `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:ORIGIN,to:${destination}&passengers=adults:${extractedInfo.travelers || 1}&camref=1101l5dQSW`,
                  description: 'Direct flights with major airline'
                }
              ]
            },
            accommodations: { 
              title: 'Hotel Recommendations', 
              items: [
                {
                  name: `Top-rated hotel in ${destination}`,
                  price: extractedInfo.budget ? (parseInt(extractedInfo.budget.replace(/\D/g, '')) * 0.4).toFixed(0) + '$' : '$150/night',
                  rating: 4.5,
                  bookingLink: `https://www.expedia.com/Hotels-Search?destination=${destination}&camref=1101l5dQSW`,
                  description: 'Centrally located with excellent amenities'
                }
              ]
            }
          },
          dailyPlan: [
            {
              day: 1,
              date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              theme: 'Arrival & Exploration',
              description: `Welcome to ${destination}! Start your adventure with a gentle introduction to the city.`,
              events: [
                {
                  startTime: '10:00',
                  endTime: '12:00',
                  title: 'Check-in & City Orientation',
                  location: 'Hotel & City Center',
                  description: `Check into your accommodation and take a walking tour of ${destination}'s main attractions.`,
                  category: 'orientation',
                  cost: 'Free',
                  bookingInfo: null
                },
                {
                  startTime: '14:00',
                  endTime: '17:00',
                  title: 'Local Cuisine Experience',
                  location: 'Local Restaurant District',
                  description: `Discover the authentic flavors of ${destination} with a food tour or recommended local restaurant.`,
                  category: 'dining',
                  cost: extractedInfo.budget ? `$${(parseInt(extractedInfo.budget.replace(/\D/g, '')) * 0.1).toFixed(0)}` : '$50',
                  bookingInfo: null
                }
              ]
            }
          ],
          additionalInfo: {
            cultureAdapter: [
              {
                category: 'Local Customs',
                title: 'Cultural Etiquette',
                description: `Learn about local customs and traditions in ${destination} to enhance your travel experience.`,
                tips: ['Respect local customs', 'Learn basic phrases', 'Dress appropriately for cultural sites']
              }
            ],
            categoryBasedRecommendations: [
              {
                category: 'Must-See Attractions',
                title: `Top Attractions in ${destination}`,
                items: [
                  {
                    name: `${destination} Main Attraction`,
                    description: 'The most iconic landmark you must visit',
                    estimatedCost: 'Free - $30',
                    recommendedDuration: '2-3 hours'
                  }
                ]
              }
            ]
          },
          utility: {
            sources: ['AI Generated with Smart Defaults'],
            downloadPdfLink: ''
          },
          customizationCallToAction: {
            title: '✨ Customize Your Trip',
            message: 'This itinerary was created with smart defaults. Tell me more about your preferences to make it perfect!',
            quickReplies: ['Add more days', 'Change budget', 'Modify activities', 'Different dates']
          }
        };
        
        return new Response(JSON.stringify({
          isComprehensiveItinerary: true,
          comprehensiveItinerary: fallbackItinerary,
          response: `I've created a personalized itinerary for your ${destination} trip! Check it out below and let me know if you'd like to modify anything.`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Final fallback to questioning
      return new Response(JSON.stringify({
        response: "I'd love to help you plan your perfect trip! Let me ask a few questions to get started: Where would you like to go, when are you planning to travel, and what's your budget range?",
        quickReplies: ["📍 Choose destination", "💰 Set budget", "📅 Pick dates"],
        showMap: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Update conversation memory with new message and extracted info
    if (userId) {
      const newMessages = [...(conversationMemory?.messages || []), { role: 'user', content: message }, { role: 'assistant', content: messageContent }];
      
      // Increment retry count if we're still asking questions (not generating itinerary)
      const newRetryCount = (hasEnoughInfo || shouldForceItinerary) ? 0 : retryCount + 1;
      
      if (conversationMemory) {
        // Update existing conversation
        await supabase
          .from('user_conversations')
          .update({
            messages: newMessages,
            extracted_info: extractedInfo,
            retry_count: newRetryCount,
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
            extracted_info: extractedInfo,
            retry_count: newRetryCount
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