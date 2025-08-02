// src/components/comprehensive-itinerary/ItineraryHeader.tsx

import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { ComprehensiveItinerary } from '@/lib/schemas';

interface ItineraryHeaderProps {
  itinerary: ComprehensiveItinerary;
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({ itinerary }) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      range: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      duration: `${duration} days`
    };
  };

  const dateInfo = formatDateRange(itinerary.startDate, itinerary.endDate);

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-foreground text-white rounded-2xl overflow-hidden mb-8">
      {/* Background Image Collage */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 opacity-20">
        {itinerary.imageCollageUrls.slice(0, 6).map((url, index) => (
          <div 
            key={index}
            className="bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 bg-black/40 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{itinerary.tripTitle}</h1>
          
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{itinerary.destinationCity}, {itinerary.destinationCountry}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{dateInfo.range}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{dateInfo.duration}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{itinerary.numberOfTravelers} traveler{itinerary.numberOfTravelers > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <p className="text-lg opacity-90 leading-relaxed max-w-3xl">
            {itinerary.introductoryMessage}
          </p>
          
          <div className="mt-4 inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
            {itinerary.travelStyle} Adventure
          </div>
        </div>
      </div>
    </div>
  );
};
