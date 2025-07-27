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
      // Use only ai-travel-chat with the new memory system
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { 
          message, 
          comprehensive, 
          userId: user?.id
          // No longer sending conversationHistory - using persistent memory instead
        },
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

  const resetSession = async () => {
    clearMessages();
    
    // Clear conversation memory from database
    if (user?.id) {
      try {
        await supabase
          .from('user_conversations')
          .delete()
          .eq('user_id', user.id);
        console.log('Conversation memory cleared');
      } catch (error) {
        console.error('Error clearing conversation memory:', error);
      }
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    sendComprehensiveMessage,
    resetSession,
  };
};
