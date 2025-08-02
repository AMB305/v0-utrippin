// src/components/ItineraryCard.tsx

import React from 'react';
import { DetailedItinerary, ComprehensiveItinerary } from '@/lib/schemas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Check, DollarSign, Gem, ShieldCheck } from 'lucide-react';
import { ComprehensiveItineraryDisplay } from './comprehensive-itinerary/ComprehensiveItineraryDisplay';

const ItineraryOption = ({ option }) => (
  <Card className="bg-transparent border-none shadow-none">
    <CardHeader className="p-0">
      <CardTitle className="text-xl font-bold text-gray-800">{option.estimated_cost}</CardTitle>
      <CardDescription className="text-gray-600 pt-1">{option.summary}</CardDescription>
    </CardHeader>
    <CardContent className="p-0 mt-6">
      {option.days.map((day, index) => (
        <div key={index} className="mb-4 relative pl-8">
          <div className="absolute left-0 top-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
            {day.day.replace('Day ', '')}
          </div>
          <h4 className="font-semibold text-gray-800">{day.title}</h4>
          <ul className="mt-1 list-none space-y-1">
            {day.activities.map((activity, actIndex) => (
              <li key={actIndex} className="flex items-start text-gray-600 text-sm">
                <Check size={16} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </CardContent>
  </Card>
);

interface ItineraryCardProps {
  itinerary?: DetailedItinerary;
  comprehensiveItinerary?: ComprehensiveItinerary;
  onBack?: () => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ 
  itinerary, 
  comprehensiveItinerary,
  onBack 
}) => {
  // If we have a comprehensive itinerary, show it
  if (comprehensiveItinerary) {
    return (
      <ComprehensiveItineraryDisplay 
        itinerary={comprehensiveItinerary} 
        onBack={onBack}
      />
    );
  }

  // Legacy simple itinerary display
  if (!itinerary || !itinerary.options || itinerary.options.length !== 3) {
    return <div className="text-red-500 p-4 bg-red-100 rounded-lg">Error: Invalid itinerary data received.</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-3xl mx-auto shadow-lg border border-gray-200">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <MapPin size={16} />
          <span className="font-medium">{itinerary.destination}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{itinerary.overview_summary}</h2>
      </div>
      
      <Tabs defaultValue={itinerary.options[1].title} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 h-auto rounded-lg">
          <TabsTrigger value={itinerary.options[0].title} className="flex-col h-auto py-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600">
            <DollarSign className="w-5 h-5 mb-1" /> <span className="text-xs sm:text-sm font-semibold">{itinerary.options[0].title}</span>
          </TabsTrigger>
          <TabsTrigger value={itinerary.options[1].title} className="flex-col h-auto py-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600">
            <ShieldCheck className="w-5 h-5 mb-1" /> <span className="text-xs sm:text-sm font-semibold">{itinerary.options[1].title}</span>
          </TabsTrigger>
          <TabsTrigger value={itinerary.options[2].title} className="flex-col h-auto py-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600">
            <Gem className="w-5 h-5 mb-1" /> <span className="text-xs sm:text-sm font-semibold">{itinerary.options[2].title}</span>
          </TabsTrigger>
        </TabsList>
        
        {itinerary.options.map(option => (
          <TabsContent key={option.title} value={option.title} className="mt-4 p-4">
            <ItineraryOption option={option} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
