// src/components/DesktopTravelPlanner.tsx

import React from 'react';
// CORRECTED IMPORT: We are changing the import to correctly match the export from ChatContainer
import ChatContainer from './custom/ChatContainer';
import { useAuth } from '@/hooks/useAuth';
import { TextAnimate } from '@/components/magicui/text-animate';
import { BlurFade } from '@/components/magicui/blur-fade';
import { MobileQuickQuestions } from '@/components/MobileQuickQuestions';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';

const DesktopTravelPlanner = ({
  onQuestionSelect,
  hasStartedChat,
  onClearChat,
  chatMessages,
  isLoading,
  onSendMessage,
}) => {
  const { user } = useAuth();

  return (
    <div className="hidden lg:grid grid-cols-12 h-screen bg-black text-white">
      {/* Left Panel - Welcome/Context */}
      <div className="col-span-4 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">AI Travel Planner</h1>
          <p className="text-gray-400">
            Welcome, {user?.email || 'Traveler'}. Let Keila help you plan your next adventure.
          </p>
        </div>
        {!hasStartedChat && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            <MobileQuickQuestions onQuestionSelect={onQuestionSelect} />
          </div>
        )}
        <Button onClick={onClearChat} variant="outline" className="mt-4">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="col-span-8 bg-gray-900 rounded-l-2xl">
        <ChatContainer
          messages={chatMessages}
          isLoading={isLoading}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
};

export default DesktopTravelPlanner;
