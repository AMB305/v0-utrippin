import { createContext } from 'react';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: React.ReactNode | string;
  files?: File[];
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined); 