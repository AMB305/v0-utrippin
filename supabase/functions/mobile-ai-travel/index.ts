import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TripSuggestion {
  destination: string;
  title: string;
  description: string;
  duration: string;
  budget: number;
  costPerPerson: number;
  highlights: string[];
  icon: string;
  detailedItinerary: string;
  costBreakdown: {
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
  };
  bookingLinks: {
    flights: string;
    hotels: string;
    cars: string;
    packages: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, budget, groupSize, zip } = await req.json();
    
    console.log(`Generating ${mode} suggestions for ${groupSize} people with budget $${budget}${zip ? ` near ${zip}` : ''}`);

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    let suggestions: TripSuggestion[] = [];

    if (openRouterKey) {
      console.log('Using OpenRouter for mobile travel suggestions');
      suggestions = await generateWithOpenRouter(mode, budget, groupSize, zip, openRouterKey);
    } else if (openAIKey) {
      console.log('Using OpenAI for mobile travel suggestions');
      suggestions = await generateWithOpenAI(mode, budget, groupSize, zip, openAIKey);
    } else {
      console.log('No AI keys found, using fallback suggestions');
      suggestions = generateFallbackSuggestions(mode, budget, groupSize, zip);
    }

    return new Response(JSON.stringify({
      suggestions,
      count: suggestions.length,
      mode,
      budget,
      groupSize,
      zip,
      provider: openRouterKey ? 'OpenRouter' : openAIKey ? 'OpenAI' : 'Fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in mobile-ai-travel:', error);
    
    // Return fallback suggestions on error
    const { mode = 'staycation', budget = 100, groupSize = 1, zip } = await req.json().catch(() => ({}));
    const fallbackSuggestions = generateFallbackSuggestions(mode, budget, groupSize, zip);
    
    return new Response(JSON.stringify({
      suggestions: fallbackSuggestions,
      count: fallbackSuggestions.length,
      mode,
      budget,
      groupSize,
      zip,
      provider: 'Fallback',
      error: 'AI generation failed, using fallback suggestions'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateWithOpenRouter(mode: string, budget: number, groupSize: number, zip: string | undefined, apiKey: string): Promise<TripSuggestion[]> {
  const prompt = createMobileTravelPrompt(mode, budget, groupSize, zip);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://utrippin.ai',
      'X-Title': 'Utrippin Mobile AI Travel',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are a mobile-optimized travel planner. Generate concise, engaging travel suggestions with detailed itineraries. Always respond with valid JSON. Use US Dollar ($) currency only.'
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
  
  return parseAIResponse(content, budget, groupSize, mode);
}

async function generateWithOpenAI(mode: string, budget: number, groupSize: number, zip: string | undefined, apiKey: string): Promise<TripSuggestion[]> {
  const prompt = createMobileTravelPrompt(mode, budget, groupSize, zip);
  
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
          content: 'You are a mobile-optimized travel planner. Generate concise, engaging travel suggestions with detailed itineraries. Always respond with valid JSON. Use US Dollar ($) currency only.'
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
  
  return parseAIResponse(content, budget, groupSize, mode);
}

function createMobileTravelPrompt(mode: string, budget: number, groupSize: number, zip?: string): string {
  const getDuration = (budget: number, mode: string) => {
    if (mode === 'staycation') {
      if (budget <= 200) return '1 day';
      if (budget <= 500) return '2 days';
      if (budget <= 1000) return '3 days';
      return '3-5 days';
    }
    // For vacations
    if (budget <= 1000) return '2-3 days';
    if (budget <= 3000) return '4-5 days';
    if (budget <= 8000) return '7 days';
    return '7-10 days';
  };

  const duration = getDuration(budget, mode);
  const isLowBudgetStaycation = mode === 'staycation' && budget <= 300;

  return `Generate 4 diverse ${mode} suggestions for ${groupSize} people with a total budget of $${budget}.
Duration should be ${duration}.

${mode === 'staycation' && zip ? `
LOCATION REQUIREMENT: All destinations MUST be within 30 miles of zip code ${zip}. 
Focus on local experiences in and around this specific area. Include the city/region name for this zip code.
` : ''}

${isLowBudgetStaycation ? `
LOW-BUDGET STAYCATION FOCUS ($${budget}):
- Create realistic ${duration} local experiences
- Include specific cost examples (e.g., "Museum admission $25 + lunch $35")
- Focus on quality local dining, attractions, and activities
- Be very specific about what the budget covers
${zip ? `- ALL activities must be local to zip code ${zip}` : ''}
` : mode === 'staycation' 
  ? `Focus on local experiences ${zip ? `within 30 miles of zip code ${zip}` : 'within driving distance'}. Include nearby cities, local attractions, restaurants, and day trips.`
  : 'Include diverse destinations worldwide. Mix budget-friendly and premium options within the budget.'
}

For EACH suggestion, provide:

1. **Destination & Title**: Clear destination name and appealing trip title
2. **Description**: 2-sentence engaging summary highlighting unique experiences
3. **Duration**: Exact duration (e.g., "2 days", "1 week")
4. **Budget**: Total cost and cost per person
5. **Highlights**: 4-5 key experiences/activities
6. **Icon**: Single relevant emoji (🏖️, 🏔️, 🏛️, 🍜, etc.)
7. **Detailed Itinerary**: Day-by-day breakdown with times, activities, locations, and costs
8. **Cost Breakdown**: Realistic distribution across categories
9. **Booking Information**: Relevant booking suggestions

**Cost Categories:**
- Accommodation (hotels/stays)
- Food (restaurants/dining)
- Activities (attractions/experiences)
- Transportation (local travel)

**Itinerary Format:**
Provide specific daily schedules with:
- Morning, afternoon, evening activities
- Exact times (e.g., "9:00 AM", "2:30 PM")
- Specific locations and venues
- Individual activity costs
- Why each activity is special/recommended

**Budget Guidelines:**
${mode === 'staycation' ? 
  `- Accommodation: ${isLowBudgetStaycation ? '$0 (staying home)' : '$0-40% of budget'}
   - Food: ${isLowBudgetStaycation ? '50-70% (main dining experiences)' : '30-50%'}
   - Activities: ${isLowBudgetStaycation ? '20-40% (attractions, entertainment)' : '30-50%'}
   - Transportation: 5-15% (gas, parking, rideshare)` :
  `- Accommodation: 35-45% of budget
   - Food: 25-35% of budget  
   - Activities: 20-30% of budget
   - Transportation: 10-20% of budget`
}

Respond ONLY with valid JSON in this exact format:

{
  "suggestions": [
    {
      "destination": "City, State/Country",
      "title": "Appealing Trip Name",
      "description": "Two engaging sentences about this experience highlighting what makes it special and memorable.",
      "duration": "${duration}",
      "budget": ${budget},
      "costPerPerson": ${Math.round(budget / groupSize)},
      "highlights": [
        "Key Experience 1",
        "Key Experience 2", 
        "Key Experience 3",
        "Key Experience 4"
      ],
      "icon": "🏖️",
      "detailedItinerary": "Day 1: 9:00 AM - Coffee and local market tour at Downtown Farmers Market ($15/person) - Start your day exploring local vendors and artisans. 12:00 PM - Lunch at Harbor View Restaurant ($45/person) - Enjoy fresh seafood with waterfront views. 3:00 PM - Museum of Art visit ($25/person) - Discover regional art and cultural exhibits. 6:30 PM - Sunset walk through Historic District (free) - Stroll cobblestone streets and historic architecture. 8:00 PM - Dinner at Farm-to-Table Bistro ($65/person) - Experience locally-sourced cuisine in intimate setting.",
      "costBreakdown": {
        "accommodation": ${isLowBudgetStaycation ? 0 : Math.round(budget * 0.4)},
        "food": ${Math.round(budget * (isLowBudgetStaycation ? 0.6 : 0.3))},
        "activities": ${Math.round(budget * (isLowBudgetStaycation ? 0.3 : 0.2))},
        "transportation": ${Math.round(budget * 0.1)}
      },
      "bookingLinks": {
        "flights": "https://utrippin.ai/flights",
        "hotels": "https://utrippin.ai/hotels", 
        "cars": "https://utrippin.ai/cars",
        "packages": "https://utrippin.ai/packages"
      }
    }
  ]
}

Ensure all costs are realistic and total to approximately $${budget}. ${isLowBudgetStaycation ? 'Focus on high-quality local experiences that provide great value for money.' : 'Include a variety of experiences from different price ranges within the budget.'}`;
}

function parseAIResponse(content: string, budget: number, groupSize: number, mode: string): TripSuggestion[] {
  try {
    // Clean the content to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error('Invalid suggestions format');
    }

    return parsed.suggestions.map((suggestion: any, index: number) => {
      const costBreakdown = suggestion.costBreakdown || {
        accommodation: Math.round(budget * (mode === 'staycation' ? 0.1 : 0.4)),
        food: Math.round(budget * 0.4),
        activities: Math.round(budget * 0.3),
        transportation: Math.round(budget * 0.2)
      };

      return {
        destination: suggestion.destination || `Destination ${index + 1}`,
        title: suggestion.title || `${suggestion.destination} Experience`,
        description: suggestion.description || `Amazing ${mode} experience in ${suggestion.destination}`,
        duration: suggestion.duration || '2-3 days',
        budget: suggestion.budget || budget,
        costPerPerson: suggestion.costPerPerson || Math.round(budget / groupSize),
        highlights: suggestion.highlights || ['Local experiences', 'Great food', 'Cultural attractions'],
        icon: suggestion.icon || (mode === 'staycation' ? '🏠' : '✈️'),
        detailedItinerary: suggestion.detailedItinerary || 'Detailed itinerary coming soon...',
        costBreakdown,
        bookingLinks: suggestion.bookingLinks || {
          flights: 'https://utrippin.ai/flights',
          hotels: 'https://utrippin.ai/hotels',
          cars: 'https://utrippin.ai/cars',
          packages: 'https://utrippin.ai/packages'
        }
      };
    });
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response');
  }
}

function generateFallbackSuggestions(mode: string, budget: number, groupSize: number, zip?: string): TripSuggestion[] {
  const getDuration = (budget: number, mode: string) => {
    if (mode === 'staycation') {
      if (budget <= 200) return '1 day';
      if (budget <= 500) return '2 days';
      return '3 days';
    }
    if (budget <= 1000) return '2-3 days';
    if (budget <= 3000) return '4-5 days';
    return '7 days';
  };

  const duration = getDuration(budget, mode);
  const costPerPerson = Math.round(budget / groupSize);

  if (mode === 'staycation') {
    return [
      {
        destination: zip ? `Local Area (${zip})` : 'Your Local Area',
        title: 'Local Culinary Adventure',
        description: 'Discover the best local restaurants and hidden food gems in your area. Experience diverse cuisines and unique dining atmospheres without traveling far.',
        duration,
        budget,
        costPerPerson,
        highlights: ['Local restaurant discovery', 'Food market exploration', 'Coffee shop hopping', 'Dessert crawl'],
        icon: '🍽️',
        detailedItinerary: `Day 1: 9:00 AM - Start with artisan coffee and pastries at local café ($15). 12:00 PM - Lunch at highly-rated local bistro ($35). 3:00 PM - Visit local farmers market or specialty food stores ($25). 6:00 PM - Dinner at ethnic restaurant you've never tried ($45). Evening: Local dessert spot or ice cream shop ($15).`,
        costBreakdown: {
          accommodation: 0,
          food: Math.round(budget * 0.7),
          activities: Math.round(budget * 0.2),
          transportation: Math.round(budget * 0.1)
        },
        bookingLinks: {
          flights: 'https://utrippin.ai/flights',
          hotels: 'https://utrippin.ai/hotels',
          cars: 'https://utrippin.ai/cars',
          packages: 'https://utrippin.ai/packages'
        }
      },
      {
        destination: zip ? `Local Area (${zip})` : 'Your Local Area',
        title: 'Cultural Exploration Day',
        description: 'Immerse yourself in local culture through museums, art galleries, and historical sites. Perfect for discovering the hidden cultural treasures in your own backyard.',
        duration,
        budget,
        costPerPerson,
        highlights: ['Museum visits', 'Art gallery tours', 'Historical sites', 'Local theater or music'],
        icon: '🎨',
        detailedItinerary: `Day 1: 10:00 AM - Local museum or art gallery ($25). 1:00 PM - Lunch at museum café or nearby restaurant ($30). 3:00 PM - Historical walking tour or landmarks ($20). 6:00 PM - Local theater performance or live music venue ($35). Evening: Coffee and reflection at bookstore café ($15).`,
        costBreakdown: {
          accommodation: 0,
          food: Math.round(budget * 0.4),
          activities: Math.round(budget * 0.5),
          transportation: Math.round(budget * 0.1)
        },
        bookingLinks: {
          flights: 'https://utrippin.ai/flights',
          hotels: 'https://utrippin.ai/hotels',
          cars: 'https://utrippin.ai/cars',
          packages: 'https://utrippin.ai/packages'
        }
      }
    ];
  } else {
    return [
      {
        destination: 'Nearby Mountain Town',
        title: 'Mountain Retreat Getaway',
        description: 'Escape to scenic mountain towns with hiking trails, cozy lodges, and fresh mountain air. Perfect for reconnecting with nature and enjoying outdoor adventures.',
        duration,
        budget,
        costPerPerson,
        highlights: ['Mountain hiking', 'Lodge accommodation', 'Local mountain cuisine', 'Scenic drives'],
        icon: '⛰️',
        detailedItinerary: `Day 1: Morning departure and scenic drive to mountain town. Check into cozy lodge ($80/night). Afternoon hiking on local trails. Evening dinner at mountain restaurant ($45/person). Day 2: Morning nature walk and photography. Lunch at local café ($25). Afternoon exploring town shops and galleries. Evening campfire or stargazing.`,
        costBreakdown: {
          accommodation: Math.round(budget * 0.4),
          food: Math.round(budget * 0.3),
          activities: Math.round(budget * 0.2),
          transportation: Math.round(budget * 0.1)
        },
        bookingLinks: {
          flights: 'https://utrippin.ai/flights',
          hotels: 'https://utrippin.ai/hotels',
          cars: 'https://utrippin.ai/cars',
          packages: 'https://utrippin.ai/packages'
        }
      },
      {
        destination: 'Coastal Beach Town',
        title: 'Seaside Relaxation',
        description: 'Unwind at a charming coastal destination with beautiful beaches, fresh seafood, and relaxing ocean views. Ideal for stress relief and romantic getaways.',
        duration,
        budget,
        costPerPerson,
        highlights: ['Beach relaxation', 'Fresh seafood dining', 'Coastal walks', 'Sunset viewing'],
        icon: '🏖️',
        detailedItinerary: `Day 1: Travel to coastal town and check into beachfront hotel ($90/night). Afternoon beach time and swimming. Evening seafood dinner with ocean views ($55/person). Day 2: Morning beach walk and coffee ($15). Afternoon exploring coastal shops and galleries. Sunset dinner at pier restaurant ($50/person).`,
        costBreakdown: {
          accommodation: Math.round(budget * 0.45),
          food: Math.round(budget * 0.35),
          activities: Math.round(budget * 0.15),
          transportation: Math.round(budget * 0.05)
        },
        bookingLinks: {
          flights: 'https://utrippin.ai/flights',
          hotels: 'https://utrippin.ai/hotels',
          cars: 'https://utrippin.ai/cars',
          packages: 'https://utrippin.ai/packages'
        }
      }
    ];
  }
}