import React from "react";
import { X } from "lucide-react";
import { affiliateConfig } from "@/config/affiliateConfig";
import { AITripPlannerIntegration } from "./AITripPlannerIntegration";
import { DestinationRating } from "./DestinationRating";
import { FavoriteButton } from "./FavoriteButton";
import { ShareButton } from "./ShareButton";
import { SmartImage } from "./SmartImage";

interface Destination {
  name: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  cuisine: string[];
  highlights: string[];
  tips: string[];
}

interface ItineraryModalProps {
  trip: Destination;
  onClose: () => void;
}

export const ItineraryModal = ({ trip, onClose }: ItineraryModalProps) => {
  const buildExpediaUrl = (type: 'flights' | 'hotels' | 'activities', destination: string) => {
    const baseUrls = {
      flights: 'https://www.expedia.com/Flights',
      hotels: 'https://www.expedia.com/Hotels', 
      activities: 'https://www.expedia.com/Activities'
    };
    
    return `${baseUrls[type]}?CAMREF=${affiliateConfig.expedia.camref}&destination=${encodeURIComponent(destination)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl p-8 max-w-4xl w-full shadow-xl overflow-y-auto max-h-[90vh] border border-blue-500/20">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white float-right mb-4 p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="clear-both">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">{trip.name}</h2>
            <div className="flex gap-2">
              <FavoriteButton destinationName={trip.name} />
              <ShareButton 
                destinationName={trip.name} 
                destinationSummary={trip.summary}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <DestinationRating destinationName={trip.name} showAverage={true} />
          </div>
          <SmartImage
            destination={trip.name}
            description={trip.description}
            tags={trip.tags}
            className="rounded-xl mb-6 h-60 w-full object-cover"
            alt={trip.name}
          />

          <p className="mb-6 text-slate-300 text-lg">{trip.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-blue-400 mr-2">✨</span>
                Must-See Highlights
              </h3>
              <ul className="space-y-2">
                {trip.highlights?.map((item, i) => (
                  <li key={i} className="text-slate-300 flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="text-orange-400 mr-2">🍽️</span>
                Local Cuisine
              </h3>
              <div className="flex flex-wrap gap-3">
                {trip.cuisine?.map((dish, i) => (
                  <span
                    key={i}
                    className="bg-slate-800 border border-orange-500/30 px-4 py-2 rounded-full text-slate-200 text-sm"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-white flex items-center">
              <span className="text-green-400 mr-2">💡</span>
              Travel Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {trip.tips?.map((tip, i) => (
                <div key={i} className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4">
                  <p className="text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <AITripPlannerIntegration destination={trip} />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={buildExpediaUrl('flights', trip.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-white font-semibold flex-1 min-w-[150px] text-center transition-colors"
            >
              Book Flights
            </a>
            <a
              href={buildExpediaUrl('hotels', trip.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-white font-semibold flex-1 min-w-[150px] text-center transition-colors"
            >
              Book Hotels
            </a>
            <a
              href={buildExpediaUrl('activities', trip.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-white font-semibold flex-1 min-w-[150px] text-center transition-colors"
            >
              Book Activities
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
