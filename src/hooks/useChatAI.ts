// src/hooks/useChatAI.ts

import { useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatContext } from '@/contexts/chat-context';

export const useChatAI = () => {
  // 1. Consume the GLOBAL state from the context. No more local useState for messages!
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatAI must be used within a ChatProvider');
  }
  const { messages, addMessage, updateMessage, clearMessages } = context;

  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    const messageId = Date.now().toString();

    // 2. Add the user's message to the GLOBAL state.
    addMessage({
      id: messageId,
      question: message,
      isDetailedItinerary: false, // Default value
      loading: true,
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { message },
      });

      if (error) throw new Error(error.message);

      // 3. Update the message in the GLOBAL state with the AI's response.
      updateMessage(messageId, {
        response: data.response,
        detailedItinerary: data.detailedItinerary,
        isDetailedItinerary: data.isDetailedItinerary,
        showMap: data.showMap,
        mapLocation: data.mapLocation,
        quickReplies: data.quickReplies,
        callsToAction: data.callsToAction,
      });

    } catch (error) {
      console.error('Error calling AI chat:', error);
      updateMessage(messageId, {
        response: "I'm having trouble processing your request right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 4. The clearChat function now correctly clears the GLOBAL state. No page reload needed.
  const resetSession = () => {
    console.log("SESSION RESET: Clearing global chat state and storage.");
    clearMessages(); 
  };

  return {
    messages,
    loading,
    sendMessage,
    resetSession, // This is the only function you need to call now.
  };
};