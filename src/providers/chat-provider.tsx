// src/providers/chat-provider.tsx

import { ReactNode, useState } from 'react';
import { ChatContext, ChatMessage } from '@/contexts/chat-context';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  
  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, ...updates, loading: false } : msg
      )
    );
  };

  const clearMessages = () => {
    console.log("STATE CLEAR: Setting messages to an empty array.");
    setMessages([]);
    // Also clear relevant local storage for good measure
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("tripContext");
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, updateMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}