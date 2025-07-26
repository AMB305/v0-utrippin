// src/components/custom/chat-container.tsx

import React from 'react';
import { useChatAI } from '@/hooks/useChatAI';
import { ItineraryCard } from '@/components/ItineraryCard'; // The ONE, correct card
import { KeilaThinking } from '@/components/KeilaThinking';
import { SimpleChatInput } from '@/components/SimpleChatInput';

const ChatContainer = () => {
  const { messages, sendMessage, loading } = useChatAI();

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-600 px-4 py-2 rounded-lg max-w-[80%]">
                <p className="text-sm">{message.question}</p>
              </div>
            </div>

            {/* AI Response */}
            {!message.loading && (message.response || message.detailedItinerary) && (
              <div className="flex justify-start">
                {message.isDetailedItinerary && message.detailedItinerary ? (
                  // We are now using our new, reliable ItineraryCard
                  <ItineraryCard itinerary={message.detailedItinerary} />
                ) : (
                  // This handles the simple text responses
                  <div className="bg-gray-800 px-4 py-2 rounded-lg max-w-[80%]">
                    <p className="text-sm">{message.response}</p>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
        {/* Show a loading indicator when the AI is thinking */}
        {loading && (
          <div className="flex justify-start">
            <KeilaThinking />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        <SimpleChatInput onSendMessage={handleSendMessage} isLoading={loading} />
      </div>
    </div>
  );
};

export default ChatContainer;
