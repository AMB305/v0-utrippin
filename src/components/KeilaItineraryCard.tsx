// KeilaItineraryCard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Star, MapPin, Loader2 } from 'lucide-react';

interface ItineraryCardProps {
  isLoading: boolean;
  error?: string;
  destination: string;
  dates: string;
  summary: string;
  days: {
    day: string;
    activities: string[];
  }[];
  suggestions: string[];
  rating?: number;
}

const KeilaItineraryCard: React.FC<ItineraryCardProps> = ({
  isLoading,
  error,
  destination,
  dates,
  summary,
  days,
  suggestions,
  rating = 4.9,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60 text-white animate-fade-in">
        <Loader2 className="animate-spin mr-2" /> Keila is thinking...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-md max-w-xl mx-auto mt-10 animate-fade-in">
        <strong>Error:</strong> {error || 'Something went wrong fetching your itinerary.'}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto mt-10 animate-fade-in">
      <div className="flex items-center text-purple-400 gap-2 mb-1">
        <MapPin size={16} /> {destination}
      </div>
      <h2 className="text-2xl font-bold mb-2">🧭 Your Personalized Trip</h2>
      <div className="flex items-center text-sm text-gray-400 mb-4">
        <Calendar size={16} className="mr-1" /> {dates}
      </div>

      <p className="text-gray-300 mb-6">{summary}</p>

      <div className="space-y-4">
        {days.map((day, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-semibold text-blue-400 mb-1">{day.day}</h3>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {day.activities.map((activity, i) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <h4 className="text-md font-semibold text-green-300 mb-2">💡 Suggestions</h4>
        <ul className="list-disc list-inside text-sm text-gray-300">
          {suggestions.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="text-yellow-400 text-sm flex items-center gap-1">
          <Star size={14} /> {rating.toFixed(1)}
        </span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md font-medium">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default KeilaItineraryCard;