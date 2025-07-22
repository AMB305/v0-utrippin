
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
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    id: 2,
    title: "Compass", 
    question: "Show me the best spots to experience Afro-Caribbean culture in Miami.",
    icon: Compass,
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    id: 3,
    title: "Insider",
    question: "Where can I find the best nightlife beyond the big South Beach clubs?",
    icon: Users,
    color: "bg-orange-500/10 border-orange-500/20"
  },
  {
    id: 4,
    title: "Ultimate",
    question: "What are the best free things to do in Miami Beach?",
    icon: DollarSign,
    color: "bg-green-500/10 border-green-500/20"
  }
];

export const MobileQuickQuestions: React.FC<MobileQuickQuestionsProps> = ({ onQuestionSelect }) => {
  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-2 gap-3">
        {quickQuestions.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onQuestionSelect(item.question)}
              className={`${item.color} border rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg`}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
