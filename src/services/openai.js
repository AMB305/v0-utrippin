// OpenAI service for travel planning
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const TRAVEL_PROMPT = `
You are UTrippin's friendly AI travel assistant. 
When a user tells you a destination, generate:
- A 3-day itinerary with morning, afternoon, evening activities
- Include local restaurants, bars, unique experiences
- Estimate rough costs in USD
- Give travel tips (like visas, safety, best time of year)

Return it in structured JSON format:
{
  "destination": "destination name",
  "bestTimeToVisit": "season/months",
  "estimatedBudget": "daily budget range",
  "currency": "local currency",
  "travelTips": ["tip1", "tip2", "tip3"],
  "days": [
    {
      "day": 1,
      "morning": {
        "activity": "activity name",
        "description": "detailed description",
        "cost": "estimated cost",
        "duration": "time needed"
      },
      "afternoon": {
        "activity": "activity name", 
        "description": "detailed description",
        "cost": "estimated cost",
        "duration": "time needed"
      },
      "evening": {
        "activity": "activity name",
        "description": "detailed description", 
        "cost": "estimated cost",
        "duration": "time needed"
      }
    }
  ],
  "summary": "brief trip overview",
  "totalEstimatedCost": "3-day total cost range"
}

Keep responses helpful, enthusiastic, and practical. Focus on authentic local experiences.
`;

export async function generateTravelItinerary(userMessage) {
  if (!OPENAI_API_KEY) {
    // Fallback response when API key is not available
    return generateFallbackResponse(userMessage);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: TRAVEL_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const itinerary = JSON.parse(aiResponse);
      return {
        type: 'itinerary',
        data: itinerary,
        text: `Great choice! I've created a detailed 3-day itinerary for ${itinerary.destination}. Check out the plan below!`
      };
    } catch (parseError) {
      // If JSON parsing fails, return as regular text
      return {
        type: 'text',
        text: aiResponse
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateFallbackResponse(userMessage);
  }
}

function generateFallbackResponse(userMessage) {
  const lowerInput = userMessage.toLowerCase();
  
  if (lowerInput.includes('japan') || lowerInput.includes('tokyo')) {
    return {
      type: 'itinerary',
      data: {
        destination: "Tokyo, Japan",
        bestTimeToVisit: "March-May (Spring) or September-November (Fall)",
        estimatedBudget: "$200-300 per day",
        currency: "Japanese Yen (JPY)",
        travelTips: [
          "Get a JR Pass for unlimited train travel",
          "Learn basic Japanese phrases - locals appreciate the effort",
          "Cash is king - many places don't accept cards",
          "Bow slightly when greeting people"
        ],
        days: [
          {
            day: 1,
            morning: {
              activity: "Senso-ji Temple & Asakusa District",
              description: "Explore Tokyo's oldest temple and traditional shopping street",
              cost: "$10-15",
              duration: "3 hours"
            },
            afternoon: {
              activity: "Tokyo Skytree & Sumida River",
              description: "Visit the world's tallest tower and enjoy panoramic city views",
              cost: "$25-30",
              duration: "2-3 hours"
            },
            evening: {
              activity: "Shibuya Crossing & Dinner",
              description: "Experience the world's busiest intersection and try authentic ramen",
              cost: "$30-50",
              duration: "3 hours"
            }
          },
          {
            day: 2,
            morning: {
              activity: "Tsukiji Outer Market",
              description: "Fresh sushi breakfast and explore the famous fish market",
              cost: "$20-35",
              duration: "2-3 hours"
            },
            afternoon: {
              activity: "Imperial Palace & East Gardens",
              description: "Peaceful gardens and glimpse of the Emperor's residence",
              cost: "Free",
              duration: "2-3 hours"
            },
            evening: {
              activity: "Ginza District Shopping & Dining",
              description: "Upscale shopping and fine dining in Tokyo's luxury district",
              cost: "$80-150",
              duration: "4 hours"
            }
          },
          {
            day: 3,
            morning: {
              activity: "Meiji Shrine & Harajuku",
              description: "Serene shrine followed by quirky youth culture district",
              cost: "$5-10",
              duration: "3 hours"
            },
            afternoon: {
              activity: "Takeshita Street & Omotesando",
              description: "Pop culture shopping and trendy cafes",
              cost: "$40-60",
              duration: "3 hours"
            },
            evening: {
              activity: "Robot Restaurant Show",
              description: "Unique Japanese entertainment experience with dinner",
              cost: "$60-80",
              duration: "2 hours"
            }
          }
        ],
        summary: "A perfect introduction to Tokyo blending traditional culture, modern attractions, and incredible food experiences.",
        totalEstimatedCost: "$600-900 for 3 days"
      },
      text: "🇯🇵 Amazing choice! Tokyo is incredible - I've created a perfect 3-day itinerary mixing traditional temples, modern attractions, and amazing food experiences!"
    };
  } else if (lowerInput.includes('paris') || lowerInput.includes('france')) {
    return {
      type: 'itinerary',
      data: {
        destination: "Paris, France",
        bestTimeToVisit: "April-June or September-October",
        estimatedBudget: "$150-250 per day",
        currency: "Euro (EUR)",
        travelTips: [
          "Learn basic French greetings - 'Bonjour' goes a long way",
          "Many museums are free on first Sunday mornings",
          "Dinner is typically served after 7:30 PM",
          "Metro day passes are great value for sightseeing"
        ],
        days: [
          {
            day: 1,
            morning: {
              activity: "Louvre Museum",
              description: "World's largest art museum - see the Mona Lisa and Venus de Milo",
              cost: "$20-25",
              duration: "3-4 hours"
            },
            afternoon: {
              activity: "Seine River Cruise",
              description: "Relaxing boat tour past Notre-Dame and under historic bridges",
              cost: "$15-20",
              duration: "1 hour"
            },
            evening: {
              activity: "Eiffel Tower & Dinner",
              description: "Sunset at the iconic tower followed by French bistro dinner",
              cost: "$60-100",
              duration: "3 hours"
            }
          },
          {
            day: 2,
            morning: {
              activity: "Montmartre & Sacré-Cœur",
              description: "Artistic hilltop district with stunning basilica and street artists",
              cost: "$10-15",
              duration: "3 hours"
            },
            afternoon: {
              activity: "Champs-Élysées & Arc de Triomphe",
              description: "Famous avenue shopping and climb the triumphal arch",
              cost: "$15-20",
              duration: "2-3 hours"
            },
            evening: {
              activity: "Latin Quarter Wine Tasting",
              description: "Cozy wine bars and traditional French cuisine",
              cost: "$50-80",
              duration: "3 hours"
            }
          },
          {
            day: 3,
            morning: {
              activity: "Versailles Palace Day Trip",
              description: "Opulent royal palace with magnificent gardens",
              cost: "$35-45",
              duration: "5-6 hours"
            },
            afternoon: {
              activity: "Versailles Gardens",
              description: "Stroll through the famous geometric gardens and fountains",
              cost: "Included",
              duration: "2 hours"
            },
            evening: {
              activity: "Return to Paris & Farewell Dinner",
              description: "Traditional French restaurant for your last night",
              cost: "$70-120",
              duration: "2-3 hours"
            }
          }
        ],
        summary: "A classic Paris experience covering iconic landmarks, world-class art, and authentic French culture and cuisine.",
        totalEstimatedCost: "$450-750 for 3 days"
      },
      text: "🇫🇷 Magnifique! Paris is the perfect destination - I've crafted a romantic 3-day itinerary with all the must-see landmarks and authentic French experiences!"
    };
  } else {
    return {
      type: 'text',
      text: `That sounds like an amazing destination! I'd love to help you plan the perfect trip. Could you tell me more about:

• Your travel dates or preferred season
• Your budget range per day
• What type of experiences you enjoy (culture, food, adventure, relaxation)
• How many travelers in your group

With these details, I can create a personalized itinerary with specific recommendations, costs, and insider tips!`
    };
  }
}