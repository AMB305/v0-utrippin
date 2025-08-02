// src/components/custom/chat-container.tsx

import React from 'react';
import { ItineraryCard } from '@/components/ItineraryCard';
import { KeilaThinking } from '@/components/KeilaThinking';
import { SimpleChatInput } from '@/components/SimpleChatInput';

interface ChatMessage {
  id: string;
  question: string;
  response?: string;
  loading?: boolean;
  showMap?: boolean;
  mapLocation?: string;
  isDetailedItinerary?: boolean;
  detailedItinerary?: any;
  isComprehensiveItinerary?: boolean;
  comprehensiveItinerary?: any;
  quickReplies?: string[];
  callsToAction?: any[];
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

// This is now a "dumb" component. It only displays what it's told.
const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, onSendMessage }) => {
  return (
    <div className="flex flex-col h-full bg-transparent text-gray-900">
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <div className="flex justify-end">
              <div className="bg-blue-600 px-4 py-2 rounded-lg max-w-[80%]">
                <p className="text-sm text-white">{message.question}</p>
              </div>
            </div>

            {!message.loading && (message.response || message.detailedItinerary || message.comprehensiveItinerary) && (
              <div className="flex justify-start">
                {message.isComprehensiveItinerary && message.comprehensiveItinerary ? (
                  <ItineraryCard comprehensiveItinerary={message.comprehensiveItinerary} />
                ) : message.isDetailedItinerary && message.detailedItinerary ? (
                  <ItineraryCard itinerary={message.detailedItinerary} />
                ) : (
                  <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-[80%]">
                    <p className="text-sm text-gray-900">{message.response}</p>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <KeilaThinking />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <SimpleChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
