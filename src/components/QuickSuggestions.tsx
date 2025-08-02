import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Compass } from "lucide-react";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  visible: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ 
  onSuggestionClick, 
  visible 
}) => {
  const suggestions = [
    { icon: MapPin, text: "Find trips to Europe", query: "I want to explore Europe this spring" },
    { icon: Calendar, text: "Weekend getaways", query: "Show me quick weekend trip options" },
    { icon: DollarSign, text: "Budget-friendly trips", query: "I'm looking for affordable travel deals" },
    { icon: Compass, text: "Adventure travel", query: "I want an exciting adventure trip" },
  ];

  if (!visible) return null;

  return (
    <div className="mb-4 animate-fade-in">
      <p className="text-white/60 text-sm mb-3 text-center">Try asking about:</p>
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-auto p-3 bg-ai-travel-card border-white/20 text-white hover:bg-white/10 hover:border-ai-travel-button/50 flex flex-col items-center gap-1 text-xs"
            onClick={() => onSuggestionClick(suggestion.query)}
          >
            <suggestion.icon className="h-4 w-4 text-ai-travel-button" />
            <span className="text-center leading-tight">{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
