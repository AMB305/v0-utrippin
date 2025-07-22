
import React from 'react';
import { Calendar, Compass, Users, DollarSign, MapPin } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';

interface MobileQuickQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

const quickQuestions = [
  {
    id: 1,
    title: "Planner",
    question: "Plan a 3-day itinerary for a first-timer in Miami.",
    icon: Calendar,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: false
  },
  {
    id: 2,
    title: "Compass", 
    question: "Show me the best spots to experience Afro-Caribbean culture in Miami.",
    icon: Compass,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: false
  },
  {
    id: 3,
    title: "Insider",
    question: "What's a hidden gem I can explore near me right now?",
    icon: MapPin,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: true
  },
  {
    id: 4,
    title: "Ultimate",
    question: "What are the best free things to do in Miami Beach?",
    icon: DollarSign,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: false
  }
];

export const MobileQuickQuestions: React.FC<MobileQuickQuestionsProps> = ({ onQuestionSelect }) => {
  const { getCurrentLocation, isLoading, error } = useLocation();
  const { toast } = useToast();

  const handleQuestionClick = async (item: typeof quickQuestions[0]) => {
    if (!item.isLocationBased) {
      onQuestionSelect(item.question);
      return;
    }

    try {
      // Show loading state
      toast({
        title: "Finding gems near you...",
        description: "Getting your location to provide personalized suggestions.",
      });

      const locationData = await getCurrentLocation();
      
      // Create location-enhanced prompt
      let enhancedQuestion = item.question;
      if (locationData.locationName) {
        enhancedQuestion = `${item.question} For context, my current location is ${locationData.locationName}.`;
      } else {
        enhancedQuestion = `${item.question} For context, my current coordinates are ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}.`;
      }

      onQuestionSelect(enhancedQuestion);
    } catch (locationError) {
      console.error('Location error:', locationError);
      toast({
        title: "Location access needed",
        description: error?.message || "Please enable location services in your settings to get suggestions near you.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-2 gap-4">
        {quickQuestions.map((item) => {
          const IconComponent = item.icon;
          const isLocationLoading = item.isLocationBased && isLoading;
          
          return (
            <button
              key={item.id}
              onClick={() => handleQuestionClick(item)}
              disabled={isLocationLoading}
              className={`${item.color} border-2 rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2">
                  {isLocationLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  ) : (
                    <IconComponent className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-semibold text-gray-300">{item.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {isLocationLoading ? "Finding gems near you..." : item.question}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
