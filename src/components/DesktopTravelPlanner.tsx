// src/components/DesktopTravelPlanner.tsx

import React from 'react';
// CORRECTED IMPORT: We are changing the import to correctly match the export.
import { ChatContainer } from './custom/chat-container'; 
import { useChatAI } from '@/hooks/useChatAI';
import { useAuth } from '@/hooks/useAuth';
import { TextAnimate } from '@/components/magicui/text-animate';
import { BlurFade } from '@/components/magicui/blur-fade';
import { MobileQuickQuestions } from '@/components/MobileQuickQuestions';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';

// This is the "smart" component that controls the chat state.
const DesktopTravelPlanner = ({ onQuestionSelect }) => {
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
        
        <Button onClick={resetSession} variant="outline" className="mt-4 border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
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
