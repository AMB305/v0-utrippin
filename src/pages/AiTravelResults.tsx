import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Users, DollarSign, Home, Plane, ArrowLeft, Clock, Star, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface TripParams {
  mode: 'staycation' | 'vacation';
  budget: string;
  groupSize: string;
  zip?: string;
}

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

const AiTravelResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState<TripParams | null>(null);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tripParams: TripParams = {
      mode: urlParams.get('mode') as 'staycation' | 'vacation' || 'staycation',
      budget: urlParams.get('budget') || '100',
      groupSize: urlParams.get('groupSize') || '1',
      zip: urlParams.get('zip') || undefined
    };
    
    setParams(tripParams);
    generateAISuggestions(tripParams);
  }, [location]);

  const generateAISuggestions = async (tripParams: TripParams) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating AI travel suggestions:', tripParams);
      
      const { data, error: functionError } = await supabase.functions.invoke('mobile-ai-travel', {
        body: {
          mode: tripParams.mode,
          budget: parseInt(tripParams.budget),
          groupSize: parseInt(tripParams.groupSize),
          zip: tripParams.zip
        }
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw functionError;
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        console.log('Generated suggestions:', data.suggestions);
      } else {
        throw new Error('No suggestions received from AI');
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setError('Failed to generate travel suggestions. Please try again.');
      
      // Use fallback suggestions
      setSuggestions(getFallbackSuggestions(tripParams));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackSuggestions = (params: TripParams): TripSuggestion[] => {
    const budget = parseInt(params.budget);
    const costPerPerson = Math.round(budget / parseInt(params.groupSize));
    
    if (params.mode === 'staycation') {
      return [
        {
          destination: params.zip ? `Local Area (${params.zip})` : 'Your Local Area',
          title: 'Local Culinary Adventure',
          description: 'Discover the best local restaurants and hidden food gems in your area. Experience diverse cuisines and unique dining atmospheres.',
          duration: budget <= 200 ? '1 day' : '2 days',
          budget,
          costPerPerson,
          highlights: ['Local restaurant discovery', 'Food market exploration', 'Coffee shop hopping', 'Dessert crawl'],
          icon: '🍽️',
          detailedItinerary: 'Start with artisan coffee and pastries at a local café, enjoy lunch at a highly-rated bistro, explore farmers markets, and finish with dinner at an ethnic restaurant you\'ve never tried.',
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
          destination: params.zip ? `Local Area (${params.zip})` : 'Your Local Area',
          title: 'Cultural Exploration Day',
          description: 'Immerse yourself in local culture through museums, art galleries, and historical sites. Perfect for discovering hidden treasures.',
          duration: budget <= 200 ? '1 day' : '2 days',
          budget,
          costPerPerson,
          highlights: ['Museum visits', 'Art gallery tours', 'Historical sites', 'Local performances'],
          icon: '🎨',
          detailedItinerary: 'Visit local museums and art galleries, take historical walking tours, enjoy cultural performances, and relax at bookstore cafés.',
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
          description: 'Escape to scenic mountain towns with hiking trails, cozy lodges, and fresh mountain air. Perfect for reconnecting with nature.',
          duration: budget <= 1000 ? '2-3 days' : '4-5 days',
          budget,
          costPerPerson,
          highlights: ['Mountain hiking', 'Lodge accommodation', 'Local mountain cuisine', 'Scenic drives'],
          icon: '⛰️',
          detailedItinerary: 'Scenic drive to mountain town, check into cozy lodge, enjoy hiking trails, explore local shops, and experience mountain dining.',
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
        }
      ];
    }
  };

  const formatBudget = (value: string) => {
    const num = parseInt(value);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  const formatCost = (cost: number) => {
    if (cost >= 1000) return `$${(cost / 1000).toFixed(1)}K`;
    return `$${cost}`;
  };

  if (loading || !params) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">🤖 AI is crafting your perfect travel suggestions...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trip Planner
        </Button>

        {/* Trip Parameters Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {params.mode === 'staycation' ? <Home className="w-6 h-6" /> : <Plane className="w-6 h-6" />}
            Your AI-Generated {params.mode === 'staycation' ? 'Staycation' : 'Vacation'} Options
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              Budget: <span className="font-semibold">{formatBudget(params.budget)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              Group Size: <span className="font-semibold">{params.groupSize} {parseInt(params.groupSize) === 1 ? 'person' : 'people'}</span>
            </div>
            {params.zip && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                Area: <span className="font-semibold">{params.zip}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm">⚠️ {error}</p>
              <p className="text-yellow-700 text-xs mt-1">Showing backup suggestions below.</p>
            </div>
          )}
        </div>

        {/* AI-Generated Trip Suggestions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            AI-Curated {params.mode === 'staycation' ? 'Staycation' : 'Vacation'} Ideas
          </h2>
          
          <div className="grid gap-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{suggestion.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {suggestion.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {suggestion.description}
                      </p>
                      
                      {/* Trip Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {suggestion.destination}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {suggestion.duration}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <DollarSign className="w-3 h-3" />
                          {formatCost(suggestion.budget)} total
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" />
                          {formatCost(suggestion.costPerPerson)} per person
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.highlights.map((highlight, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Itinerary */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Detailed Itinerary:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {suggestion.detailedItinerary}
                        </p>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Cost Breakdown:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {suggestion.costBreakdown.accommodation > 0 && (
                            <div className="text-gray-600">
                              🏨 Hotels: {formatCost(suggestion.costBreakdown.accommodation)}
                            </div>
                          )}
                          <div className="text-gray-600">
                            🍽️ Food: {formatCost(suggestion.costBreakdown.food)}
                          </div>
                          <div className="text-gray-600">
                            🎯 Activities: {formatCost(suggestion.costBreakdown.activities)}
                          </div>
                          <div className="text-gray-600">
                            🚗 Transport: {formatCost(suggestion.costBreakdown.transportation)}
                          </div>
                        </div>
                      </div>

                      {/* Booking Links */}
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href={suggestion.bookingLinks.hotels} 
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          🏨 Hotels <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href={suggestion.bookingLinks.flights} 
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                        >
                          ✈️ Flights <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href={suggestion.bookingLinks.cars} 
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          🚗 Cars <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href={suggestion.bookingLinks.packages} 
                          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          📦 Packages <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate New Suggestions */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => generateAISuggestions(params)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating New Ideas...
              </>
            ) : (
              '🤖 Generate New AI Suggestions'
            )}
          </Button>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-2">
            Need More Personalized Planning?
          </h3>
          <p className="mb-4 opacity-90">
            Our AI travel assistant can create detailed itineraries and answer specific questions about your trip.
          </p>
          <Button 
            variant="secondary"
            onClick={() => navigate('/ai-travel-buddy')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Chat with AI Travel Assistant
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AiTravelResults;