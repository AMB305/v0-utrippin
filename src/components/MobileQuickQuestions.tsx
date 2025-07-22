import React, { useState, useEffect } from 'react';
import { Calendar, Compass, MapPin, Zap } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MobileQuickQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

interface QuestionSet {
  planner: string;
  compass: string;
  insider: string;
  ultimate: string;
}

const quickQuestionsTemplate = [
  {
    id: 1,
    title: "Planner",
    questionKey: "planner" as keyof QuestionSet,
    icon: Calendar,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: false
  },
  {
    id: 2,
    title: "Compass", 
    questionKey: "compass" as keyof QuestionSet,
    icon: Compass,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: false
  },
  {
    id: 3,
    title: "Insider",
    questionKey: "insider" as keyof QuestionSet,
    icon: MapPin,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: true
  },
  {
    id: 4,
    title: "Ultimate",
    questionKey: "ultimate" as keyof QuestionSet,
    icon: Zap,
    color: "bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800",
    isLocationBased: false
  }
];

export const MobileQuickQuestions: React.FC<MobileQuickQuestionsProps> = ({ onQuestionSelect }) => {
  const { getCurrentLocation, isLoading, error } = useLocation();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionSet | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fetch location-specific questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // First try to get user's location
        try {
          const locationData = await getCurrentLocation();
          let locationString = '';
          
          if (locationData.locationName) {
            locationString = locationData.locationName;
          }
          
          const { data, error } = await supabase.functions.invoke('get-suggested-questions', {
            body: { location: locationString }
          });
          
          if (error) throw error;
          
          setQuestions(data);
        } catch (locationError) {
          // If location fails, fetch default questions
          const { data, error } = await supabase.functions.invoke('get-suggested-questions');
          
          if (error) throw error;
          
          setQuestions(data);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        // Fallback to hardcoded default questions
        setQuestions({
          planner: "Plan a weekend getaway for me.",
          compass: "What are some good destinations for solo travelers?",
          insider: "What's a hidden gem I can explore near me right now?",
          ultimate: "Show me how to travel the world on a budget."
        });
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionClick = async (item: typeof quickQuestionsTemplate[0]) => {
    if (!questions) return;
    
    const questionText = questions[item.questionKey];
    
    if (!item.isLocationBased) {
      onQuestionSelect(questionText);
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
      let enhancedQuestion = questionText;
      if (locationData.locationName) {
        enhancedQuestion = `${questionText} For context, my current location is ${locationData.locationName}.`;
      } else {
        enhancedQuestion = `${questionText} For context, my current coordinates are ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}.`;
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

  if (loadingQuestions) {
    return (
      <div className="w-full px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {quickQuestionsTemplate.map((item) => (
            <div
              key={item.id}
              className={`${item.color} border-2 rounded-xl p-4 text-left shadow-lg backdrop-blur-sm animate-pulse`}
            >
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-600 rounded" />
                  <div className="h-4 w-16 bg-gray-600 rounded" />
                </div>
                <div className="h-8 w-full bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-2 gap-4">
        {quickQuestionsTemplate.map((item) => {
          const IconComponent = item.icon;
          const isLocationLoading = item.isLocationBased && isLoading;
          const questionText = questions ? questions[item.questionKey] : '';
          
          return (
            <button
              key={item.id}
              onClick={() => handleQuestionClick(item)}
              disabled={isLocationLoading || !questions}
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
                  {isLocationLoading ? "Finding gems near you..." : questionText}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};