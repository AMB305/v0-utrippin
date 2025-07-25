import React from 'react';
import { MapPin, Calendar, Star, Plane, Hotel, MapIcon } from 'lucide-react';

interface TripItineraryCardProps {
  destination: string;
  response: string;
  onBookNow?: () => void;
  onExploreMore?: (activity: string) => void;
}

export const TripItineraryCard: React.FC<TripItineraryCardProps> = ({
  destination, 
  response, 
  onBookNow, 
  onExploreMore 
}) => {
  // Generate trip details based on the destination and response
  const generateTripDetails = (dest: string) => {
    const destinations: Record<string, any> = {
      'colombia': {
        title: 'Colombia Adventure',
        dates: 'Available Year-Round',
        highlights: ['Cartagena Historic Center', 'Coffee Region Tours', 'Salsa Dancing', 'Caribbean Beaches'],
        rating: 4.8,
        estimatedCost: '$1,400',
        duration: '7-10 days'
      },
      'paris': {
        title: 'Paris Weekend Getaway', 
        dates: 'Perfect for Weekends',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre District'],
        rating: 4.9,
        estimatedCost: '$1,200',
        duration: '3-4 days'
      },
      'thailand': {
        title: 'Thailand Beach Paradise',
        dates: 'Nov-Apr (Best Season)',
        highlights: ['Phi Phi Islands', 'Bangkok Temples', 'Thai Cooking Classes', 'Island Hopping'],
        rating: 4.7,
        estimatedCost: '$1,600',
        duration: '10-14 days'
      },
      'tokyo': {
        title: 'Tokyo Family Adventure',
        dates: 'Spring/Fall Recommended',
        highlights: ['Tokyo Disneyland', 'Sensoji Temple', 'Shibuya Crossing', 'Robot Restaurant'],
        rating: 4.8,
        estimatedCost: '$2,200',
        duration: '7-10 days'
      },
      'kenya': {
        title: 'Kenya Luxury Safari',
        dates: 'Jul-Oct (Migration Season)',
        highlights: ['Masai Mara Game Drive', 'Big Five Safari', 'Luxury Lodge Stays', 'Cultural Visits'],
        rating: 4.9,
        estimatedCost: '$3,500',
        duration: '8-12 days'
      },
      'morocco': {
        title: 'Morocco Cultural Journey',
        dates: 'Mar-May, Sep-Nov',
        highlights: ['Marrakech Souks', 'Sahara Desert Camp', 'Atlas Mountains', 'Fez Medina'],
        rating: 4.6,
        estimatedCost: '$1,800',
        duration: '8-10 days'
      }
    };

    const key = dest.toLowerCase();
    return destinations[key] || {
      title: `${dest} Experience`,
      dates: 'Year-Round Availability',
      highlights: ['Local Culture', 'Must-See Attractions', 'Local Cuisine', 'Hidden Gems'],
      rating: 4.5,
      estimatedCost: '$1,500',
      duration: '7-10 days'
    };
  };

  const tripDetails = generateTripDetails(destination);

  return (
    <div className="mt-4 bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-2">
            <MapPin size={16} className="text-purple-400" />
            <span>{destination}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{tripDetails.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{tripDetails.dates}</span>
            </div>
            <div className="flex items-center gap-1">
              <Plane size={14} />
              <span>{tripDetails.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Star size={16} fill="currentColor" />
          <span className="font-semibold">{tripDetails.rating}</span>
        </div>
      </div>

      {/* Highlights */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">✨ Trip Highlights</h4>
        <div className="grid grid-cols-2 gap-2">
          {tripDetails.highlights.map((highlight: string, index: number) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm text-gray-300 bg-zinc-700/50 rounded-lg px-3 py-2 hover:bg-purple-600/20 hover:text-purple-200 transition-colors cursor-pointer"
              onClick={() => onExploreMore && onExploreMore(highlight)}
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cost and CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Estimated Cost</span>
          <span className="text-lg font-bold text-green-400">{tripDetails.estimatedCost}</span>
          <span className="text-xs text-gray-500">per person</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onExploreMore && onExploreMore('more details')}
            className="px-4 py-2 border border-purple-500/50 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-600/20 hover:border-purple-400 transition-colors"
          >
            Explore More
          </button>
          <button 
            onClick={onBookNow}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced ItineraryCard for structured data from edge function
interface StructuredItineraryProps {
  data: {
    destination?: string;
    overview?: { title: string; summary: string };
    days?: Array<{
      day: string;
      title: string;
      morning: string[];
      afternoon: string[];
      evening: string[];
    }>;
    themes?: string[];
    transportation?: { walkabilityScore: number };
    culture_tips?: Record<string, string>;
  };
  onBookNow?: () => void;
  onExploreMore?: (activity: string) => void;
}

export const StructuredItineraryCard: React.FC<StructuredItineraryProps> = ({ 
  data, 
  onBookNow, 
  onExploreMore 
}) => {
  if (!data) return null;

  const destination = data.destination || 'Your Destination';
  const title = data.overview?.title || `${destination} Adventure`;
  const summary = data.overview?.summary || 'Explore this amazing destination';
  const themes = data.themes || [];
  const walkabilityScore = data.transportation?.walkabilityScore || 75;

  // Extract highlights from first few activities
  const highlights = data.days?.slice(0, 2).flatMap(day => [
    ...day.morning.slice(0, 1),
    ...day.afternoon.slice(0, 1)
  ]).slice(0, 4) || ['Cultural Sites', 'Local Cuisine', 'Scenic Views', 'Local Markets'];

  return (
    <div className="mt-4 bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-2">
            <MapPin size={16} className="text-purple-400" />
            <span>{destination}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{data.days?.length || 4} days planned</span>
            </div>
            <div className="flex items-center gap-1">
              <MapIcon size={14} />
              <span>{walkabilityScore}% walkable</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Star size={16} fill="currentColor" />
          <span className="font-semibold">4.8</span>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
      </div>

      {/* Themes */}
      {themes.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {themes.slice(0, 4).map((theme, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">✨ Trip Highlights</h4>
        <div className="grid grid-cols-2 gap-2">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm text-gray-300 bg-zinc-700/50 rounded-lg px-3 py-2 hover:bg-purple-600/20 hover:text-purple-200 transition-colors cursor-pointer"
              onClick={() => onExploreMore && onExploreMore(highlight)}
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
              <span className="truncate">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Culture Tips */}
      {data.culture_tips && Object.keys(data.culture_tips).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">🎭 Culture Tips</h4>
          <div className="text-xs text-gray-400 space-y-1">
            {Object.entries(data.culture_tips).slice(0, 2).map(([key, value]) => (
              <div key={key}>
                <span className="text-purple-300">{key}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Estimated Cost</span>
          <span className="text-lg font-bold text-green-400">$1,200</span>
          <span className="text-xs text-gray-500">per person</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onExploreMore && onExploreMore('daily itinerary')}
            className="px-4 py-2 border border-purple-500/50 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-600/20 hover:border-purple-400 transition-colors"
          >
            Day by Day
          </button>
          <button 
            onClick={onBookNow}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Compatibility export for existing ChatContainer
interface LegacyItineraryCardProps {
  data: any;
}

export const ItineraryCard: React.FC<LegacyItineraryCardProps> = ({ data }) => {
  // Check if this is structured data from the edge function
  if (data?.destination && data?.overview) {
    return (
      <StructuredItineraryCard
        data={data}
        onBookNow={() => console.log('Book now clicked')}
        onExploreMore={(activity) => console.log('Explore more:', activity)}
      />
    );
  }

  // Fallback to simple card for legacy data
  const destination = data?.destination || data?.title || 'Your Destination';
  const response = data?.summary || 'Trip details';
  
  return (
    <TripItineraryCard
      destination={destination}
      response={response}
      onBookNow={() => console.log('Book now clicked')}
      onExploreMore={(activity) => console.log('Explore more:', activity)}
    />
  );
};