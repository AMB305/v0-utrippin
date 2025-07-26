import { createContext } from 'react';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: React.ReactNode | string;
  files?: File[];
}

export interface ChatMessage {
  id: string;
  question?: string;
  response?: string;
  detailedItinerary?: any;
  isDetailedItinerary?: boolean;
  showMap?: boolean;
  mapLocation?: string;
  quickReplies?: string[];
  callsToAction?: Array<{ label: string; action: string }>;
  loading?: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);