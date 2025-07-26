// src/components/DesktopTravelPlanner.tsx

import React from 'react';
// CORRECTED IMPORT: We are changing the import to correctly match the export.
import ChatContainer from './custom/ChatContainer';
import { useChatAI } from '@/hooks/useChatAI';
import { useAuth } from '@/hooks/useAuth';
import { TextAnimate } from '@/components/magicui/text-animate';
import { BlurFade } from '@/components/magicui/blur-fade';
import { MobileQuickQuestions } from '@/components/MobileQuickQuestions';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';

interface DesktopTravelPlannerProps {
  onQuestionSelect: (question: string) => void;
  hasStartedChat?: boolean;
  onClearChat?: () => void;
  chatMessages?: any[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

// This is the "smart" component that controls the chat state.
const DesktopTravelPlanner: React.FC<DesktopTravelPlannerProps> = ({ onQuestionSelect }) => {
  const { user } = useAuth();
  const { messages, sendMessage, loading, resetSession } = useChatAI();
  const hasStartedChat = messages.length > 0;

  return (
    <div className="hidden lg:grid grid-cols-12 h-screen bg-black text-white">
      {/* Left Panel */}
      <div className="col-span-4 p-8 flex flex-col justify-between border-r border-gray-700">
        <div>
          <h1 className="text-3xl font-bold mb-4">AI Travel Planner</h1>
          <p className="text-gray-400">
            Welcome, {user?.email || 'Traveler'}. Let Keila help you plan your next adventure.
          </p>
        </div>
        
        {!hasStartedChat && (
          <BlurFade delay={0.3} inView>
            <div>
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <MobileQuickQuestions onQuestionSelect={onQuestionSelect} />
            </div>
          </BlurFade>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={resetSession} 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white border-gray-600 hover:border-gray-500"
          >
            Clear Chat
          </Button>
          <Button 
            onClick={resetSession} 
            variant="outline" 
            className="mt-4 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Chat
            </div>
          </Button>
        </div>
      </div>

      {/* Right Panel - The "dumb" ChatContainer now receives state as props */}
      <div className="col-span-8 bg-gray-900 rounded-l-2xl">
        <ChatContainer
          messages={messages}
          isLoading={loading}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default DesktopTravelPlanner;
