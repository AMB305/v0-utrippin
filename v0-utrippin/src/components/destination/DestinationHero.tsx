import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Cloud } from 'lucide-react';

interface DestinationHeroProps {
  destination: string;
  country: string;
  description: string;
  temperature: string;
  aqi: string;
  imageUrl: string;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

export const DestinationHero: React.FC<DestinationHeroProps> = ({
  destination,
  country,
  description,
  temperature,
  aqi,
  imageUrl,
  onPrevious,
  onNext,
  className = ""
}) => {
  return (
    <div className={`relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-6 md:mb-10 shadow-lg ${className}`}>
      <img
        src={imageUrl}
        alt={`${destination}, ${country}`}
        className="w-full h-full object-cover"
      />
      
      {/* Hero Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
        <div className="absolute bottom-6 left-6 p-6 md:p-8 bg-black bg-opacity-60 text-white rounded-3xl backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold">{destination}, {country}</h1>
          <div className="h-0.5 w-16 bg-white my-2"></div>
          <p className="text-lg font-light mt-2">{country}</p>
          <p className="text-sm mt-2 max-w-sm">{description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium">
            <span className="flex items-center gap-1">
              <Cloud size={16} />
              {temperature}
            </span>
            <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
              AQI {aqi}
            </span>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {onNext && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-50 text-gray-800 backdrop-blur-sm shadow-md"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
        {onPrevious && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onPrevious}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-50 text-gray-800 backdrop-blur-sm shadow-md"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </div>
    </div>
  );
};
