import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Star, Users, Camera, Utensils, Calendar, Home } from 'lucide-react';

interface DetailedItinerary {
  title: string;
  summary: string;
  dates?: { start: string; end: string };
  traveler_count?: number;
  rooms?: number;
  images?: string[];
  recommendations: Array<{
    category_name: string;
    places: Array<{
      name: string;
      description: string;
      type: string;
      image_url?: string;
      location?: string;
      rating?: number;
      price_range?: string;
      estimated_cost?: string;
      booking_url?: string;
    }>;
  }>;
  actionable_suggestions: string[];
  follow_up_questions: string[];
  culture_adapter?: {
    tipping_etiquette?: string;
    dining_customs?: string;
    public_behavior?: string;
    language_tips?: string;
    beach_etiquette?: string;
  };
  insights?: {
    transportation?: string;
    freeThings?: string;
    walkability?: string;
    kidsActivities?: string;
    malls?: string;
    safety?: string;
    bestLocalFoods?: string;
    bestLocalActivities?: string;
    nightlife?: string;
    gyms?: string;
  };
  cost_breakdown?: {
    daily_estimates?: Array<{
      day: number;
      transport?: string;
      food?: string;
      activities?: string;
      accommodation?: string;
    }>;
    total_estimated?: string;
  };
}

interface DetailedItineraryDisplayProps {
  itinerary: DetailedItinerary;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'day plan':
      return <Clock className="h-4 w-4 text-blue-400" />;
    case 'restaurant':
      return <Utensils className="h-4 w-4 text-yellow-400" />;
    case 'cultural site':
      return <MapPin className="h-4 w-4 text-purple-400" />;
    case 'bar/club/entertainment':
      return <Users className="h-4 w-4 text-pink-400" />;
    case 'activity':
      return <MapPin className="h-4 w-4 text-green-400" />;
    case 'hotel':
      return <Home className="h-4 w-4 text-indigo-400" />;
    default:
      return <MapPin className="h-4 w-4 text-slate-400" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'day plan':
      return 'border-blue-500/30 bg-blue-950/20';
    case 'restaurant':
      return 'border-yellow-500/30 bg-yellow-950/20';
    case 'cultural site':
      return 'border-purple-500/30 bg-purple-950/20';
    case 'bar/club/entertainment':
      return 'border-pink-500/30 bg-pink-950/20';
    case 'activity':
      return 'border-green-500/30 bg-green-950/20';
    case 'hotel':
      return 'border-indigo-500/30 bg-indigo-950/20';
    default:
      return 'border-slate-500/30 bg-slate-950/20';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const DetailedItineraryDisplay: React.FC<DetailedItineraryDisplayProps> = ({ itinerary }) => {
  const [expandedCulture, setExpandedCulture] = useState<string | null>(null);
  
  const toggleCultureSection = (section: string) => {
    setExpandedCulture(expandedCulture === section ? null : section);
  };

  return (
    <div className="space-y-8 text-slate-200">
      {/* Header Section */}
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-white">{itinerary.title}</h3>
        <p className="text-slate-300 leading-relaxed text-lg">{itinerary.summary}</p>
        
        {/* Trip Details */}
        {(itinerary.dates || itinerary.traveler_count || itinerary.rooms) && (
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {itinerary.dates && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(itinerary.dates.start)} → {formatDate(itinerary.dates.end)}</span>
              </div>
            )}
            {itinerary.traveler_count && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{itinerary.traveler_count} traveller{itinerary.traveler_count > 1 ? 's' : ''}</span>
              </div>
            )}
            {itinerary.rooms && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>{itinerary.rooms} room{itinerary.rooms > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Grid */}
      {itinerary.images && itinerary.images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-500/30 pb-2">
            <Camera className="h-5 w-5 inline mr-2" />
            Destination Preview
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden">
            {itinerary.images.slice(0, 5).map((image, index) => (
              <div key={index} className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                <img 
                  src={image} 
                  alt={`Destination view ${index + 1}`}
                  className="w-full h-48 md:h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                {index === 4 && itinerary.images!.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                    <span className="text-white text-xl font-semibold">
                      +{itinerary.images!.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Timeline */}
      <div className="space-y-6">
        {itinerary.recommendations
          .filter(category => category.category_name.toLowerCase().includes('day'))
          .map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-4">
              <h4 className="text-xl font-semibold text-blue-400 border-b border-blue-500/30 pb-2">
                {day.category_name}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {day.places.map((place, placeIndex) => (
                  <div 
                    key={placeIndex}
                    className={`p-4 rounded-2xl border ${getTypeColor(place.type)} backdrop-blur-sm hover:bg-opacity-80 transition-all duration-200`}
                  >
                    {place.image_url && (
                      <img 
                        src={place.image_url} 
                        alt={place.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    )}
                    <div className="flex items-start gap-3">
                      {getTypeIcon(place.type)}
                      <div className="flex-1">
                        <h5 className="font-semibold text-white mb-1">{place.name}</h5>
                        <p className="text-sm text-slate-300 leading-relaxed mb-2">{place.description}</p>
                        
                        {place.location && (
                          <p className="text-xs text-slate-400 mb-2">{place.location}</p>
                        )}
                        
                        <div className="flex items-center justify-between mb-2">
                          {place.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-slate-400">{place.rating}</span>
                            </div>
                          )}
                          {place.estimated_cost && (
                            <span className="text-xs text-green-400">{place.estimated_cost}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="inline-block px-2 py-1 text-xs bg-slate-700/50 rounded-full text-slate-400">
                            {place.type}
                          </span>
                          {place.booking_url && (
                            <a 
                              href={place.booking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors duration-200"
                            >
                              Book
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cost Breakdown for this day */}
              {itinerary.cost_breakdown?.daily_estimates?.find(est => est.day === dayIndex + 1) && (
                <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                  <h6 className="font-medium text-white mb-2">Estimated Daily Costs</h6>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(itinerary.cost_breakdown.daily_estimates.find(est => est.day === dayIndex + 1)!)
                      .filter(([key]) => key !== 'day')
                      .map(([category, amount]) => (
                        <div key={category}>
                          <span className="text-slate-400 capitalize">{category}: </span>
                          <span className="text-green-400">{amount}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Restaurant Recommendations */}
      {itinerary.recommendations
        .filter(category => 
          category.category_name.toLowerCase().includes('dining') || 
          category.category_name.toLowerCase().includes('restaurant') ||
          category.category_name.toLowerCase().includes('food')
        )
        .map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <h4 className="text-lg font-semibold text-yellow-400 border-b border-yellow-500/30 pb-2">
              <Utensils className="h-5 w-5 inline mr-2" />
              {category.category_name}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.places.map((place, placeIndex) => (
                <div 
                  key={placeIndex}
                  className="p-4 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 backdrop-blur-sm"
                >
                  {place.image_url && (
                    <img 
                      src={place.image_url} 
                      alt={place.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  )}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-white">{place.name}</h5>
                    <p className="text-sm text-slate-300">{place.description}</p>
                    {place.location && <p className="text-xs text-slate-400">{place.location}</p>}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {place.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs">{place.rating}</span>
                          </div>
                        )}
                        {place.price_range && (
                          <span className="text-xs text-green-400">{place.price_range}</span>
                        )}
                      </div>
                      {place.booking_url && (
                        <a 
                          href={place.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-500 text-white rounded-full transition-colors duration-200"
                        >
                          Reserve
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Other Recommendations (existing categories) */}
      <div className="space-y-6">
        {itinerary.recommendations
          .filter(category => 
            !category.category_name.toLowerCase().includes('day') &&
            !category.category_name.toLowerCase().includes('dining') &&
            !category.category_name.toLowerCase().includes('restaurant') &&
            !category.category_name.toLowerCase().includes('food')
          )
          .map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-500/30 pb-2">
                {category.category_name}
              </h4>
              
              <div className="space-y-3">
                {category.places.map((place, placeIndex) => (
                  <div 
                    key={placeIndex}
                    className={`p-4 rounded-lg border ${getTypeColor(place.type)} backdrop-blur-sm`}
                  >
                    <div className="flex items-start gap-3">
                      {getTypeIcon(place.type)}
                      <div className="flex-1">
                        <h5 className="font-semibold text-white mb-1">{place.name}</h5>
                        <p className="text-sm text-slate-300 leading-relaxed">{place.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-slate-700/50 rounded-full text-slate-400">
                          {place.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Total Cost Estimate */}
      {itinerary.cost_breakdown?.total_estimated && (
        <div className="bg-green-950/20 border border-green-500/30 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-2">
            <DollarSign className="h-5 w-5 inline mr-2" />
            Total Estimated Cost
          </h4>
          <p className="text-2xl font-bold text-white">{itinerary.cost_breakdown.total_estimated}</p>
        </div>
      )}

      {/* Actionable Suggestions */}
      {itinerary.actionable_suggestions && itinerary.actionable_suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
            <DollarSign className="h-5 w-5 inline mr-2" />
            Smart Travel Tips
          </h4>
          <div className="space-y-2">
            {itinerary.actionable_suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-300">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culture Adapter */}
      {itinerary.culture_adapter && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
            Culture Adapter
          </h4>
          <div className="space-y-2">
            {Object.entries(itinerary.culture_adapter).map(([key, value]) => {
              if (!value) return null;
              const titles = {
                tipping_etiquette: 'Tipping Etiquette 💰',
                dining_customs: 'Dining Customs 🍽️',
                public_behavior: 'Public Behavior 🚶',
                language_tips: 'Language Tips 💬',
                beach_etiquette: 'Beach Etiquette 🏖️'
              };
              
              return (
                <details 
                  key={key} 
                  className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-3 cursor-pointer"
                  open={expandedCulture === key}
                  onClick={() => toggleCultureSection(key)}
                >
                  <summary className="font-medium text-purple-300">
                    {titles[key as keyof typeof titles] || key.replace('_', ' ')}
                  </summary>
                  <p className="mt-2 text-sm text-slate-300">{value}</p>
                </details>
              );
            })}
          </div>
        </div>
      )}

      {/* Local Insights */}
      {itinerary.insights && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-500/30 pb-2">Local Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(itinerary.insights).map(([key, value]) => {
              if (!value) return null;
              
              const insightTitles = {
                transportation: 'Transportation 🚆',
                freeThings: 'Free Things 🎁',
                walkability: 'Walkability 🚶‍♀️',
                kidsActivities: 'Kids Activities 🧒',
                malls: 'Malls & Shopping 🛍️',
                safety: 'Safety 🦺',
                bestLocalFoods: 'Best Local Foods 🍽️',
                bestLocalActivities: 'Best Local Activities 🎟️',
                nightlife: 'Nightlife 🌃',
                gyms: 'Gyms & Fitness 💪'
              };

              return (
                <div key={key} className="p-4 bg-gray-800 rounded-2xl shadow-soft">
                  <h3 className="font-medium mb-2 text-white">
                    {insightTitles[key as keyof typeof insightTitles] || key}
                  </h3>
                  <p className="text-sm text-slate-300">{value}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Follow-up Questions */}
      {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
            Want to explore more?
          </h4>
          <div className="space-y-2">
            {itinerary.follow_up_questions.map((question, index) => (
              <div key={index} className="text-sm text-slate-300 bg-purple-950/20 border border-purple-500/30 rounded-lg p-3">
                {question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
