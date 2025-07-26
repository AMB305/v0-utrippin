// src/contexts/chat-context.tsx

import { createContext } from 'react';

// Define the shape of a single message
export interface ChatMessage {
  id: string;
  question: string;
  response?: string;
  loading?: boolean;
  showMap?: boolean;
  mapLocation?: string;
  isDetailedItinerary?: boolean;
  detailedItinerary?: any; // Using 'any' for simplicity, can be typed later
  quickReplies?: string[];
  callsToAction?: any[];
}

// Define the shape of the context's value
export interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
}

// Create the context
export const ChatContext = createContext<ChatContextType | undefined>(undefined);