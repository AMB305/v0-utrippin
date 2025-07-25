import React from 'react';
import { MapPin, Plane, Hotel, Calendar, Star } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { BlurFade } from '@/components/magicui/blur-fade';

interface TripCard {
  title: string;
  location: string;
  dates: string;
  highlights: string[];
  rating: number;
  estimatedCost?: string;
}

interface FeaturedTripCardsProps {
  trips?: TripCard[];
  title?: string;
  onBookTrip?: (trip: TripCard) => void;
}

const defaultTrips: TripCard[] = [
  {
    title: 'Cancun Adventure',
    location: 'Cancun, Mexico',
    dates: 'Aug 1–4',
    highlights: ['Beaches', 'Nightlife', 'All-Inclusive Resorts'],
    rating: 4.8,
    estimatedCost: '$1,200',
  },
  {
    title: 'Barcelona Explorer',
    location: 'Barcelona, Spain',
    dates: 'Oct 10–16',
    highlights: ['Gothic Quarter', 'Montserrat Hike', 'Bike Tours'],
    rating: 4.9,
    estimatedCost: '$1,800',
  },
  {
    title: 'Family Trip to Orlando',
    location: 'Orlando, Florida',
    dates: 'Sept 5–9',
    highlights: ['Disney World', 'Universal Studios', 'Water Parks'],
    rating: 4.7,
    estimatedCost: '$2,500',
  },
];

const FeaturedTripCards: React.FC<FeaturedTripCardsProps> = ({ 
  trips = defaultTrips, 
  title = "🌟 Featured Trips You Might Love",
  onBookTrip 
}) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  const handleBookTrip = (trip: TripCard) => {
    if (onBookTrip) {
      onBookTrip(trip);
    } else {
      console.log('Booking trip:', trip);
    }
  };

  return (
    <div ref={elementRef} className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-white text-xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip, idx) => (
          <BlurFade 
            key={idx} 
            delay={idx * 0.2} 
            inView={isIntersecting}
            className="bg-zinc-800/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
          >
            <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-1">
              <MapPin size={14} /> {trip.location}
            </div>
            <h3 className="text-lg text-white font-semibold mb-2 leading-tight">{trip.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Calendar size={14} /> {trip.dates}
            </div>
            <div className="mb-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {trip.highlights.slice(0, 3).map((highlight, i) => (
                  <span 
                    key={i}
                    className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              {trip.highlights.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{trip.highlights.length - 3} more activities
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star size={12} fill="currentColor" /> {trip.rating.toFixed(1)}
                </span>
                {trip.estimatedCost && (
                  <span className="text-xs text-gray-400">From {trip.estimatedCost}</span>
                )}
              </div>
              <button 
                onClick={() => handleBookTrip(trip)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                Book Now
              </button>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTripCards;