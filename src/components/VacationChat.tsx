import React, { useState, useEffect } from 'react';
import { useChatAI } from '@/hooks/useChatAI';
import { ChatInterface } from '@/components/ChatInterface';
import { SimpleChatInput } from '@/components/SimpleChatInput';

export default function VacationChat() {
  const { messages, loading, sendMessage } = useChatAI();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize with Keila's greeting message
  useEffect(() => {
    if (!hasInitialized && messages.length === 0) {
      // Send initial greeting from Keila
      const initialMessage = "Planning a vacation? I'd love to help! Tell me a bit about your dream trip. For example, where do you want to go and for how long?";
      
      // We'll simulate this as a bot response by adding it directly to display
      setHasInitialized(true);
    }
  }, [hasInitialized, messages.length]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Create initial messages array with Keila's greeting if no messages exist
  const displayMessages = messages.length === 0 && hasInitialized
    ? [{
        id: 'initial',
        question: '',
        response: "Planning a vacation? I'd love to help! Tell me a bit about your dream trip. For example, where do you want to go and for how long?",
        loading: false
      }]
    : messages;

  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] bg-white shadow-xl rounded-lg flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <h2 className="text-xl font-bold text-gray-800">Chat with Keila - Vacation Planning</h2>
        <p className="text-sm text-gray-600">Let's plan your perfect vacation together!</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={displayMessages}
          loading={loading}
          onSendMessage={handleSendMessage}
        />
      </div>
      
      <div className="p-4 border-t">
        <SimpleChatInput
          onSendMessage={handleSendMessage}
          placeholder="Tell me about your dream vacation..."
        />
      </div>
    </div>
  );
}