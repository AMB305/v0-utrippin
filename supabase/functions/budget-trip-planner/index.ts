import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TripPackage {
  destination: string;
  name: string;
  type: string;
  summary: string;
  budget: number;
  costPerPerson: number;
  groupSize: number;
  imageUrl?: string;
  highlights: string[];
  duration: string;
  flightsLink: string;
  hotelsLink: string;
  carsLink: string;
  detailedItinerary: any;
  costBreakdown: {
    flights: number;
    hotels: number;
    food: number;
    activities: number;
    transportation: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, groupSize, tripType, zipCode } = await req.json();

    console.log(`Generating ${tripType} trips for ${groupSize} people with budget $${budget}`);

    // Use OpenRouter as primary, OpenAI as fallback
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    let trips: TripPackage[] = [];

    if (openRouterKey) {
      console.log('Using OpenRouter for trip generation');
      trips = await generateTripsWithOpenRouter(budget, groupSize, tripType, zipCode, openRouterKey);
    } else if (openAIKey) {
      console.log('Using OpenAI for trip generation');
      trips = await generateTripsWithOpenAI(budget, groupSize, tripType, zipCode, openAIKey);
    } else {
      console.log('No API keys found, returning fallback trips');
      trips = generateFallbackTrips(budget, groupSize, tripType, zipCode);
    }

    return new Response(JSON.stringify({
      trips,
      count: trips.length,
      budget,
      groupSize,
      tripType,
      provider: openRouterKey ? 'OpenRouter' : openAIKey ? 'OpenAI' : 'Fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in budget-trip-planner:', error);
    
    // Return fallback trips on error
    const { budget = 3000, groupSize = 2, tripType = 'vacation', zipCode } = await req.json().catch(() => ({}));
    const fallbackTrips = generateFallbackTrips(budget, groupSize, tripType, zipCode);
    
    return new Response(JSON.stringify({
      trips: fallbackTrips,
      count: fallbackTrips.length,
      budget,
      groupSize,
      tripType,
      provider: 'Fallback',
      error: 'AI generation failed, using fallback trips'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateTripsWithOpenRouter(budget: number, groupSize: number, tripType: string, zipCode: string | undefined, apiKey: string): Promise<TripPackage[]> {
  const prompt = createTripGenerationPrompt(budget, groupSize, tripType, zipCode);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class travel planner. Generate detailed, realistic trip packages with accurate cost breakdowns. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  return parseAIResponse(content, budget, groupSize, tripType);
}

async function generateTripsWithOpenAI(budget: number, groupSize: number, tripType: string, zipCode: string | undefined, apiKey: string): Promise<TripPackage[]> {
  const prompt = createTripGenerationPrompt(budget, groupSize, tripType, zipCode);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class travel planner. Generate detailed, realistic trip packages with accurate cost breakdowns. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  return parseAIResponse(content, budget, groupSize, tripType);
}

function createTripGenerationPrompt(budget: number, groupSize: number, tripType: string, zipCode?: string): string {
  // Calculate duration based on budget
  const getDuration = (budget: number, tripType: string) => {
    if (tripType === 'staycation') {
      if (budget <= 150) return 1;
      if (budget <= 300) return 2;
      if (budget <= 600) return 3;
      if (budget <= 1000) return 5;
      return 7;
    }
    // For vacations
    if (budget <= 500) return 2;
    if (budget <= 1000) return 3;
    if (budget <= 2000) return 5;
    return 7;
  };

  const duration = getDuration(budget, tripType);
  const isLowBudgetStaycation = tripType === 'staycation' && budget < 200;
  
  const basePrompt = `Generate 6 diverse ${tripType} packages for ${groupSize} people with a total budget of $${budget}.
Duration should be ${duration} day${duration > 1 ? 's' : ''}.

${tripType === 'staycation' && zipCode ? `
CRITICAL LOCATION REQUIREMENT: All destinations MUST be within 30 miles of zip code ${zipCode}. 
Use this exact zip code to determine the specific city/region and generate staycations ONLY for that local area.
DO NOT suggest destinations from other states or distant cities. Focus exclusively on the local area around ${zipCode}.
` : ''}

${isLowBudgetStaycation ? `
SPECIAL LOW-BUDGET STAYCATION INSTRUCTIONS ($${budget}):
- Focus on ${duration}-day experience${duration > 1 ? 's' : ''}
- Be very specific about what $${budget} gets you (e.g., "Gourmet lunch at downtown bistro ($45) + Art museum admission ($25) + Coffee shop visit ($15) + Local park walk (free)")
- Include realistic local experiences: nice restaurant meals, museum visits, local attractions, coffee shops, parks
- For $100: Focus on 1-2 main activities (nice lunch + one attraction)
- For $150-199: Can include dinner or multiple smaller activities
- Emphasize the quality and experience value, not just cost
- Duration should be "${duration} day${duration > 1 ? 's' : ''}" for these options
${zipCode ? `- ALL activities must be within 30 miles of zip code ${zipCode}` : ''}
` : tripType === 'staycation' 
  ? `Focus on local experiences ${zipCode ? `within 30 miles of zip code ${zipCode}. Research the specific city/area for this zip code and suggest only LOCAL destinations, attractions, restaurants, and activities in that immediate region. Do NOT suggest destinations from other states or distant cities.` : 'within 50 miles of user location'}. Include nearby cities, local attractions, regional destinations, restaurants, and activities.`
  : 'Include destinations worldwide with varied price points - budget, mid-range, and premium options within the budget.'
}

For vacation packages under $500 total:
- Focus on destinations within driving distance (no flights)
- Include budget hotels/motels but skip expensive resorts
- Emphasize local experiences and hidden gems
- Consider bus travel or driving

For EACH trip package, provide:
1. Destination name and country
2. Trip name/title  
3. Trip type (adventure, relaxation, culture, family, romantic, etc.)
4. 2-sentence summary ${isLowBudgetStaycation ? 'that specifically mentions what activities are included and their costs' : ''}
5. Detailed cost breakdown for ${groupSize} people:
   - Flights: $X ${isLowBudgetStaycation ? '(should be $0)' : '(per person round-trip)'}
   - Hotels: $X ${isLowBudgetStaycation ? '(should be $0)' : '(per night × days)'}
   - Food: $X ${isLowBudgetStaycation ? '(main meal/restaurant costs)' : '(per person per day × days)'}
   - Activities: $X ${isLowBudgetStaycation ? '(attractions, museums, entertainment)' : '(total for group)'}
   - Local transportation: $X ${isLowBudgetStaycation ? '(parking, gas, rideshare)' : ''}
6. 3-5 highlight activities/experiences
7. ${duration}-day detailed itinerary with specific times, locations, and daily costs
8. Best ${isLowBudgetStaycation ? 'times of day/week' : 'travel months'}

IMPORTANT: For itinerary, provide specific times (e.g., "9:00 AM", "2:00 PM") and real locations (e.g., "Central Park", "Metropolitan Museum") rather than vague descriptions.

Ensure total costs are realistic and within the $${budget} budget. ${isLowBudgetStaycation ? 'Focus on quality local experiences that provide great value.' : 'Include a variety of destinations from different continents and price ranges.'}

Respond ONLY with valid JSON in this exact format:
{
  "trips": [
    {
      "destination": "City, Country",
      "name": "Trip Package Name",
      "type": "adventure",
      "summary": "Brief exciting description of this trip package${isLowBudgetStaycation ? ' with specific activity costs mentioned' : ''}.",
      "duration": "${duration} day${duration > 1 ? 's' : ''}",
      "costBreakdown": {
        "flights": ${isLowBudgetStaycation ? '0' : '800'},
        "hotels": ${isLowBudgetStaycation ? '0' : '840'},
        "food": ${isLowBudgetStaycation ? Math.round(budget * 0.6) : '420'},
        "activities": ${isLowBudgetStaycation ? Math.round(budget * 0.3) : '600'},
        "transportation": ${isLowBudgetStaycation ? Math.round(budget * 0.1) : '200'}
      },
      "highlights": ["Activity 1", "Activity 2", "Activity 3"],
      "itinerary": {
        ${duration === 1 ? `
        "morning": {"time": "9:00 AM", "activity": "Start at Central Park", "location": "Central Park, NYC", "cost": 40},
        "afternoon": {"time": "1:00 PM", "activity": "Museum visit", "location": "Metropolitan Museum", "cost": 35},
        "evening": {"time": "6:00 PM", "activity": "Dinner at local bistro", "location": "Little Italy", "cost": 25}
        ` : `
        "day1": {"morning": {"time": "9:00 AM", "activity": "Arrival and city tour", "location": "Downtown area", "cost": 30}, "afternoon": {"time": "2:00 PM", "activity": "Main attraction", "location": "Famous landmark", "cost": 20}},
        "day2": {"morning": {"time": "10:00 AM", "activity": "Adventure activity", "location": "Adventure park", "cost": 50}, "afternoon": {"time": "3:00 PM", "activity": "Cultural experience", "location": "Cultural district", "cost": 30}}
        ${duration > 2 ? ', "day3": {"morning": {"time": "9:30 AM", "activity": "Local market visit", "location": "Farmers market", "cost": 25}, "afternoon": {"time": "1:00 PM", "activity": "Food tour", "location": "Food district", "cost": 35}}' : ''}
        ${duration > 3 ? ', "day4": {"morning": {"time": "10:00 AM", "activity": "Nature experience", "location": "National park", "cost": 20}, "afternoon": {"time": "2:30 PM", "activity": "Relaxation", "location": "Spa or beach", "cost": 40}}' : ''}
        ${duration > 4 ? ', "day5": {"morning": {"time": "9:00 AM", "activity": "Shopping and souvenirs", "location": "Shopping district", "cost": 35}, "afternoon": {"time": "1:30 PM", "activity": "Final activities", "location": "City center", "cost": 25}}' : ''}
        ${duration > 5 ? ', "day6": {"morning": {"time": "10:30 AM", "activity": "Leisure day", "location": "Waterfront", "cost": 30}, "afternoon": {"time": "3:00 PM", "activity": "Farewell dinner prep", "location": "Restaurant district", "cost": 45}}' : ''}
        ${duration === 7 ? ', "day7": {"morning": {"time": "11:00 AM", "activity": "Departure preparation", "location": "Hotel area", "cost": 15}, "afternoon": {"time": "2:00 PM", "activity": "Final exploration", "location": "Airport area", "cost": 15}}' : ''}
        `}
      },
      "bestMonths": ["March", "April", "October"]
    }
  ]
}`;

  return basePrompt;
}

function parseAIResponse(content: string, budget: number, groupSize: number, tripType: string): TripPackage[] {
  try {
    // Clean the content to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    if (!parsed.trips || !Array.isArray(parsed.trips)) {
      throw new Error('Invalid trips format');
    }

    return parsed.trips.map((trip: any, index: number) => {
      const costBreakdown = trip.costBreakdown || {
        flights: Math.round(budget * 0.3 / groupSize),
        hotels: Math.round(budget * 0.35),
        food: Math.round(budget * 0.2),
        activities: Math.round(budget * 0.1),
        transportation: Math.round(budget * 0.05)
      };

      const totalCost = Object.values(costBreakdown).reduce((sum: number, cost: any) => sum + (typeof cost === 'number' ? cost : 0), 0);

      return {
        destination: trip.destination || `Destination ${index + 1}`,
        name: trip.name || `${trip.destination} Adventure`,
        type: trip.type || tripType,
        summary: trip.summary || `Amazing ${tripType} experience in ${trip.destination}`,
        budget: totalCost,
        costPerPerson: Math.round(totalCost / groupSize),
        groupSize,
        highlights: trip.highlights || ['Local experiences', 'Cultural attractions', 'Great food'],
        duration: trip.duration || '7 days',
        flightsLink: `https://www.expedia.com/Flights?camref=1110l15dQSW&destination=${encodeURIComponent(trip.destination || 'Popular Destination')}`,
        hotelsLink: `https://www.expedia.com/Hotels?camref=1110l15dQSW&destination=${encodeURIComponent(trip.destination || 'Popular Destination')}`,
        carsLink: `https://www.expedia.com/Cars?camref=1110l15dQSW&location=${encodeURIComponent(trip.destination || 'Popular Destination')}`,
        detailedItinerary: trip.itinerary || {},
        costBreakdown
      };
    });
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response');
  }
}

function generateFallbackTrips(budget: number, groupSize: number, tripType: string, zipCode?: string): TripPackage[] {
  // Calculate duration based on budget
  const getDuration = (budget: number, tripType: string) => {
    if (tripType === 'staycation') {
      if (budget <= 150) return 1;
      if (budget <= 300) return 2;
      if (budget <= 600) return 3;
      if (budget <= 1000) return 5;
      return 7;
    }
    // For vacations
    if (budget <= 500) return 2;
    if (budget <= 1000) return 3;
    if (budget <= 2000) return 5;
    return 7;
  };

  const duration = getDuration(budget, tripType);
  const isLowBudgetStaycation = tripType === 'staycation' && budget < 200;
  
  const destinations = tripType === 'staycation' 
    ? [
        'Local City Center', 'Nearby National Park', 'Regional Wine Country', 'Coastal Area',
        'Mountain Resort', 'Historic Downtown', 'Lake District', 'State Park',
        'Local Attractions Tour', 'Regional Cultural Sites', 'Scenic Drives', 'Nearby Islands'
      ]
    : [
        'Lisbon, Portugal', 'Prague, Czech Republic', 'Bali, Indonesia', 'Costa Rica',
        'Vietnam', 'Thailand', 'Mexico City, Mexico', 'Morocco', 'India', 'Peru',
        'Greece', 'Turkey', 'Philippines', 'Colombia', 'Cambodia', 'Nepal'
      ];

  return destinations.slice(0, 6).map((destination, index) => {
    const costPerPerson = Math.round(budget / groupSize);
    
    // Adjust cost breakdown for low budget staycations
    const flightCost = tripType === 'staycation' ? 0 : Math.round(budget * 0.3);
    const hotelCost = isLowBudgetStaycation ? 0 : Math.round(budget * 0.35);
    const foodCost = isLowBudgetStaycation ? Math.round(budget * 0.6) : Math.round(budget * 0.2);
    const activityCost = isLowBudgetStaycation ? Math.round(budget * 0.3) : Math.round(budget * 0.1);
    const transportCost = isLowBudgetStaycation ? Math.round(budget * 0.1) : Math.round(budget * 0.05);

    const lowBudgetExamples = [
      'Gourmet lunch at downtown bistro + art museum visit',
      'Coffee shop tour + local park exploration + food truck lunch',
      'Nice restaurant dinner + evening live music venue',
      'Museum admission + afternoon tea + bookstore browsing',
      'Local farmers market + picnic lunch + scenic walk',
      'Craft brewery tasting + appetizer sharing + local tour'
    ];

    // Create appropriate itinerary based on duration
    const createItinerary = () => {
      if (duration === 1) {
        return {
          morning: { 
            time: "9:00 AM", 
            activity: "Start with coffee and local market exploration", 
            location: "Downtown Farmers Market", 
            cost: Math.round(activityCost * 0.3) 
          },
          afternoon: { 
            time: "1:00 PM", 
            activity: "Main dining experience and cultural attraction", 
            location: "Local Museum District", 
            cost: Math.round(foodCost + activityCost * 0.5) 
          },
          evening: { 
            time: "6:00 PM", 
            activity: "Relaxing walk and local dessert spot", 
            location: "Historic Downtown", 
            cost: Math.round(activityCost * 0.2) 
          }
        };
      } else {
        const dailyCost = Math.round(activityCost / duration);
        const itinerary: any = {};
        
        for (let i = 1; i <= duration; i++) {
          itinerary[`day${i}`] = {
            morning: {
              time: "9:00 AM",
              activity: i === 1 ? "Arrival and orientation tour" : 
                       i === duration ? "Departure preparation" : 
                       `Day ${i} morning activities`,
              location: i === 1 ? "Visitor Center" : 
                       i === duration ? "Transportation Hub" : 
                       "Local Attraction",
              cost: dailyCost
            },
            afternoon: {
              time: "2:00 PM", 
              activity: i === 1 ? "Main attractions and landmarks" : 
                       i === duration ? "Final exploration" : 
                       `Day ${i} afternoon experiences`,
              location: i === 1 ? "Main Square" : 
                       i === duration ? "Scenic Overlook" : 
                       "Cultural District",
              cost: dailyCost
            }
          };
        }
        return itinerary;
      }
    };

    return {
      destination,
      name: `${destination} ${isLowBudgetStaycation ? 'Day Experience' : tripType === 'staycation' ? 'Staycation' : 'Adventure'} Package`,
      type: tripType,
      summary: isLowBudgetStaycation 
        ? `Perfect $${budget} day experience featuring ${lowBudgetExamples[index % lowBudgetExamples.length]}. Includes quality local dining ($${foodCost}) and engaging activities ($${activityCost}) for an memorable local adventure.`
        : `Complete ${duration}-day ${tripType} package for ${groupSize} people featuring the best of ${destination} including accommodations, meals, and curated activities.`,
      budget: budget,
      costPerPerson,
      groupSize,
      highlights: isLowBudgetStaycation 
        ? ['Quality local dining', 'Cultural attractions', 'Scenic locations', 'Local experiences']
        : [
            'Curated local experiences',
            'Comfortable accommodations', 
            'Authentic local cuisine',
            'Professional guided tours',
            'Cultural immersion activities'
          ],
      duration: `${duration} day${duration > 1 ? 's' : ''}`,
      flightsLink: `https://www.expedia.com/Flights?camref=1110l15dQSW&destination=${encodeURIComponent(destination)}`,
      hotelsLink: `https://www.expedia.com/Hotels?camref=1110l15dQSW&destination=${encodeURIComponent(destination)}`,
      carsLink: `https://www.expedia.com/Cars?camref=1110l15dQSW&location=${encodeURIComponent(destination)}`,
      detailedItinerary: createItinerary(),
      costBreakdown: {
        flights: flightCost,
        hotels: hotelCost,
        food: foodCost,
        activities: activityCost,
        transportation: transportCost
      }
    };
  });
}