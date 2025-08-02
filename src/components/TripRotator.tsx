import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, ChevronDown } from "lucide-react";

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  summary: string;
  enhanced_flights_url: string;
  enhanced_hotels_url: string;
  event_name: string;
  event_date: string;
  budget?: number;
}

interface TripRotatorProps {
  trips: Trip[];
  onTripSelect?: (trip: Trip) => void;
}

export const TripRotator: React.FC<TripRotatorProps> = ({ trips, onTripSelect }) => {
  const [showAll, setShowAll] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const displayedTrips = showAll ? trips : trips.slice(0, 4);
  const hasMoreTrips = trips.length > 4;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {displayedTrips.map((trip) => (
          <Card
            key={trip.id}
            className="group transition-all duration-300 hover:scale-[1.02] bg-ai-travel-card border border-ai-travel-card-border/30 hover:border-ai-travel-card-border/60 backdrop-blur-sm p-6 relative overflow-hidden rounded-xl min-h-[280px]"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-ai-travel-card-border/10 to-transparent pointer-events-none rounded-xl" />
            
            <CardContent className="p-0 relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white text-xl font-semibold line-clamp-2 group-hover:text-ai-travel-button transition-colors flex-1">
                  {trip.name}
                </h3>
                {trip.budget && (
                  <div className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded ml-2 shrink-0">
                    ${trip.budget.toLocaleString()}
                  </div>
                )}
              </div>
              
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{trip.summary}</p>
              
              {trip.event_name && (
                <div className="flex items-center gap-2 text-ai-travel-button/80 text-sm mb-4">
                  <Calendar className="h-4 w-4" />
                  <span className="truncate">{trip.event_name}</span>
                </div>
              )}
              
              <div className="flex-1"></div>
              
              {/* Quick booking buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const destination = trip.name.split(' ')[0] || trip.name;
                    window.open(`https://www.expedia.com/Flights-Search?destination=${encodeURIComponent(destination)}&camref=1101l5dQSW`, '_blank');
                  }}
                  className="text-xs py-2 px-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded transition-colors"
                >
                  ✈️ Flights
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const destination = trip.name.split(' ')[0] || trip.name;
                    window.open(`https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&camref=1101l5dQSW`, '_blank');
                  }}
                  className="text-xs py-2 px-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded transition-colors"
                >
                  🏨 Hotels
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const destination = trip.name.split(' ')[0] || trip.name;
                    window.open(`https://www.expedia.com/Car-Search?destination=${encodeURIComponent(destination)}&camref=1101l5dQSW`, '_blank');
                  }}
                  className="text-xs py-2 px-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded transition-colors"
                >
                  🚗 Cars
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Show More Button */}
      {hasMoreTrips && !showAll && (
        <div className="text-center">
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-ai-travel-button/50 transition-colors"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Show More Trips ({trips.length - 4} more)
          </Button>
        </div>
      )}
      
      {/* Show Less Button */}
      {showAll && hasMoreTrips && (
        <div className="text-center">
          <Button
            onClick={() => setShowAll(false)}
            variant="outline"
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-ai-travel-button/50 transition-colors"
          >
            <ChevronDown className="h-4 w-4 mr-2 rotate-180" />
            Show Less
          </Button>
        </div>
      )}
    </div>
  );
};
