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

  const sendMessage = async (message: string, comprehensive = false, useGemini = false) => {
    setLoading(true);
    const messageId = Date.now().toString();

    addMessage({
      id: messageId,
      question: message,
      loading: true,
    });

    try {
      if (useGemini) {
        // Use Gemini via our new edge function
        const { data, error } = await supabase.functions.invoke('gemini-chat', {
          body: { 
            chatHistory: messages.map(msg => ({
              role: 'user',
              text: msg.question
            })).concat(messages.filter(msg => msg.response).map(msg => ({
              role: 'bot', 
              text: msg.response
            }))),
            currentPrompt: message
          },
        });

        if (error) throw new Error(`Gemini Edge Function Error: ${error.message}`);
        
        updateMessage(messageId, {
          response: data.text,
          loading: false,
        });
      } else {
        // Use existing ai-travel-chat with the memory system
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

        // Store comprehensive itinerary and navigate to dedicated page
        if (data.comprehensiveItinerary && data.isComprehensiveItinerary) {
          const itineraryId = Date.now().toString();
          localStorage.setItem(`itinerary_${itineraryId}`, JSON.stringify(data.comprehensiveItinerary));
          
          // Navigate to the comprehensive itinerary page
          window.location.href = `/comprehensive-itinerary/${itineraryId}`;
          return; // Don't add the message to chat since we're navigating away
        }
      }

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
