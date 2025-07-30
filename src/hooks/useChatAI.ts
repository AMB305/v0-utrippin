// src/hooks/useChatAI.ts

import { useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatContext } from '@/contexts/chat-context';
import { useAuth } from '@/hooks/useAuth';

export const useChatAI = () => {
  const context = useContext(ChatContext);
  const { user } = useAuth();
  
  if (!context) {
    throw new Error('useChatAI must be used within a ChatProvider');
  }

  // State and methods from your ChatContext
  const { messages, addMessage, updateMessage, clearMessages } = context;
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, comprehensive = false) => {
    console.log(`[useChatAI] sendMessage called with message: "${message}"`);
    setLoading(true);
    const messageId = Date.now().toString(); // Use a unique ID for the Q&A pair

    // Add the user's question to the UI immediately
    const userQuestionPayload = {
      id: messageId,
      question: message,
      loading: true, // Set loading to true for this specific message
    };
    addMessage(userQuestionPayload);
    console.log('[useChatAI] Dispatched addMessage with payload:', userQuestionPayload);

    try {
      console.log('[useChatAI] Invoking Supabase function "ai-travel-chat" with userId:', user?.id);
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { 
          message, 
          comprehensive, 
          userId: user?.id
        },
      });

      if (error) {
        console.error('[useChatAI] Supabase function returned an error:', error);
        throw new Error(`AI Edge Function Error: ${error.message}`);
      }
      
      console.log('[useChatAI] Supabase function returned data:', data);

      // Prepare the update payload with the AI's response
      const aiResponsePayload = {
        response: data.response,
        detailedItinerary: data.detailedItinerary,
        isDetailedItinerary: data.isDetailedItinerary,
        comprehensiveItinerary: data.comprehensiveItinerary,
        isComprehensiveItinerary: data.isComprehensiveItinerary,
        showMap: data.showMap,
        mapLocation: data.mapLocation,
        quickReplies: data.quickReplies,
        callsToAction: data.callsToAction,
        loading: false, // Set loading to false as we have the response
      };
      updateMessage(messageId, aiResponsePayload);
      console.log(`[useChatAI] Dispatched updateMessage for id "${messageId}" with payload:`, aiResponsePayload);

    } catch (err) {
      console.error('[useChatAI] CATCH BLOCK: Failed to send message:', err);
      const errorPayload = {
        response: "I'm having trouble connecting right now. Please try again in a moment.",
        loading: false,
      };
      updateMessage(messageId, errorPayload);
      console.log(`[useChatAI] Dispatched updateMessage for id "${messageId}" with ERROR payload:`, errorPayload);
    } finally {
      console.log('[useChatAI] Setting global loading state to false.');
      setLoading(false);
    }
  };

  const sendComprehensiveMessage = async (message: string) => {
    return sendMessage(message, true);
  };

  const resetSession = async () => {
    console.log('[useChatAI] resetSession called.');
    clearMessages();
    
    if (user?.id) {
      console.log('[useChatAI] Clearing conversation memory from Supabase for user:', user.id);
      try {
        const { error } = await supabase
          .from('user_conversations')
          .delete()
          .eq('user_id', user.id);
        
        if (error) {
           console.error('Error clearing Supabase conversation memory:', error);
        } else {
           console.log('[useChatAI] Supabase conversation memory cleared successfully.');
        }
      } catch (error) {
        console.error('Exception while clearing conversation memory:', error);
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