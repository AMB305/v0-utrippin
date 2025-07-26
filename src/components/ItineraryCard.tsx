// FILE: src/components/ItineraryCard.tsx

import React from 'react';
import { DetailedItinerary } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Lightbulb, Check } from 'lucide-react';

interface ItineraryCardProps {
  itinerary: DetailedItinerary;
}

const DayPlan = ({ day }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
        {day.day.replace('Day ', '')}
      </div>
      <h4 className="font-semibold text-lg text-gray-800">{day.title}</h4>
    </div>
    <ul className="pl-11 list-none">
      {day.activities.map((activity, index) => (
        <li key={index} className="flex items-start text-gray-600 mb-1">
          <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
          <span>{activity}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  if (!itinerary) {
    return null;
  }

  return (
    <Card className="!bg-white !text-gray-900 w-full max-w-2xl mx-auto shadow-xl rounded-2xl border-0">
      <CardHeader className="p-6">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <MapPin size={16} />
          <span className="font-medium">{itinerary.destination}</span>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">{itinerary.overview.title}</CardTitle>
        <CardDescription className="text-gray-600 pt-2">{itinerary.overview.summary}</CardDescription>
      </CardHeader>
      
      <Separator />

      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Your Day-by-Day Plan</h3>
        <div className="day-plans">
          {itinerary.days.map((day, index) => (
            <DayPlan key={index} day={day} />
          ))}
        </div>

        {itinerary.actionable_suggestions && (
          <div className="mt-4 pt-6 border-t">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Lightbulb size={20} className="mr-2 text-yellow-500" />
              Travel Tips & Suggestions
            </h4>
            <ul className="space-y-2">
              {itinerary.actionable_suggestions.map((tip, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                    <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
