// src/components/ItineraryCard.tsx

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Check, DollarSign, Gem, ShieldCheck } from 'lucide-react';

const ItineraryOption = ({ option }) => (
  <Card className="!bg-white !text-black border-none shadow-none" style={{ backgroundColor: 'white', color: 'black' }}>
    <CardHeader className="p-0">
      <CardDescription className="!text-gray-600" style={{ color: '#6b7280' }}>{option.summary}</CardDescription>
    </CardHeader>
    <CardContent className="p-0 mt-4">
      {option.days.map((day, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-semibold !text-black mb-2" style={{ color: 'black' }}>{day.day}: {day.title}</h4>
          <ul className="list-none space-y-1">
            {day.activities.map((activity, actIndex) => (
              <li key={actIndex} className="flex items-start !text-gray-600 text-sm" style={{ color: '#6b7280' }}>
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

export const ItineraryCard = ({ itinerary }) => {
  if (!itinerary || !itinerary.options || itinerary.options.length !== 3) {
    return <div className="text-red-500">Error: Invalid itinerary data provided.</div>;
  }

  return (
    <div className="bg-white text-black rounded-2xl p-6 w-full max-w-3xl mx-auto border border-gray-200 shadow-none" style={{ backgroundColor: '#ffffff !important', color: '#000000 !important', boxShadow: 'none !important' }}>
      <div className="mb-4">
        <div className="flex items-center gap-2 !text-gray-600 mb-2" style={{ color: '#6b7280' }}>
          <MapPin size={16} />
          <span className="font-medium">{itinerary.destination}</span>
        </div>
        <h2 className="text-3xl font-bold !text-black" style={{ color: 'black' }}>{itinerary.overview_summary}</h2>
      </div>
      
      <Tabs defaultValue={itinerary.options[1].title} className="w-full">
        <TabsList className="grid w-full grid-cols-3 !bg-gray-100" style={{ backgroundColor: '#f3f4f6' }}>
          <TabsTrigger value={itinerary.options[0].title}>
            <DollarSign className="w-4 h-4 mr-2" /> {itinerary.options[0].title}
          </TabsTrigger>
          <TabsTrigger value={itinerary.options[1].title}>
            <ShieldCheck className="w-4 h-4 mr-2" /> {itinerary.options[1].title}
          </TabsTrigger>
          <TabsTrigger value={itinerary.options[2].title}>
            <Gem className="w-4 h-4 mr-2" /> {itinerary.options[2].title}
          </TabsTrigger>
        </TabsList>
        
        {itinerary.options.map(option => (
          <TabsContent key={option.title} value={option.title} className="mt-4">
            <ItineraryOption option={option} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};