// src/components/DesktopTravelPlanner.tsx

import React from 'react';
import ChatContainer from './custom/ChatContainer';
import { useChatAI } from '@/hooks/useChatAI';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedKeila } from '@/components/AnimatedKeila';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageSquare, Compass, Heart, Utensils, User, Send } from 'lucide-react';

interface DesktopTravelPlannerProps {
  onQuestionSelect: (question: string) => void;
  hasStartedChat?: boolean;
  onClearChat?: () => void;
  chatMessages?: any[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

const DesktopTravelPlanner: React.FC<DesktopTravelPlannerProps> = ({ onQuestionSelect }) => {
  const { user } = useAuth();
  const { messages, sendMessage, loading, resetSession } = useChatAI();
  const hasStartedChat = messages.length > 0;
  const [desktopInput, setDesktopInput] = React.useState("");

  const handleWelcomePrompt = (question: string) => {
    if (messages.length > 0) resetSession();
    setTimeout(() => {
      const enhancedQuestion = `${question}. Please provide a complete detailed day-by-day itinerary.`;
      onQuestionSelect(enhancedQuestion);
    }, 100);
  };

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
      setDesktopInput("");
    }
  };

  return (
    <div className="hidden lg:grid grid-cols-12 h-screen bg-black text-white">
      {!hasStartedChat ? (
        // Full Screen Welcome View
        <div className="col-span-12 flex flex-col items-center justify-center p-8 text-center">
          <AnimatedKeila />
          <h1 className="text-5xl font-bold mt-12 mb-4">Ready to explore the world?</h1>
          <p className="text-xl text-gray-400 mb-12">Let's plan your dream trip! ✨</p>
          
          {/* Central Input */}
          <div className="w-full max-w-2xl mb-12">
            <div className="flex gap-3">
              <Input
                value={desktopInput}
                onChange={(e) => setDesktopInput(e.target.value)}
                placeholder="Ask me anything about your trip..."
                className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500 h-14 text-lg px-6 rounded-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(desktopInput)}
              />
              <Button onClick={() => handleSendMessage(desktopInput)} disabled={!desktopInput.trim() || loading} className="bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Prompt Chips */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            <button onClick={() => handleWelcomePrompt("Create a new trip")} className="bg-gray-800/50 border border-gray-600 rounded-full px-6 py-3 text-base hover:bg-gray-700/50 transition-colors flex items-center gap-3">
              🗺️ Create a new trip
            </button>
            <button onClick={() => handleWelcomePrompt("Get inspired")} className="bg-gray-800/50 border border-gray-600 rounded-full px-6 py-3 text-base hover:bg-gray-700/50 transition-colors flex items-center gap-3">
              💡 Get inspired
            </button>
            <button onClick={() => handleWelcomePrompt("Inspire me where to go")} className="bg-gray-800/50 border border-gray-600 rounded-full px-6 py-3 text-base hover:bg-gray-700/50 transition-colors flex items-center gap-3">
              ✨ Inspire me where to go
            </button>
            <button onClick={() => handleWelcomePrompt("Plan a solo trip")} className="bg-gray-800/50 border border-gray-600 rounded-full px-6 py-3 text-base hover:bg-gray-700/50 transition-colors flex items-center gap-3">
              🧳 Solo trip
            </button>
            <button onClick={() => handleWelcomePrompt("Find a romantic getaway for two")} className="bg-gray-800/50 border border-gray-600 rounded-full px-6 py-3 text-base hover:bg-gray-700/50 transition-colors flex items-center gap-3">
              👫 Partner
            </button>
            <button onClick={() => handleWelcomePrompt("Plan a family vacation")} className="bg-gray-800/50 border border-gray-600 rounded-full px-6 py-3 text-base hover:bg-gray-700/50 transition-colors flex items-center gap-3">
              👨‍👩‍👧‍👦 Family
            </button>
          </div>
        </div>
      ) : (
        // Chat View - Split Layout
        <>
          <div className="col-span-4 p-8 flex flex-col justify-center border-r border-gray-700">
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
          </div>

          <div className="col-span-8 bg-gray-900 rounded-l-2xl">
            <ChatContainer
              messages={messages}
              isLoading={loading}
              onSendMessage={sendMessage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DesktopTravelPlanner;
