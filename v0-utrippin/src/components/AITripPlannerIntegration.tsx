import React, { useState } from "react";
import { Bot, Calendar, DollarSign, Users, Sparkles, MapPin, Utensils, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Destination {
  name: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  cuisine: string[];
  highlights: string[];
  tips: string[];
}

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: Array<{
    time: string;
    activity: string;
    description: string;
    estimatedCost?: number;
  }>;
  totalCost: number;
}

interface TripPlan {
  destination: string;
  duration: string;
  budget: string;
  bestTime: string;
  overview: string;
  totalEstimatedCost: number;
  itinerary: DayItinerary[];
  recommendations: {
    flights: string[];
    accommodation: string[];
    transportation: string[];
    tips: string[];
  };
}

interface AITripPlannerIntegrationProps {
  destination: Destination;
}

export const AITripPlannerIntegration = ({ destination }: AITripPlannerIntegrationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const { toast } = useToast();

  const generateTripPlan = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `Create a detailed 7-day travel itinerary for ${destination.name}. Consider the following destination information:
      
Summary: ${destination.summary}
Description: ${destination.description}
Key Highlights: ${destination.highlights.join(", ")}
Local Cuisine: ${destination.cuisine.join(", ")}
Tags: ${destination.tags.join(", ")}

Please provide a comprehensive trip plan including:
1. Daily itinerary with specific activities, timings, and estimated costs
2. Budget breakdown and total estimated cost
3. Best time to visit
4. Flight and accommodation recommendations
5. Local transportation tips
6. Essential travel tips

Format the response as a structured JSON object with the following format:
{
  "destination": "destination name",
  "duration": "7 days",
  "budget": "budget range",
  "bestTime": "best months to visit",
  "overview": "brief overview of the trip",
  "totalEstimatedCost": 0,
  "itinerary": [
    {
      "day": 1,
      "title": "day title",
      "description": "day description",
      "activities": [
        {
          "time": "time",
          "activity": "activity name",
          "description": "activity description",
          "estimatedCost": 0
        }
      ],
      "totalCost": 0
    }
  ],
  "recommendations": {
    "flights": ["flight tips"],
    "accommodation": ["hotel recommendations"],
    "transportation": ["transport tips"],
    "tips": ["general tips"]
  }
}`;

      const { data, error } = await supabase.functions.invoke('ai-trip-planner', {
        body: {
          message: prompt,
          conversationHistory: []
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Try to parse the AI response as JSON
      let parsedPlan: TripPlan;
      try {
        // Extract JSON from the response if it's wrapped in text
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedPlan = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: create a structured plan from the text response
          parsedPlan = createFallbackPlan(destination, data.response);
        }
      } catch (parseError) {
        // Create fallback plan if JSON parsing fails
        parsedPlan = createFallbackPlan(destination, data.response);
      }
      
      setTripPlan(parsedPlan);
      
      toast({
        title: "Trip plan generated!",
        description: `Created a personalized ${parsedPlan.duration} itinerary for ${destination.name}`,
      });
    } catch (error) {
      console.error('Error generating trip plan:', error);
      toast({
        title: "Error generating trip plan",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const createFallbackPlan = (dest: Destination, responseText: string): TripPlan => {
    // Create a structured fallback plan based on destination data
    const fallbackItinerary: DayItinerary[] = [];
    
    for (let i = 1; i <= 7; i++) {
      fallbackItinerary.push({
        day: i,
        title: i === 1 ? "Arrival & City Exploration" : 
               i === 2 ? "Cultural Immersion" :
               i === 3 ? "Local Experiences" :
               i === 4 ? "Adventure & Nature" :
               i === 5 ? "Food & Markets" :
               i === 6 ? "Hidden Gems" : "Departure & Final Exploration",
        description: `Day ${i} activities exploring ${dest.name}`,
        activities: [
          {
            time: "9:00 AM",
            activity: dest.highlights[i % dest.highlights.length] || "City exploration",
            description: `Explore ${dest.highlights[i % dest.highlights.length] || "local attractions"}`,
            estimatedCost: 50 + (i * 10)
          },
          {
            time: "1:00 PM",
            activity: "Local dining",
            description: `Try ${dest.cuisine[i % dest.cuisine.length] || "local cuisine"}`,
            estimatedCost: 30 + (i * 5)
          },
          {
            time: "4:00 PM",
            activity: "Cultural activity",
            description: "Immerse in local culture and traditions",
            estimatedCost: 40 + (i * 8)
          }
        ],
        totalCost: 120 + (i * 23)
      });
    }

    return {
      destination: dest.name,
      duration: "7 days",
      budget: "$2,500 - $3,500",
      bestTime: "March - May, September - November",
      overview: `A comprehensive 7-day journey through ${dest.name}, featuring ${dest.highlights.slice(0, 3).join(", ")} and authentic ${dest.cuisine.slice(0, 2).join(" and ")} experiences.`,
      totalEstimatedCost: fallbackItinerary.reduce((sum, day) => sum + day.totalCost, 0),
      itinerary: fallbackItinerary,
      recommendations: {
        flights: ["Book 2-3 months in advance for best prices", "Consider flexible dates", "Check multiple airlines"],
        accommodation: ["Stay in city center for convenience", "Book early for better rates", "Consider local guesthouses"],
        transportation: ["Use public transport for cost savings", "Consider day passes", "Book airport transfers in advance"],
        tips: dest.tips
      }
    };
  };

  const handleViewFullItinerary = () => {
    setShowFullItinerary(true);
  };

  if (showFullItinerary && tripPlan) {
    return (
      <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Complete Itinerary</h3>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <button
            onClick={() => setShowFullItinerary(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Trip Overview */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-2">{tripPlan.destination}</h4>
            <p className="text-slate-300 mb-4">{tripPlan.overview}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-600/50 rounded-lg p-3">
                <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Duration</p>
                <p className="text-sm font-medium text-white">{tripPlan.duration}</p>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3">
                <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Budget</p>
                <p className="text-sm font-medium text-white">{tripPlan.budget}</p>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3">
                <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Best Time</p>
                <p className="text-sm font-medium text-white">{tripPlan.bestTime}</p>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3">
                <MapPin className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Total Cost</p>
                <p className="text-sm font-medium text-white">${tripPlan.totalEstimatedCost}</p>
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Daily Itinerary</h4>
            {tripPlan.itinerary.map((day) => (
              <div key={day.day} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-blue-300">Day {day.day}: {day.title}</h5>
                  <span className="text-sm text-green-400 font-medium">${day.totalCost}</span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{day.description}</p>
                
                <div className="space-y-2">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 bg-slate-600/30 rounded">
                      <span className="text-xs text-blue-400 font-medium min-w-[60px]">{activity.time}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{activity.activity}</p>
                        <p className="text-slate-400 text-xs">{activity.description}</p>
                      </div>
                      {activity.estimatedCost && (
                        <span className="text-xs text-green-400">${activity.estimatedCost}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Travel Tips
              </h5>
              <ul className="space-y-1 text-sm text-slate-300">
                {tripPlan.recommendations.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Accommodation
              </h5>
              <ul className="space-y-1 text-sm text-slate-300">
                {tripPlan.recommendations.accommodation.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-600">
          <button 
            onClick={() => setTripPlan(null)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Generate New Plan
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            Save Itinerary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">AI Trip Planner</h3>
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </div>
      
      <p className="text-slate-300">
        Let our AI create a personalized itinerary for your trip to {destination.name} based on your preferences and the latest travel insights.
      </p>

      {!tripPlan ? (
        <button
          onClick={generateTripPlan}
          disabled={isGenerating}
          className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Generating Your Perfect Trip...
            </>
          ) : (
            <>
              <Bot className="w-5 h-5" />
              Generate AI Trip Plan
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-xl p-3">
              <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Duration</p>
              <p className="text-sm font-medium text-white">{tripPlan.duration}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Est. Budget</p>
              <p className="text-sm font-medium text-white">{tripPlan.budget}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <Users className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Best Time</p>
              <p className="text-sm font-medium text-white">{tripPlan.bestTime.split(',')[0]}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Quick Itinerary Preview:</h4>
            {tripPlan.itinerary.slice(0, 3).map((day, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-3">
                <p className="font-medium text-blue-300">Day {day.day}: {day.title}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {day.description}
                </p>
              </div>
            ))}
            {tripPlan.itinerary.length > 3 && (
              <p className="text-center text-slate-400 text-sm">
                + {tripPlan.itinerary.length - 3} more days with detailed activities
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleViewFullItinerary}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              View Full Itinerary
            </button>
            <button 
              onClick={() => setTripPlan(null)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Generate New Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
