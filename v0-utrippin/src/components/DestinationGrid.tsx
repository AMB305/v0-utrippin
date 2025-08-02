import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Building } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  per?: string;
  img?: string;
  country?: string;
  slug?: string;
}

interface DestinationGridProps {
  destinations: Destination[];
  onDestinationClick?: (destination: Destination) => void;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  onDestinationClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {destinations.map((destination) => (
        <Card
          key={destination.id}
          className="group cursor-pointer overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          onClick={() => onDestinationClick?.(destination)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={destination.img || '/placeholder.svg'}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            
            {/* Destination name overlay */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
              <p className="text-sm opacity-90 uppercase tracking-wider">
                {destination.country || 'Destination'}
              </p>
            </div>

            {/* Category badge */}
            {destination.category && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {destination.category}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            {/* Pricing information */}
            {destination.price && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-medium">₹{destination.price.toLocaleString()}</span>
                  {destination.per && <span>/{destination.per}</span>}
                </div>
              </div>
            )}

            {/* Description */}
            {destination.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {destination.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
