import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 16, 
  showValue = true, 
  className = "" 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star 
        key={`full-${i}`} 
        size={size} 
        fill="currentColor" 
        className="text-yellow-400" 
      />
    );
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <StarHalf 
        key="half" 
        size={size} 
        fill="currentColor" 
        className="text-yellow-400" 
      />
    );
  }

  // Empty stars
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star 
        key={`empty-${i}`} 
        size={size} 
        className="text-gray-300" 
      />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars}
      {showValue && (
        <span className="text-sm font-semibold ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};