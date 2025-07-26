// src/components/ItineraryCard.tsx

import React from 'react';
import { DetailedItinerary } from '@/lib/schemas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Check, DollarSign, Gem, ShieldCheck } from 'lucide-react';

const ItineraryOption = ({ option }) => (
  <Card className="bg-white text-gray-900 border-none shadow-none">
    <CardHeader className="p-0">
      <CardTitle className="text-xl font-bold text-gray-800">{option.estimated_cost}</CardTitle>
      <CardDescription className="text-gray-600 pt-1">{option.summary}</CardDescription>
    </CardHeader>
    <CardContent className="p-0 mt-4">
      {option.days.map((day, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">{day.day}: {day.title}</h4>
          <ul className="list-none space-y-1">
            {day.activities.map((activity, actIndex) => (
              <li key={actIndex} className="flex items-start text-gray-600 text-sm">
                <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </CardContent>
  </Card>
);

export const ItineraryCard: React.FC<{ itinerary: DetailedItinerary }> = ({ itinerary }) => {
  if (!itinerary || !itinerary.options || itinerary.options.length !== 3) {
    return <div className="text-red-500 p-4 bg-red-100 rounded-lg">Error: Invalid itinerary data received from the AI.</div>;
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 w-full max-w-3xl mx-auto shadow-lg">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <MapPin size={16} />
          <span className="font-medium">{itinerary.destination}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{itinerary.overview_summary}</h2>
      </div>
      
      <Tabs defaultValue={itinerary.options[1].title} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-200 p-1 h-auto">
          <TabsTrigger value={itinerary.options[0].title} className="flex-col h-auto py-2">
            <DollarSign className="w-5 h-5 mb-1" /> <span className="text-xs sm:text-sm">{itinerary.options[0].title}</span>
          </TabsTrigger>
          <TabsTrigger value={itinerary.options[1].title} className="flex-col h-auto py-2">
            <ShieldCheck className="w-5 h-5 mb-1" /> <span className="text-xs sm:text-sm">{itinerary.options[1].title}</span>
          </TabsTrigger>
          <TabsTrigger value={itinerary.options[2].title} className="flex-col h-auto py-2">
            <Gem className="w-5 h-5 mb-1" /> <span className="text-xs sm:text-sm">{itinerary.options[2].title}</span>
          </TabsTrigger>
        </TabsList>
        
        {itinerary.options.map(option => (
          <TabsContent key={option.title} value={option.title} className="mt-4 p-4 bg-white rounded-lg">
            <ItineraryOption option={option} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};