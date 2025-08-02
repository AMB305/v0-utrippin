import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AITripPlannerResponse {
  response: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export const useAITripPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error: supabaseError } = await supabase.functions.invoke('ai-trip-planner', {
        body: {
          message,
          conversationHistory
        }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      const aiResponse: AITripPlannerResponse = data;

      // Add AI response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      console.error('AI Trip Planner error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading,
    error
  };
};
