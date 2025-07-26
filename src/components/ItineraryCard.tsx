// FILE: src/components/ItineraryCard.tsx

import React from 'react';
import { DetailedItinerary } from '@/lib/schemas'; // Import the type from our new schema file
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface ItineraryCardProps {
  itinerary: DetailedItinerary;
}

const DayPlan = ({ day }) => (
  <div className="mb-4">
    <h4 className="font-bold text-lg text-blue-400">{day.day}: {day.title}</h4>
    <ul className="list-disc list-inside pl-4 text-gray-300">
      {day.activities.map((activity, index) => (
        <li key={index}>{activity}</li>
      ))}
    </ul>
  </div>
);

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  if (!itinerary) {
    return null; // Don't render if there's no data
  }

  return (
    <Card className="bg-gray-900 text-white border-gray-700 w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <MapPin size={18} />
          <span className="font-semibold">{itinerary.destination}</span>
        </div>
        <CardTitle className="text-2xl font-bold">{itinerary.overview.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-6">{itinerary.overview.summary}</p>
        
        <div className="day-plans">
          {itinerary.days.map((day, index) => (
            <DayPlan key={index} day={day} />
          ))}
        </div>

        {itinerary.actionable_suggestions && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="text-md font-semibold text-green-300 mb-2">💡 Suggestions</h4>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {itinerary.actionable_suggestions.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};