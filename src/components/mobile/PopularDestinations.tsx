import React from 'react';
import { MapPin, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PopularDestinationsProps {
  onDestinationClick?: (destination: string) => void;
}

const destinations = [
  { name: 'Beijing', country: 'China', image: '/lovable-uploads/beijing-placeholder.jpg' },
  { name: 'Shanghai', country: 'China', image: '/lovable-uploads/shanghai-placeholder.jpg' },
  { name: 'Kuala Lumpur', country: 'Malaysia', image: '/lovable-uploads/kl-placeholder.jpg' },
  { name: 'Singapore', country: 'Singapore', image: '/lovable-uploads/singapore-placeholder.jpg' },
];

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onDestinationClick }) => {
  const handleDestinationClick = (destination: string) => {
    onDestinationClick?.(destination);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-mobile-text-primary">Popular Destinations</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-mobile-border-color text-mobile-text-secondary hover:bg-mobile-dark-grey"
        >
          <Map className="w-4 h-4 mr-2" />
          Map
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {destinations.map((destination) => (
          <button
            key={destination.name}
            onClick={() => handleDestinationClick(destination.name)}
            className="relative group rounded-xl overflow-hidden bg-mobile-card-bg border border-mobile-border-color hover:border-mobile-primary-teal transition-colors"
          >
            {/* Placeholder for destination image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-mobile-primary-teal/20 to-mobile-primary-teal/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-mobile-primary-teal" />
            </div>
            
            {/* Destination Info */}
            <div className="p-3 text-left">
              <h3 className="font-semibold text-mobile-text-primary text-sm mb-1">{destination.name}</h3>
              <p className="text-xs text-mobile-text-secondary">{destination.country}</p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-mobile-primary-teal/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};