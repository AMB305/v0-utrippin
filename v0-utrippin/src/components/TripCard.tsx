import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Heart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SavedTrip {
  id: string;
  trip_name: string;
  destination: string;
  summary: string;
  created_at: string;
  image_url?: string;
  is_favorite: boolean;
}

interface TripCardProps {
  trip: SavedTrip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-200 group">
      {/* Trip Image or Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600">
        {trip.image_url ? (
          <img 
            src={trip.image_url} 
            alt={trip.trip_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-white/70" />
          </div>
        )}
        
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
          <Heart 
            className={`w-4 h-4 ${
              trip.is_favorite 
                ? 'text-red-500 fill-red-500' 
                : 'text-white'
            }`} 
          />
        </button>
      </div>

      {/* Trip Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {trip.trip_name}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{trip.destination}</span>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {trip.summary}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Saved {formatDate(trip.created_at)}</span>
          </div>
          
          <Button
            onClick={() => navigate(`/trip-board/${trip.id}`)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform"
          >
            View Board
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
