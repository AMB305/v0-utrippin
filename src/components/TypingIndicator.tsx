import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-white/60 text-sm">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-ai-travel-button rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-ai-travel-button rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-ai-travel-button rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span>AI is thinking...</span>
    </div>
  );
};