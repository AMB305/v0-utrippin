import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plane, Hotel, Clock, DollarSign, Star, Heart, Share2, Download, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExpediaButton } from '@/components/ExpediaButton';

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
  return <Icon className="w-5 h-5" />;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : star <= rating 
            ? 'fill-yellow-200 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))}
    <span className="text-sm font-medium ml-1">{rating}</span>
  </div>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]">
    <div className="flex gap-6">
      <div className="flex flex-col items-center min-w-0 relative">
        <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-bold shadow-md">
          {event.time}
        </div>
        <div className="mt-4 p-3 rounded-full bg-gradient-primary shadow-glow">
          <EventTypeIcon type={event.type} />
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent mt-4"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {event.title}
            </h4>
            {event.location && (
              <p className="text-muted-foreground flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                {event.location}
              </p>
            )}
          </div>
          {event.cost && (
            <Badge variant="secondary" className="bg-gradient-subtle border-0 text-foreground font-bold px-3 py-1">
              {event.cost}
            </Badge>
          )}
        </div>
        
        {event.description && (
          <p className="text-muted-foreground leading-relaxed mb-4">{event.description}</p>
        )}
        
        {event.imageUrl && (
          <div className="relative overflow-hidden rounded-lg mb-4 shadow-md">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}
        
        {event.bookingUrl && (
          <Button size="sm" className="mt-2 bg-gradient-primary hover:opacity-90 transition-opacity">
            Book Experience
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  </div>
);

const DayCard: React.FC<{ day: DayPlan; dayIndex: number }> = ({ day, dayIndex }) => {
  const [isExpanded, setIsExpanded] = useState(dayIndex === 0);
  
  return (
    <Card className="overflow-hidden border-0 shadow-elegant bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm">
      <CardHeader 
        className="cursor-pointer hover:bg-accent/50 transition-colors relative overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
              {dayIndex + 1}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">{day.day}</CardTitle>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {day.date}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {day.totalEstimatedCost && (
              <Badge variant="secondary" className="bg-gradient-subtle border-0 text-foreground font-bold px-4 py-2 text-base">
                Total: {day.totalEstimatedCost}
              </Badge>
            )}
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </div>
        </div>
        <h3 className="relative text-xl font-bold text-primary mt-2">{day.title}</h3>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-8 space-y-6 bg-gradient-to-b from-background/50 to-background">
          {day.events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </CardContent>
      )}
    </Card>
  );
};

const BookingModuleCard: React.FC<{ module: BookingModule; icon: React.ElementType }> = ({ module, icon: Icon }) => (
  <Card className="overflow-hidden border-0 shadow-elegant bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
    <CardHeader className="bg-gradient-subtle relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
      <CardTitle className="relative flex items-center gap-3 text-2xl font-bold">
        <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        {module.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 space-y-6">
      {module.items.map((item, index) => (
        <div key={index} className="group bg-gradient-to-br from-background to-background/80 border border-border/50 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.name}
              </h4>
              {item.rating && <StarRating rating={item.rating} />}
            </div>
            <Badge variant="outline" className="bg-gradient-subtle border-primary/20 text-foreground font-bold text-lg px-4 py-2">
              {item.price}
            </Badge>
          </div>
          
          {item.imageUrl && (
            <div className="relative overflow-hidden rounded-lg mb-4 shadow-md">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          
          {item.description && (
            <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>
          )}
          
          {item.amenities && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.amenities.map((amenity, i) => (
                <Badge key={i} variant="secondary" className="bg-gradient-subtle border-0 text-foreground/80">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
          
          <ExpediaButton
            destinationUrl={item.bookingLink}
            label="Book with Expedia"
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-bold py-3 text-lg shadow-glow"
          />
        </div>
      ))}
    </CardContent>
  </Card>
);

const ImageCollage: React.FC<{ urls: string[]; tripTitle: string; destination: string; dates: string }> = ({ 
  urls, 
  tripTitle, 
  destination, 
  dates 
}) => (
  <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-elegant mb-12">
    {urls.slice(0, 6).map((url, index) => (
      <div key={index} className={`relative group ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
        <img 
          src={url} 
          alt={`${destination} ${index + 1}`}
          className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
      </div>
    ))}
    
    {/* Overlay with trip info */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
      <div className="p-8 text-white w-full">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{tripTitle}</h1>
        <div className="flex flex-wrap gap-6 text-lg">
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {destination}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {dates}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const ComprehensiveItinerary: React.FC<ComprehensiveItineraryProps> = ({ data }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero Image Collage */}
        <ImageCollage 
          urls={data.imageCollageUrls} 
          tripTitle={data.tripTitle}
          destination={`${data.destinationCity}, ${data.destinationCountry}`}
          dates={`${data.startDate} - ${data.endDate}`}
        />

        {/* Trip Actions Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-card to-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-elegant">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span className="font-medium">{data.numberOfTravelers} travelers</span>
            </div>
            <Badge variant="outline" className="bg-gradient-subtle border-primary/20 text-foreground">
              {data.travelStyle}
            </Badge>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className="bg-gradient-subtle border-border/50 hover:bg-accent/50"
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              Save
            </Button>
            <Button variant="outline" size="sm" className="bg-gradient-subtle border-border/50 hover:bg-accent/50">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-gradient-subtle border-border/50 hover:bg-accent/50">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Introduction */}
        <div className="text-center bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-elegant">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            {data.introductoryMessage}
          </p>
        </div>

        {/* Booking Modules */}
        <div className="grid lg:grid-cols-2 gap-8">
          <BookingModuleCard module={data.bookingModules.flights} icon={Plane} />
          <BookingModuleCard module={data.bookingModules.accommodations} icon={Hotel} />
        </div>

        {/* Daily Itinerary */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Your Daily Adventure
          </h2>
          <div className="space-y-6">
            {data.dailyPlan.map((day, index) => (
              <DayCard key={index} day={day} dayIndex={index} />
            ))}
          </div>
        </div>

        {/* Culture Adapter */}
        {data.additionalInfo.cultureAdapter.length > 0 && (
          <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-subtle relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
              <CardTitle className="relative text-3xl font-bold text-center">Culture Adapter</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {data.additionalInfo.cultureAdapter.map((tip, index) => (
                  <div key={index} className="bg-gradient-to-br from-background to-background/80 border-l-4 border-primary p-6 rounded-lg shadow-md">
                    <h4 className="text-xl font-bold text-primary mb-3">{tip.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Recommendations */}
        {data.additionalInfo.categoryBasedRecommendations.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
              Local Recommendations
            </h2>
            <div className="grid gap-8">
              {data.additionalInfo.categoryBasedRecommendations.map((category, index) => (
                <Card key={index} className="border-0 shadow-elegant bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-subtle relative">
                    <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
                    <CardTitle className="relative text-2xl font-bold">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.items.map((item, i) => (
                        <div key={i} className="bg-gradient-to-br from-background to-background/80 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                          {item.imageUrl && (
                            <div className="relative overflow-hidden rounded-lg mb-4 shadow-sm">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <h4 className="text-lg font-bold text-foreground mb-2">{item.name}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.description}</p>
                          {item.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </p>
                          )}
                          {item.cost && (
                            <Badge variant="outline" className="bg-gradient-subtle border-primary/20 text-foreground">
                              {item.cost}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-border/50">
          <p className="text-muted-foreground">
            Crafted with ✈️ by Keila • Sources: {data.utility.sources.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};