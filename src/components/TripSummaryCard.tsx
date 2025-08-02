import React from 'react';
import { Plane, Hotel, MapPin, Star, Clock } from 'lucide-react';

interface TripSummaryCardProps {
  type: 'hotel' | 'flight' | 'activity';
  title: string;
  description: string;
  price?: string;
  rating?: number;
  duration?: string;
  imageUrl?: string;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  type,
  title,
  description,
  price,
  rating,
  duration,
  imageUrl
}) => {
  const getIcon = () => {
    switch (type) {
      case 'hotel':
        return <Hotel className="h-5 w-5 text-blue-400" />;
      case 'flight':
        return <Plane className="h-5 w-5 text-blue-400" />;
      case 'activity':
        return <MapPin className="h-5 w-5 text-blue-400" />;
      default:
        return <MapPin className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-semibold text-sm">{title}</h4>
            {price && (
              <span className="text-blue-400 font-bold text-sm">{price}</span>
            )}
          </div>
          
          <p className="text-slate-300 text-xs mb-3 leading-relaxed">{description}</p>
          
          <div className="flex items-center gap-4 text-xs">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-slate-300">{rating}</span>
              </div>
            )}
            
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-slate-300">{duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex gap-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-xl transition-colors font-medium">
          View Details
        </button>
        <button className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-xs rounded-xl transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};
