// src/components/DesktopTravelPlanner.tsx

import React from 'react';
import ChatContainer from './custom/ChatContainer';
import { useChatAI } from '@/hooks/useChatAI';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedKeila } from '@/components/AnimatedKeila';
import { Button } from './ui/button';
import { MessageSquare, Compass, Heart, Utensils, User } from 'lucide-react';

interface DesktopTravelPlannerProps {
  onQuestionSelect: (question: string) => void;
  hasStartedChat?: boolean;
  onClearChat?: () => void;
  chatMessages?: any[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

const WelcomePromptCard = ({ icon, title, question, onClick }: { icon: React.ReactNode; title: string; question: string; onClick: (question: string) => void }) => (
  <button onClick={() => onClick(question)} className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-4 text-left w-full hover:bg-blue-800/50 transition-colors flex items-center gap-4 mb-3">
    <div className="text-blue-400">{icon}</div>
    <span className="font-semibold">{title}</span>
  </button>
);

// This is the "smart" component that controls the chat state.
const DesktopTravelPlanner: React.FC<DesktopTravelPlannerProps> = ({ onQuestionSelect }) => {
  const { user } = useAuth();
  const { messages, sendMessage, loading, resetSession } = useChatAI();
  const hasStartedChat = messages.length > 0;

  const handleWelcomePrompt = (question: string) => {
    if (messages.length > 0) resetSession();
    setTimeout(() => {
      const enhancedQuestion = `${question}. Please provide a complete detailed day-by-day itinerary.`;
      onQuestionSelect(enhancedQuestion);
    }, 100);
  };

  return (
    <div className="hidden lg:grid grid-cols-12 h-screen bg-black text-white">
      {/* Left Panel */}
      <div className="col-span-4 p-8 flex flex-col justify-center border-r border-gray-700">
        {!hasStartedChat ? (
          <div className="flex flex-col items-center text-center">
            <AnimatedKeila />
            <h1 className="text-3xl font-bold mt-6 mb-2">Hi, I'm Keila!</h1>
            <p className="text-blue-200/80 mb-8">How can I help you plan your next trip?</p>
            
            <div className="w-full max-w-sm space-y-3">
              <WelcomePromptCard icon={<Compass size={24} />} title="Plan a Full Trip" question="Plan a weekend getaway." onClick={handleWelcomePrompt} />
              <WelcomePromptCard icon={<Heart size={24} />} title="Romantic Getaway" question="Find a romantic getaway for two." onClick={handleWelcomePrompt} />
              <WelcomePromptCard icon={<Utensils size={24} />} title="Foodie Tour" question="Create a foodie tour." onClick={handleWelcomePrompt} />
              <WelcomePromptCard icon={<User size={24} />} title="Solo Adventure" question="Plan a solo adventure." onClick={handleWelcomePrompt} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold mb-4">Chat with Keila</h1>
            <Button 
              onClick={resetSession} 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}
      </div>

      {/* Right Panel - The ChatContainer */}
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
