import React, { useState } from 'react';
import { AnimatedKeila } from './AnimatedKeila';
import { KeilaChatModal } from './chat/KeilaChatModal';
import { useChatAI } from '@/hooks/useChatAI';

interface GlobalKeilaBubbleProps {
  className?: string;
}

export const GlobalKeilaBubble: React.FC<GlobalKeilaBubbleProps> = ({ className = "" }) => {
  const [isKeilaChatOpen, setIsKeilaChatOpen] = useState(false);
  const { messages, sendMessage, loading, resetSession } = useChatAI();
  
  const hasStartedChat = messages.length > 0;

  return (
    <>
      {/* Keila Chat Bubble */}
      {!isKeilaChatOpen && (
        <div 
          className={`fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 flex items-center space-x-2 z-40 w-72 max-w-[calc(100vw-2rem)] cursor-pointer hover:shadow-xl transition-shadow ${className}`}
          onClick={() => setIsKeilaChatOpen(true)}
        >
          <div className="animate-bounce">
            <AnimatedKeila />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Keila</p>
            <div className="flex items-center">
              <p className="text-xs text-gray-600 mr-2 leading-tight">
                {hasStartedChat 
                  ? (messages[messages.length - 1]?.response || messages[messages.length - 1]?.question || "Ready to help!")
                  : "Hi there! How can I help you plan your next adventure?"
                }
              </p>
              {loading && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Keila Chat Modal */}
      {isKeilaChatOpen && (
        <KeilaChatModal 
          isOpen={isKeilaChatOpen}
          onClose={() => setIsKeilaChatOpen(false)} 
          messages={messages}
          sendMessage={(message) => sendMessage(message, false, true)} // Use Gemini
          isLoading={loading}
          resetSession={resetSession}
        />
      )}
    </>
  );
};
