import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, MapPin } from "lucide-react";
import { FlightDisplayData, getAirlineLogo } from "@/utils/flightDataHelpers";

interface FlightDetailsCardProps {
  flight: FlightDisplayData;
  type: "departure" | "return";
  className?: string;
}

export function FlightDetailsCard({ flight, type, className }: FlightDetailsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {flight.airlineLogo ? (
                  <img 
                    src={flight.airlineLogo} 
                    alt={flight.airlineName}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      // Fallback to generic airline logo
                      const target = e.target as HTMLImageElement;
                      target.src = getAirlineLogo(flight.airlineCode);
                    }}
                  />
                ) : (
                  <Plane className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{flight.airlineName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{flight.flightNumber}</span>
                  <span>•</span>
                  <span>{flight.aircraft}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-1">
                {type === "departure" ? "Departure" : "Return"}
              </Badge>
              <p className="text-sm text-muted-foreground">{flight.date}</p>
            </div>
          </div>

          {/* Flight Route */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Departure */}
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-foreground">{flight.departureTime}</p>
              <p className="text-lg font-semibold text-muted-foreground">{flight.origin.code}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{flight.origin.city}</p>
            </div>

            {/* Route Line */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-full relative">
                <div className="h-0.5 bg-border w-full"></div>
                <Plane className="w-5 h-5 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-0.5" />
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{flight.duration}</span>
                </div>
                <p className="text-xs text-muted-foreground">{flight.stopDetails}</p>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-foreground">{flight.arrivalTime}</p>
              <p className="text-lg font-semibold text-muted-foreground">{flight.destination.code}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{flight.destination.city}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Cabin: {flight.cabin}</span>
              {flight.stops > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
