import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AnimatedKeila } from '@/components/AnimatedKeila';

interface KeilaChatBotProps {
  onChatStart?: () => void;
}

export const KeilaChatBot: React.FC<KeilaChatBotProps> = ({ onChatStart }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPeriodicPopup, setShowPeriodicPopup] = useState(false);

  // Periodic popup every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isExpanded) {
        setShowPeriodicPopup(true);
        // Auto-hide after 3 seconds
        setTimeout(() => setShowPeriodicPopup(false), 3000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isExpanded]);

  const handleChatClick = () => {
    setShowPeriodicPopup(false); // Hide popup when clicked
    if (onChatStart) {
      onChatStart();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Periodic Popup Bubble */}
      {showPeriodicPopup && (
        <div className="mb-4 bg-travel-blue rounded-xl p-3 shadow-lg max-w-64 animate-fade-in-up relative">
          <p className="text-white text-sm font-medium">
            Hi! TripGenie is here. Chat with me now!
          </p>
          {/* Speech bubble tail */}
          <div className="absolute bottom-[-8px] right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-travel-blue"></div>
        </div>
      )}

      {/* Chat Bubble */}
      {isExpanded && (
        <div className="mb-4 bg-mobile-card-bg border border-mobile-border-color rounded-xl p-3 shadow-lg max-w-64 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
                <img 
                  src="/lovable-uploads/0c600adc-df9a-43e1-b83e-e90ae7766dfd.png" 
                  alt="Keila" 
                  className="w-full h-full rounded-full" 
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

      {/* Chat Button with Keila Face */}
      <button
        onClick={handleChatClick}
        className="w-16 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
      >
        {/* Keila Face */}
        <div className="w-16 h-16 relative z-10">
          <img 
            src="/lovable-uploads/0c600adc-df9a-43e1-b83e-e90ae7766dfd.png" 
            alt="Keila" 
            className="w-full h-full animate-bounce drop-shadow-lg" 
          />
        </div>
        
        {/* Chat Icon Overlay (visible on hover) */}
        <div className="absolute inset-0 rounded-full bg-travel-blue/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </button>
    </div>
  );
};