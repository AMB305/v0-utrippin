import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, ExternalLink, Clock } from "lucide-react";

interface TripComFlight {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengers: string;
  departTime: string;
  returnTime: string;
  price: string;
}

interface TripComFlightResultsProps {
  tripComFlights: TripComFlight[];
}

const generateTripComDeepLink = ({ origin, destination, departDate, returnDate, passengers }: TripComFlight) => {
  const depart = new Date(departDate);
  const returnD = new Date(returnDate);
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }).replace(/\//g, "");

  const formattedDepart = formatDate(depart);
  const formattedReturn = formatDate(returnD);

  return `https://www.aviasales.com/search/${origin}${formattedDepart}${destination}${formattedReturn}${passengers}?marker=650105`;
};

const TripComFlightResults: React.FC<TripComFlightResultsProps> = ({ tripComFlights }) => {
  if (!tripComFlights || tripComFlights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {tripComFlights.map((flight, idx) => {
        const link = generateTripComDeepLink(flight);
        return (
          <Card key={idx} className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {flight.origin} → {flight.destination}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flight.passengers} passenger{flight.passengers !== '1' ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Partner Offer
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Departure</span>
                  </div>
                  <p className="font-medium">{flight.departTime}</p>
                  <p className="text-sm text-muted-foreground">{new Date(flight.departDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Return</span>
                  </div>
                  <p className="font-medium">{flight.returnTime}</p>
                  <p className="text-sm text-muted-foreground">{new Date(flight.returnDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">${flight.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by Trip.com, official affiliate of Utrippin!
                  </p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View on Trip.com
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TripComFlightResults;