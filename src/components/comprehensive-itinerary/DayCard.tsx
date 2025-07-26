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
          </div>
        </CardContent>
      )}
    </Card>
  );
};