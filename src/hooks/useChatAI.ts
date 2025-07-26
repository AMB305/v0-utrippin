// src/hooks/useChatAI.ts

import { useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatContext, ChatContextType } from '@/contexts/chat-context';

export const useChatAI = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatAI must be used within a ChatProvider');
  }

  const { messages, addMessage, updateMessage, clearMessages } = context;
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    const messageId = Date.now().toString();

    addMessage({
      id: messageId,
      question: message,
      loading: true,
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { message },
      });

      if (error) throw new Error(`AI Edge Function Error: ${error.message}`);
      
      updateMessage(messageId, {
        response: data.response,
        detailedItinerary: data.detailedItinerary,
        isDetailedItinerary: data.isDetailedItinerary,
        showMap: data.showMap,
        mapLocation: data.mapLocation,
        quickReplies: data.quickReplies,
        callsToAction: data.callsToAction,
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      updateMessage(messageId, {
        response: "I'm having trouble connecting right now. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    clearMessages();
  };

  return {
    messages,
    loading,
    sendMessage,
    resetSession,
  };
};
