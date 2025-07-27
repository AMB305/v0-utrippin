import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AnimatedKeila } from '@/components/AnimatedKeila';

interface KeilaChatBotProps {
  onChatStart?: () => void;
}

export const KeilaChatBot: React.FC<KeilaChatBotProps> = ({ onChatStart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChatClick = () => {
    if (onChatStart) {
      onChatStart();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Chat Bubble */}
      {isExpanded && (
        <div className="mb-4 bg-mobile-card-bg border border-mobile-border-color rounded-xl p-3 shadow-lg max-w-64 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
                <img 
                  src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                  alt="Keila" 
                  className="w-full h-full" 
                />
              </div>
              <span className="text-mobile-text-primary font-medium text-sm">Keila</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-mobile-text-secondary hover:text-mobile-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-mobile-text-primary text-sm">
            Hi! TripGenie is here. Chat with me now!
          </p>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={handleChatClick}
        className="w-14 h-14 bg-travel-blue hover:bg-travel-blue-dark rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 group"
      >
        {/* GENIE Text in Circle */}
        <div className="text-white font-bold text-xs leading-none text-center">
          GENIE
        </div>
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-travel-blue animate-ping opacity-25" />
        
        {/* Chat Icon Overlay (visible on hover) */}
        <div className="absolute inset-0 rounded-full bg-travel-blue-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </button>
    </div>
  );
};