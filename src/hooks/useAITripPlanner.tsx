
import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAITripPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Mock API call - replace with actual AI service
      const response = await fetch('/api/ai-trip-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I apologize, but I couldn\'t generate a trip plan at the moment. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const errorMessage: Message = {
        role: 'assistant',
        content: `
          <div class="trip-overview">
            <h2>Sample Trip Plan</h2>
            <p>I'm currently unable to connect to the AI service, but here's what a comprehensive trip plan would include:</p>
            
            <div class="trip-section">
              <h3>🏨 Accommodations</h3>
              <p>Handpicked hotels and lodging options with direct booking links</p>
            </div>
            
            <div class="trip-section">
              <h3>✈️ Transportation</h3>
              <p>Flight options and local transportation recommendations</p>
            </div>
            
            <div class="trip-section">
              <h3>🎯 Activities & Attractions</h3>
              <p>Curated experiences based on your interests and budget</p>
            </div>
            
            <div class="trip-section">
              <h3>🍽️ Dining</h3>
              <p>Restaurant recommendations from local gems to fine dining</p>
            </div>
          </div>
        `,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
  };
};
