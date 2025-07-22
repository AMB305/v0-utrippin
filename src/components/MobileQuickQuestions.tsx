
import React from 'react';
import { Calendar, Compass, Users, DollarSign } from 'lucide-react';

interface MobileQuickQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

const quickQuestions = [
  {
    id: 1,
    title: "Planner",
    question: "Plan a 3-day itinerary for a first-timer in Miami.",
    icon: Calendar,
    color: "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
  },
  {
    id: 2,
    title: "Compass", 
    question: "Show me the best spots to experience Afro-Caribbean culture in Miami.",
    icon: Compass,
    color: "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
  },
  {
    id: 3,
    title: "Insider",
    question: "Where can I find the best nightlife beyond the big South Beach clubs?",
    icon: Users,
    color: "bg-white border-gray-200 hover:border-orange-300 hover:shadow-md"
  },
  {
    id: 4,
    title: "Ultimate",
    question: "What are the best free things to do in Miami Beach?",
    icon: DollarSign,
    color: "bg-white border-gray-200 hover:border-green-300 hover:shadow-md"
  }
];

export const MobileQuickQuestions: React.FC<MobileQuickQuestionsProps> = ({ onQuestionSelect }) => {
  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-2 gap-4">
        {quickQuestions.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onQuestionSelect(item.question)}
              className={`${item.color} border-2 rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
            >
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {item.question}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
