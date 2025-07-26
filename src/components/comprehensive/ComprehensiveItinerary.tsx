import React from 'react';
import { Calendar, MapPin, Users, Plane, Hotel, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BookingItem {
  name: string;
  price: string;
  rating?: number;
  imageUrl?: string;
  bookingLink: string;
  agentUrl?: string;
  amenities?: string[];
  description?: string;
}

interface BookingModule {
  title: string;
  items: BookingItem[];
  defaultUrl?: string;
}

interface Event {
  time: string;
  title: string;
  description?: string;
  type: 'activity' | 'transport' | 'dining' | 'accommodation';
  location?: string;
  cost?: string;
  imageUrl?: string;
  bookingUrl?: string;
}

interface DayPlan {
  day: string;
  date: string;
  title: string;
  events: Event[];
  totalEstimatedCost?: string;
}

interface CultureTip {
  category: string;
  title: string;
  content: string;
}

interface CategoryRecommendation {
  category: string;
  title: string;
  items: Array<{
    name: string;
    description: string;
    imageUrl?: string;
    location?: string;
    cost?: string;
  }>;
}

interface ComprehensiveItineraryData {
  itineraryId: string;
  tripTitle: string;
  destinationCity: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  travelStyle: string;
  introductoryMessage: string;
  imageCollageUrls: string[];
  bookingModules: {
    flights: BookingModule;
    accommodations: BookingModule;
  };
  dailyPlan: DayPlan[];
  additionalInfo: {
    cultureAdapter: CultureTip[];
    categoryBasedRecommendations: CategoryRecommendation[];
  };
  utility: {
    sources: string[];
    downloadPdfLink?: string;
  };
}

interface ComprehensiveItineraryProps {
  data: ComprehensiveItineraryData;
}

const EventTypeIcon = ({ type }: { type: Event['type'] }) => {
  const iconMap = {
    activity: MapPin,
    transport: Plane,
    dining: DollarSign,
    accommodation: Hotel,
  };
  const Icon = iconMap[type];
  return <Icon className="w-4 h-4" />;
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="flex gap-4 p-4 bg-card rounded-lg border">
    <div className="flex flex-col items-center min-w-0">
      <div className="text-sm font-medium text-primary">{event.time}</div>
      <div className="mt-2 p-2 rounded-full bg-primary/10">
        <EventTypeIcon type={event.type} />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-foreground">{event.title}</h4>
          {event.location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </p>
          )}
        </div>
        {event.cost && (
          <Badge variant="outline" className="text-xs">
            {event.cost}
          </Badge>
        )}
      </div>
      {event.description && (
        <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
      )}
      {event.imageUrl && (
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-32 object-cover rounded-md mt-3"
        />
      )}
    </div>
  </div>
);

const DayCard: React.FC<{ day: DayPlan }> = ({ day }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">{day.day}</CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {day.date}
          </p>
        </div>
        {day.totalEstimatedCost && (
          <Badge variant="secondary" className="text-sm">
            Total: {day.totalEstimatedCost}
          </Badge>
        )}
      </div>
      <h3 className="text-lg font-medium text-primary">{day.title}</h3>
    </CardHeader>
    <CardContent className="space-y-4">
      {day.events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </CardContent>
  </Card>
);

const BookingModuleCard: React.FC<{ module: BookingModule; icon: React.ElementType }> = ({ module, icon: Icon }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {module.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {module.items.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">{item.name}</h4>
            <Badge variant="outline">{item.price}</Badge>
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          )}
          {item.amenities && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.amenities.map((amenity, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
          <Button size="sm" className="w-full">
            Book Now
          </Button>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ImageCollage: React.FC<{ urls: string[] }> = ({ urls }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg overflow-hidden mb-6">
    {urls.slice(0, 6).map((url, index) => (
      <div key={index} className={`relative ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
        <img 
          src={url} 
          alt={`Destination ${index + 1}`}
          className="w-full h-32 md:h-40 object-cover"
        />
      </div>
    ))}
  </div>
);

export const ComprehensiveItinerary: React.FC<ComprehensiveItineraryProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{data.tripTitle}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {data.destinationCity}, {data.destinationCountry}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {data.startDate} - {data.endDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {data.numberOfTravelers} travelers
          </span>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">{data.introductoryMessage}</p>
      </div>

      {/* Image Collage */}
      <ImageCollage urls={data.imageCollageUrls} />

      {/* Booking Modules */}
      <div className="grid md:grid-cols-2 gap-6">
        <BookingModuleCard module={data.bookingModules.flights} icon={Plane} />
        <BookingModuleCard module={data.bookingModules.accommodations} icon={Hotel} />
      </div>

      {/* Daily Itinerary */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Daily Itinerary</h2>
        {data.dailyPlan.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>

      {/* Culture Adapter */}
      {data.additionalInfo.cultureAdapter.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Culture Adapter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.additionalInfo.cultureAdapter.map((tip, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Category Recommendations */}
      {data.additionalInfo.categoryBasedRecommendations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Recommendations</h2>
          {data.additionalInfo.categoryBasedRecommendations.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {category.items.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {item.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </p>
                    )}
                    {item.cost && (
                      <Badge variant="outline" className="text-xs">{item.cost}</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};