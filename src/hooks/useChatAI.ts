// src/hooks/useChatAI.ts

import { useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatContext, ChatContextType } from '@/contexts/chat-context';
import { useAuth } from '@/hooks/useAuth';

export const useChatAI = () => {
  const context = useContext(ChatContext);
  const { user } = useAuth();
  
  if (!context) {
    throw new Error('useChatAI must be used within a ChatProvider');
  }

  const { messages, addMessage, updateMessage, clearMessages } = context;
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, comprehensive = false) => {
    setLoading(true);
    const messageId = Date.now().toString();

    addMessage({
      id: messageId,
      question: message,
      loading: true,
    });

    try {
      const functionName = comprehensive ? 'ai-comprehensive-itinerary' : 'ai-travel-chat';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { message, comprehensive, userId: user?.id },
      });

      if (error) throw new Error(`AI Edge Function Error: ${error.message}`);
      
      updateMessage(messageId, {
        response: data.response,
        detailedItinerary: data.detailedItinerary,
        isDetailedItinerary: data.isDetailedItinerary,
        comprehensiveItinerary: data.comprehensiveItinerary,
        isComprehensiveItinerary: data.isComprehensiveItinerary,
        showMap: data.showMap,
        mapLocation: data.mapLocation,
        quickReplies: data.quickReplies,
        callsToAction: data.callsToAction,
        loading: false,
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      updateMessage(messageId, {
        response: "I'm having trouble connecting right now. Please try again in a moment.",
        loading: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendComprehensiveMessage = async (message: string) => {
    return sendMessage(message, true);
  };

  const resetSession = () => {
    clearMessages();
  };

  return {
    messages,
    loading,
    sendMessage,
    sendComprehensiveMessage,
    resetSession,
  };
};
