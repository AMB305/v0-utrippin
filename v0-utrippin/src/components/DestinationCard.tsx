import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { ShareButton } from "./ShareButton";
import { DestinationRating } from "./DestinationRating";
import { VecteezyImage } from "./VecteezyImage";
import { ImageModal } from "./ImageModal";

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

interface DestinationCardProps {
  destination: Destination;
  onClick: (destination: Destination) => void;
}

export const DestinationCard = ({ destination, onClick }: DestinationCardProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Track views for personalization
  useEffect(() => {
    const viewHistory = JSON.parse(localStorage.getItem('destinationViews') || '[]');
    if (!viewHistory.includes(destination.name)) {
      viewHistory.push(destination.name);
      localStorage.setItem('destinationViews', JSON.stringify(viewHistory.slice(-50))); // Keep last 50 views
    }
  }, [destination.name]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageModalOpen(true);
  };

  return (
    <div
      className="bg-slate-800/50 border border-blue-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
      onClick={() => onClick(destination)}
    >
      <div className="relative h-48 overflow-hidden">
        <VecteezyImage
          destination={destination.name}
          description={destination.summary}
          tags={destination.tags}
          fallbackImage={destination.image}
          className="w-full h-full group-hover:scale-110 transition-transform duration-300"
          alt={destination.name}
          onClick={handleImageClick}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <FavoriteButton destinationName={destination.name} />
          <ShareButton 
            destinationName={destination.name} 
            destinationSummary={destination.summary}
          />
        </div>
        <div className="absolute top-4 left-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-white">{destination.name}</h3>
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{destination.summary}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="bg-blue-700/40 border border-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {destination.tags?.length > 3 && (
            <span className="text-slate-400 text-xs px-2 py-1">
              +{destination.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="mb-4">
          <DestinationRating destinationName={destination.name} />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl font-medium transition-colors">
          Explore Details
        </button>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        destination={destination.name}
        description={destination.summary}
        tags={destination.tags}
      />
    </div>
  );
};
