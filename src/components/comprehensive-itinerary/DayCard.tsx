// src/components/comprehensive-itinerary/DayCard.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DayPlan, Event } from '@/lib/schemas';
import { EventCard } from './EventCard';

interface DayCardProps {
  day: DayPlan;
  defaultExpanded?: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({ day, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const groupEventsByType = (events: Event[]) => {
    const grouped = events.reduce((acc, event) => {
      if (!acc[event.type]) acc[event.type] = [];
      acc[event.type].push(event);
      return acc;
    }, {} as Record<string, Event[]>);
    
    return grouped;
  };

  const groupedEvents = groupEventsByType(day.events);

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">{day.day}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(day.date)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h4 className="font-medium">{day.title}</h4>
              {day.totalEstimatedCost && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  {day.totalEstimatedCost}
                </div>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="animate-accordion-down">
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([type, events]) => (
              <div key={type} className="space-y-3">
                <h4 className="font-medium text-primary capitalize border-b pb-2">
                  {type === 'activity' ? 'Activities & Attractions' : 
                   type === 'transport' ? 'Transportation' :
                   type === 'dining' ? 'Dining' : 
                   'Accommodation'}
                </h4>
                
                <div className="grid gap-3">
                  {events.map((event, index) => (
                    <EventCard key={index} event={event} />
                  ))}
                </div>
              </div>
            ))}

            {/* Nice to Know Section */}
            {day.niceToKnow && (
              <div className="mt-8 p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                <h4 className="font-semibold text-lg mb-4 text-primary">✨ Nice to Know</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  
                  <div>
                    <h5 className="font-medium mb-2">🆓 Free Things to Do</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.freeThingsToDo.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🍽️ Food Options</h5>
                    <p className="text-muted-foreground mb-1"><strong>Budget:</strong> {day.niceToKnow.foodOptions.budget}</p>
                    <p className="text-muted-foreground"><strong>Splurge:</strong> {day.niceToKnow.foodOptions.splurge}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🏖️ Beaches</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.beaches.map((beach, i) => (
                        <li key={i}>{beach}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">👟 Walkability</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.walkability}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🚕 Transportation</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.transportation}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🛍️ Shopping</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.mallOptions.map((mall, i) => (
                        <li key={i}>{mall}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🌃 Nightlife</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.nightlife.map((spot, i) => (
                        <li key={i}>{spot}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🧸 Kids Activities</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.kidsActivities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🍳 Best Breakfast</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.bestBreakfast}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">☕ Best Coffee</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.bestCoffeeShop}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🗺️ Tours</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.tours.map((tour, i) => (
                        <li key={i}>{tour}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🏥 Medical</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.hospital}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🛒 Grocery Stores</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.groceryStores.map((store, i) => (
                        <li key={i}>{store}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">💊 Drug Stores</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.drugStores.map((store, i) => (
                        <li key={i}>{store}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🌿 Parks</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.parks.map((park, i) => (
                        <li key={i}>{park}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🎣 Fishing</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {day.niceToKnow.fishingSpots.map((spot, i) => (
                        <li key={i}>{spot}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🐎 Horseback Riding</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.horsebackRiding}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🏀 Sporting Events</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.sportingEvents}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🗻 Scenic Routes</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.scenicRoutes}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">💅 Nail Salon</h5>
                    <p className="text-muted-foreground">{day.niceToKnow.nailSalon}</p>
                  </div>

                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};