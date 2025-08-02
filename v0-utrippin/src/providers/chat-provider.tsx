// src/providers/chat-provider.tsx

import { ReactNode, useState } from 'react';
import { ChatContext, ChatMessage, ChatContextType } from '@/contexts/chat-context';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, ...updates, loading: false } : msg
      )
    );
  };

  const clearMessages = () => {
    console.log("GLOBAL STATE: Clearing all messages.");
    setMessages([]);
    // Clear any stored chat data
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("chatSession");
    localStorage.removeItem("aiTravelChat");
    // Clear session storage as well
    sessionStorage.removeItem("chatHistory");
    sessionStorage.removeItem("chatSession");
    sessionStorage.removeItem("aiTravelChat");
  };

  const value: ChatContextType = { messages, addMessage, updateMessage, clearMessages };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
