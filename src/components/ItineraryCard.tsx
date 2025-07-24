import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Star } from 'lucide-react';

interface StructuredItinerary {
  destination: string;
  dates: {
    start: string;
    end: string;
  };
  travelers: {
    count: number;
    rooms: number;
    isFamilyTrip: boolean;
  };
  overview: {
    title: string;
    summary: string;
  };
  themes: string[];
  images: string[];
  transportation: {
    arrival: string;
    local: string[];
    walkabilityScore: number;
  };
  flights: Array<{
    airline: string;
    from: string;
    to: string;
    duration: string;
    price: string;
    departure: string;
    arrival: string;
  }>;
  hotels: Array<{
    name: string;
    pricePerNight: string;
    rating: string;
    location: string;
    amenities: string[];
    link: string;
  }>;
  days: Array<{
    day: string;
    date: string;
    title: string;
    costEstimate: string;
    morning: string[];
    afternoon: string[];
    evening: string[];
  }>;
  culture_tips: {
    [key: string]: string;
  };
  sources: string[];
  buttons: string[];
}

interface ItineraryCardProps {
  data: StructuredItinerary;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ data }) => {
  const { 
    destination, 
    dates, 
    travelers, 
    overview, 
    themes, 
    images, 
    transportation,
    flights, 
    hotels, 
    days, 
    culture_tips, 
    sources,
    buttons 
  } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">{overview.title}</CardTitle>
              <p className="text-lg text-muted-foreground">{overview.summary}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {destination}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {dates.start} → {dates.end}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {travelers.count} travelers • {travelers.rooms} room(s)
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Themes */}
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, i) => (
          <Badge key={i} variant="secondary" className="text-sm">
            {theme}
          </Badge>
        ))}
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.slice(0, 6).map((src, i) => (
            <div key={i} className="aspect-video overflow-hidden rounded-lg">
              <img 
                src={src} 
                alt="Trip highlight" 
                className="w-full h-full object-cover transition-transform hover:scale-105" 
              />
            </div>
          ))}
        </div>
      )}

      {/* Transportation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✈️ How to Get There
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flights.map((flight, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{flight.airline}</div>
                    <div className="text-sm text-muted-foreground">
                      {flight.from} → {flight.to} • {flight.duration}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flight.departure} → {flight.arrival}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{flight.price}</div>
                    <Button size="sm" className="mt-2">Book Flight</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏨 Where to Stay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotels.map((hotel, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">{hotel.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{hotel.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">• {hotel.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {hotel.amenities.join(' • ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{hotel.pricePerNight}/night</div>
                    <Button size="sm" className="mt-2" asChild>
                      <a href={hotel.link} target="_blank" rel="noopener noreferrer">
                        Book Hotel
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Daily Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {days.map((day, i) => (
              <div key={i} className="border-l-4 border-primary/30 pl-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{day.day} – {day.title}</h3>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                  <Badge variant="outline">{day.costEstimate}</Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-amber-600">Morning</h4>
                    <ul className="space-y-1 text-sm">
                      {day.morning.map((activity, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Afternoon</h4>
                    <ul className="space-y-1 text-sm">
                      {day.afternoon.map((activity, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Evening</h4>
                    <ul className="space-y-1 text-sm">
                      {day.evening.map((activity, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Culture Adapter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌍 Culture Adapter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(culture_tips).map(([key, value], i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">{key}</h4>
                <p className="text-sm text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {buttons.map((buttonText, i) => (
          <Button key={i} variant="outline" className="text-sm">
            {buttonText}
          </Button>
        ))}
      </div>

      {/* Sources */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Sources: {sources.join(' • ')}
        </p>
      </div>
    </div>
  );
};