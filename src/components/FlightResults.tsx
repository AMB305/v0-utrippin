import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, Calendar } from "lucide-react";

// Mock flight results data
const flightResults = [
  {
    id: 1,
    airline: "Delta Airlines",
    logo: "🛫",
    departure: { time: "8:30 AM", airport: "JFK", city: "New York" },
    arrival: { time: "9:45 PM", airport: "LHR", city: "London" },
    duration: "7h 15m",
    stops: "Non-stop",
    price: 459,
    class: "Economy",
    availability: "8 seats left"
  },
  {
    id: 2,
    airline: "British Airways",
    logo: "✈️",
    departure: { time: "11:15 AM", airport: "JFK", city: "New York" },
    arrival: { time: "11:30 PM", airport: "LHR", city: "London" },
    duration: "7h 15m",
    stops: "Non-stop",
    price: 523,
    class: "Economy",
    availability: "12 seats left"
  },
  {
    id: 3,
    airline: "American Airlines",
    logo: "🛬",
    departure: { time: "2:45 PM", airport: "JFK", city: "New York" },
    arrival: { time: "7:20 AM+1", airport: "NRT", city: "Tokyo" },
    duration: "14h 35m",
    stops: "1 stop in LAX",
    price: 1234,
    class: "Economy",
    availability: "3 seats left"
  },
  {
    id: 4,
    airline: "Iberia",
    logo: "🛫",
    departure: { time: "6:20 PM", airport: "JFK", city: "New York" },
    arrival: { time: "8:35 AM+1", airport: "MAD", city: "Madrid" },
    duration: "7h 15m",
    stops: "Non-stop",
    price: 387,
    class: "Economy",
    availability: "15 seats left"
  }
];

const FlightResults = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flight Results</h2>
        <p className="text-muted-foreground">{flightResults.length} flights found</p>
      </div>

      <div className="space-y-4">
        {flightResults.map((flight) => (
          <Card key={flight.id} className="p-6 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between">
              {/* Flight Info */}
              <div className="flex items-center space-x-6 flex-1">
                {/* Airline */}
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{flight.logo}</span>
                  <div>
                    <p className="font-medium text-sm">{flight.airline}</p>
                    <p className="text-xs text-muted-foreground">{flight.class}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-center">
                    <p className="font-bold text-lg">{flight.departure.time}</p>
                    <p className="text-sm font-medium">{flight.departure.airport}</p>
                    <p className="text-xs text-muted-foreground">{flight.departure.city}</p>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{flight.duration}</span>
                    </div>
                    <div className="flex items-center my-2">
                      <div className="w-4 h-4 border-2 border-primary rounded-full"></div>
                      <div className="flex-1 h-0.5 bg-border mx-2"></div>
                      <Plane className="w-4 h-4 text-primary" />
                      <div className="flex-1 h-0.5 bg-border mx-2"></div>
                      <div className="w-4 h-4 border-2 border-primary rounded-full bg-primary"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">{flight.stops}</p>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-lg">{flight.arrival.time}</p>
                    <p className="text-sm font-medium">{flight.arrival.airport}</p>
                    <p className="text-xs text-muted-foreground">{flight.arrival.city}</p>
                  </div>
                </div>
              </div>

              {/* Price and Book */}
              <div className="text-right ml-6">
                <div className="mb-2">
                  <p className="text-2xl font-bold text-primary">${flight.price}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
                <Badge variant="secondary" className="mb-3 text-xs">
                  {flight.availability}
                </Badge>
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    Select Flight
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline" className="px-8">
          Load More Flights
        </Button>
      </div>
    </div>
  );
};

export default FlightResults;