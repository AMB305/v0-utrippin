import React from 'react';

interface QuickReplyButtonsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({
  suggestions,
  onSelect
}) => {
  return (
    <div className="space-y-4 mt-6">
      <h4 className="text-blue-400 text-sm font-medium">You might ask...</h4>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left bg-slate-800/40 hover:bg-slate-700/60 border border-slate-600/30 hover:border-blue-400/50 text-slate-300 hover:text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
