import React, { useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DestinationRatingProps {
  destinationName: string;
  showAverage?: boolean;
}

export const DestinationRating = ({ destinationName, showAverage = true }: DestinationRatingProps) => {
  const [userRating, setUserRating] = useState(() => {
    const ratings = JSON.parse(localStorage.getItem('destinationRatings') || '{}');
    return ratings[destinationName] || 0;
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const getAverageRating = () => {
    // Simulate average ratings - in a real app, this would come from a database
    const avgRatings: { [key: string]: number } = {
      "Paris, France": 4.7,
      "Tokyo, Japan": 4.8,
      "New York City, USA": 4.5,
      "Bali, Indonesia": 4.6,
      "Santorini, Greece": 4.9,
      "Dubai, UAE": 4.4,
      "Rome, Italy": 4.6,
      "Bangkok, Thailand": 4.3,
    };
    return avgRatings[destinationName] || (4.0 + Math.random() * 1);
  };

  const handleRatingClick = (rating: number) => {
    const ratings = JSON.parse(localStorage.getItem('destinationRatings') || '{}');
    ratings[destinationName] = rating;
    localStorage.setItem('destinationRatings', JSON.stringify(ratings));
    setUserRating(rating);
    
    toast({
      title: "Rating saved",
      description: `You rated ${destinationName} ${rating} star${rating !== 1 ? 's' : ''}!`,
    });
  };

  const averageRating = getAverageRating();

  return (
    <div className="space-y-2">
      {showAverage && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= averageRating ? 'text-yellow-400 fill-current' : 'text-slate-400'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-300">
            {averageRating.toFixed(1)} ({Math.floor(Math.random() * 2000 + 500)} reviews)
          </span>
        </div>
      )}
      
      <div className="space-y-1">
        <p className="text-xs text-slate-400">Rate this destination:</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleRatingClick(star)}
              className="transition-colors duration-200"
            >
              <Star
                className={`w-4 h-4 ${
                  star <= (hoveredRating || userRating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-slate-500 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
          {userRating > 0 && (
            <span className="text-xs text-slate-400 ml-2">
              Your rating: {userRating}/5
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
