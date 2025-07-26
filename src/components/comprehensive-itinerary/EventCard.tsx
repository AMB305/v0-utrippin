// src/components/comprehensive-itinerary/EventCard.tsx

import React from 'react';
import { Clock, MapPin, DollarSign, ExternalLink, Utensils, Car, Home, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/lib/schemas';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dining':
        return <Utensils className="h-4 w-4" />;
      case 'transport':
        return <Car className="h-4 w-4" />;
      case 'accommodation':
        return <Home className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dining':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'transport':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accommodation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Time Badge */}
          <div className="flex-shrink-0">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time}
            </Badge>
          </div>
          
          {/* Event Image (if available) */}
          {event.imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h5 className="font-semibold text-lg leading-tight">{event.title}</h5>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              
              <Badge className={`ml-2 flex items-center gap-1 ${getTypeColor(event.type)}`}>
                {getTypeIcon(event.type)}
                {event.type}
              </Badge>
            </div>
            
            {/* Location and Cost */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {event.cost && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{event.cost}</span>
                </div>
              )}
            </div>
            
            {/* Booking Button */}
            {event.bookingUrl && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(event.bookingUrl, '_blank')}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Book Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};