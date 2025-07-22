import React from 'react';
import { Plane, Bed, MapPin, Calendar, Coffee, Camera, Compass, Car } from 'lucide-react';

interface SuggestionData {
  icon: React.ReactNode;
  category: string;
  question: string;
  bgColor: string;
}

interface TravelSuggestionsGridProps {
  onSuggestionClick: (question: string) => void;
}

const suggestionData: SuggestionData[] = [
  // First row
  {
    icon: <Bed className="w-4 h-4 text-white" />,
    category: "Stays",
    question: "Can you find a budget hotel close to the Eiffel Tower in Paris?",
    bgColor: "bg-blue-500"
  },
  {
    icon: <MapPin className="w-4 h-4 text-white" />,
    category: "Things to do",
    question: "Where are some family resorts for a weekend getaway in Hong Kong?",
    bgColor: "bg-teal-500"
  },
  {
    icon: <Plane className="w-4 h-4 text-white" />,
    category: "Flights",
    question: "Can you find early flight from Singapore to Bangkok next Tuesday?",
    bgColor: "bg-indigo-500"
  },
  {
    icon: <Coffee className="w-4 h-4 text-white" />,
    category: "Tips",
    question: "How can I avoid jet lag on long flights?",
    bgColor: "bg-orange-500"
  },
  
  // Second row
  {
    icon: <Plane className="w-4 h-4 text-white" />,
    category: "Flights",
    question: "Is there an evening flight from Dubai to London on Monday?",
    bgColor: "bg-indigo-500"
  },
  {
    icon: <Calendar className="w-4 h-4 text-white" />,
    category: "Itinerary plan",
    question: "What should I include in a 5-day itinerary for Paris?",
    bgColor: "bg-purple-500"
  },
  {
    icon: <Bed className="w-4 h-4 text-white" />,
    category: "Stays",
    question: "What are the best family-friendly hotels in downtown Bangkok?",
    bgColor: "bg-red-500"
  },
  {
    icon: <Calendar className="w-4 h-4 text-white" />,
    category: "Itinerary plan",
    question: "What is the best 7-day trip to Singapore?",
    bgColor: "bg-purple-500"
  },

  // Third row
  {
    icon: <Coffee className="w-4 h-4 text-white" />,
    category: "Tips",
    question: "What should I do if I lose my passport while traveling?",
    bgColor: "bg-orange-500"
  },
  {
    icon: <Bed className="w-4 h-4 text-white" />,
    category: "Stays",
    question: "Could you find a 5-star hotel near Tokyo city center?",
    bgColor: "bg-red-500"
  },
  {
    icon: <Plane className="w-4 h-4 text-white" />,
    category: "Flights",
    question: "Can you check for non-stop flights from Paris to Singapore next Wednesday morning?",
    bgColor: "bg-indigo-500"
  },
  {
    icon: <Camera className="w-4 h-4 text-white" />,
    category: "Activities",
    question: "What are the best photo spots in Santorini?",
    bgColor: "bg-green-500"
  }
];

export const TravelSuggestionsGrid: React.FC<TravelSuggestionsGridProps> = ({ onSuggestionClick }) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-gray-800 mb-4 px-4">Popular Travel Questions</h2>
      
      {/* Scrollable grid container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-col gap-3 px-4 pb-4" style={{ width: 'max-content' }}>
          
          {/* First row */}
          <div className="flex gap-3">
            {suggestionData.slice(0, 4).map((item, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95"
                style={{ width: '280px', minHeight: '80px' }}
                onClick={() => onSuggestionClick(item.question)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.category}</span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                  {item.question}
                </p>
              </div>
            ))}
          </div>

          {/* Second row */}
          <div className="flex gap-3">
            {suggestionData.slice(4, 8).map((item, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95"
                style={{ width: '280px', minHeight: '80px' }}
                onClick={() => onSuggestionClick(item.question)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.category}</span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                  {item.question}
                </p>
              </div>
            ))}
          </div>

          {/* Third row */}
          <div className="flex gap-3">
            {suggestionData.slice(8, 12).map((item, index) => (
              <div
                key={`row3-${index}`}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95"
                style={{ width: '280px', minHeight: '80px' }}
                onClick={() => onSuggestionClick(item.question)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.category}</span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                  {item.question}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};