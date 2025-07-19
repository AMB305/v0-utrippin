import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plane, Hotel } from "lucide-react";

interface TripRecommendation {
  id: string;
  name: string;
  summary: string;
  enhanced_flights_url: string;
  enhanced_hotels_url: string;
  enhanced_cars_url?: string;
  reason: string;
}

interface TripRecommendationCardProps {
  trip: TripRecommendation;
}

export const TripRecommendationCard: React.FC<TripRecommendationCardProps> = ({ trip }) => {
  return (
    <Card className="bg-ai-travel-card border border-white/20 hover:border-ai-travel-button/50 transition-all duration-300 mb-3">
      <CardContent className="p-4">
        <h4 className="text-white font-semibold text-sm mb-1">{trip.name}</h4>
        <p className="text-white/70 text-xs mb-2 line-clamp-2">{trip.summary}</p>
        <p className="text-ai-travel-button text-xs mb-3 italic">{trip.reason}</p>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8 bg-transparent border-ai-travel-button/30 text-ai-travel-button hover:bg-ai-travel-button/10 hover:border-ai-travel-button"
            onClick={() => window.open(trip.enhanced_flights_url, '_blank')}
          >
            <Plane className="h-3 w-3 mr-1" />
            Flights
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8 bg-transparent border-ai-travel-button/30 text-ai-travel-button hover:bg-ai-travel-button/10 hover:border-ai-travel-button"
            onClick={() => window.open(trip.enhanced_hotels_url, '_blank')}
          >
            <Hotel className="h-3 w-3 mr-1" />
            Hotels
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8 bg-transparent border-ai-travel-button/30 text-ai-travel-button hover:bg-ai-travel-button/10 hover:border-ai-travel-button"
            onClick={() => window.open(trip.enhanced_cars_url || `https://utrippin.com/cars?location=${encodeURIComponent(trip.name)}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Cars
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};