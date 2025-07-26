// supabase/functions/ai-comprehensive-itinerary/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.23.4/mod.ts";

// Comprehensive schema definitions
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
const pexelsApiKey = Deno.env.get('PEXELS_API_KEY');
const pixabayApiKey = Deno.env.get('PIXABAY_API_KEY');

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Image generation function using existing APIs
async function generateImageCollage(destination: string, country: string): Promise<string[]> {
  const searchQueries = [
    `${destination} city skyline`,
    `${destination} landmarks`,
    `${country} culture`,
    `${destination} food`,
    `${destination} attractions`,
    `${country} nature`
  ];

  const images: string[] = [];
  
  // Use Pexels API first
  for (const query of searchQueries.slice(0, 4)) {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
        headers: {
          'Authorization': pexelsApiKey || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          images.push(data.photos[0].src.medium);
        }
      }
    } catch (error) {
      console.error('Pexels API error:', error);
    }
  }
  
  // Fill remaining with Pixabay if needed
  if (images.length < 4 && pixabayApiKey) {
    for (const query of searchQueries.slice(4, 6)) {
      try {
        const response = await fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3&min_width=800`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.hits && data.hits.length > 0) {
            images.push(data.hits[0].webformatURL);
          }
        }
      } catch (error) {
        console.error('Pixabay API error:', error);
      }
    }
  }
  
  // Fallback to placeholder images if needed
  const placeholders = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800'
  ];
  
  while (images.length < 4) {
    images.push(placeholders[images.length % placeholders.length]);
  }
  
  return images.slice(0, 6);
}

// Booking integration function
async function integrateBookingData(itinerary: any, userId?: string) {
  const projectUrl = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  
  // Determine date range from daily plan or use start/end dates
  const checkIn = itinerary.startDate;
  const checkOut = itinerary.endDate;
  const departureDate = itinerary.startDate;
  const returnDate = itinerary.endDate;

  // Integrate flight data
  try {
    const flightResponse = await supabase.functions.invoke('flight-search-integration', {
      body: {
        origin: 'NYC', // Default origin - could be extracted from user request
        destination: itinerary.destinationCity,
        departureDate,
        returnDate,
        passengers: itinerary.numberOfTravelers,
        userId
      }
    });

    if (flightResponse.data?.flightModule) {
      itinerary.bookingModules.flights = flightResponse.data.flightModule;
    }
  } catch (error) {
    console.error('Flight integration error:', error);
  }

  // Integrate hotel data
  try {
    const hotelResponse = await supabase.functions.invoke('hotel-affiliate-integration', {
      body: {
        destination: itinerary.destinationCity,
        checkIn,
        checkOut,
        guests: itinerary.numberOfTravelers,
        rooms: Math.ceil(itinerary.numberOfTravelers / 2),
        userId
      }
    });

    if (hotelResponse.data?.hotelModule) {
      itinerary.bookingModules.accommodations = hotelResponse.data.hotelModule;
    }
  } catch (error) {
    console.error('Hotel integration error:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, comprehensive = false, userId } = await req.json();

    if (!comprehensive) {
      return new Response(JSON.stringify({ 
        error: "This endpoint is for comprehensive itineraries only. Use ai-travel-chat for simple itineraries." 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Generate unique itinerary ID
    const itineraryId = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const systemPrompt = `You are Keila, an expert AI travel agent that creates comprehensive, detailed itineraries. You MUST respond with a single, valid JSON object that conforms EXACTLY to the COMPREHENSIVE_ITINERARY_SCHEMA below.

    **CRITICAL INSTRUCTIONS:**
    1. Analyze the user's request for destination, duration, travelers, and preferences
    2. Generate a comprehensive itinerary with specific events, times, and details
    3. Include realistic booking options for flights and accommodations
    4. Provide detailed culture tips and recommendations
    5. Use the itineraryId: "${itineraryId}"
    6. Set imageCollageUrls to ["PLACEHOLDER"] - these will be replaced with real images

    **COMPREHENSIVE_ITINERARY_SCHEMA:**
    {
      "itineraryId": "${itineraryId}",
      "tripTitle": "Engaging trip title",
      "destinationCity": "Primary destination city",
      "destinationCountry": "Country name",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD", 
      "numberOfTravelers": 2,
      "travelStyle": "adventure|cultural|relaxation|luxury|budget",
      "introductoryMessage": "Personalized welcome message for the trip",
      "imageCollageUrls": ["PLACEHOLDER"],
      "bookingModules": {
        "flights": {
          "title": "Flight Options",
          "items": [
            {
              "name": "Airline Flight Option",
              "price": "$XXX",
              "rating": 4.2,
              "bookingLink": "https://example.com/flights",
              "description": "Flight details"
            }
          ],
          "defaultUrl": "https://skyscanner.com"
        },
        "accommodations": {
          "title": "Where to Stay", 
          "items": [
            {
              "name": "Hotel Name",
              "price": "$XXX/night",
              "rating": 4.5,
              "bookingLink": "https://example.com/hotels",
              "amenities": ["WiFi", "Pool"],
              "description": "Hotel description"
            }
          ],
          "defaultUrl": "https://booking.com"
        }
      },
      "dailyPlan": [
        {
          "day": "Day 1",
          "date": "YYYY-MM-DD",
          "title": "Arrival Day",
          "events": [
            {
              "time": "09:00",
              "title": "Flight Arrival",
              "description": "Land at airport",
              "type": "transport",
              "location": "Airport Name",
              "cost": "Included"
            }
          ],
          "totalEstimatedCost": "$XXX"
        }
      ],
      "additionalInfo": {
        "cultureAdapter": [
          {
            "category": "Language",
            "title": "Basic Phrases",
            "content": "Essential phrases for the destination"
          }
        ],
        "categoryBasedRecommendations": [
          {
            "category": "Food & Dining",
            "title": "Must-Try Local Cuisine",
            "items": [
              {
                "name": "Restaurant/Dish",
                "description": "Why it's special",
                "location": "Where to find it",
                "cost": "Price range"
              }
            ]
          }
        ]
      },
      "utility": {
        "sources": ["Source 1", "Source 2"],
        "downloadPdfLink": ""
      }
    }

    Generate a comprehensive itinerary based on the user's request. Be specific with times, locations, and activities.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const aiJson = await response.json();
    const parsedJson = JSON.parse(aiJson.choices[0].message.content);
    
    // Validate the schema
    const validationResult = ComprehensiveItinerarySchema.safeParse(parsedJson);
    
    if (!validationResult.success) {
      console.error('Schema validation failed:', validationResult.error);
      throw new Error('Generated itinerary does not match required schema');
    }

    const itinerary = validationResult.data;

    // Generate real images for the collage
    try {
      const images = await generateImageCollage(itinerary.destinationCity, itinerary.destinationCountry);
      itinerary.imageCollageUrls = images;
    } catch (error) {
      console.error('Image generation failed:', error);
      // Keep placeholder images if generation fails
    }

    // Integrate real booking data
    try {
      await integrateBookingData(itinerary, userId);
    } catch (error) {
      console.error('Booking integration failed:', error);
      // Keep mock booking data if integration fails
    }

    return new Response(
      JSON.stringify({
        isComprehensiveItinerary: true,
        comprehensiveItinerary: itinerary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Comprehensive Itinerary Generation Error:', error);
    
    return new Response(
      JSON.stringify({
        isComprehensiveItinerary: false,
        error: error.message || "Failed to generate comprehensive itinerary",
        response: "I'm having trouble creating your detailed itinerary right now. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
