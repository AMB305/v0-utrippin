// src/components/DesktopTravelPlanner.tsx

import React from 'react';
import ChatContainer from './custom/ChatContainer';
import { useAuth } from '@/hooks/useAuth';
import { MobileQuickQuestions } from '@/components/MobileQuickQuestions';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { AnimatedKeila } from './AnimatedKeila';

const DesktopTravelPlanner = ({ onQuestionSelect, hasStartedChat, onClearChat, chatMessages, isLoading, onSendMessage }) => {
  const { user } = useAuth();

  return (
    <div className="hidden lg:grid grid-cols-12 h-screen bg-gray-100 text-black">
      {/* Left Panel - Dark Sidebar */}
      <div className="col-span-4 p-8 flex flex-col justify-between bg-black text-white">
        <div>
          <h1 className="text-3xl font-bold mb-4">AI Travel Planner</h1>
          <p className="text-gray-400">
            Welcome, {user?.email || 'Traveler'}. Let Keila help you.
          </p>
        </div>
        
        {!hasStartedChat && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Get Started</h2>
            <MobileQuickQuestions onQuestionSelect={onQuestionSelect} />
          </div>
        )}
        
        <Button onClick={onClearChat} variant="outline" className="mt-4 bg-transparent border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Right Panel - WHITE Chat Interface */}
      <div className="col-span-8 bg-white">
        {hasStartedChat ? (
          <ChatContainer
            messages={chatMessages}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AnimatedKeila />
            <h1 className="text-3xl font-bold mt-4 text-gray-900">Hi, I'm Keila!</h1>
            <p className="text-gray-500 mt-2">Select a prompt on the left to start planning.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopTravelPlanner;
