// src/components/DesktopTravelPlanner.tsx

import React from 'react';
import ChatContainer from './custom/ChatContainer';
import { useChatAI } from '@/hooks/useChatAI';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedKeila } from '@/components/AnimatedKeila';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageSquare, Compass, Heart, Utensils, User, Send, Plus } from 'lucide-react';

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
    <div className="hidden lg:flex h-screen bg-black text-white">
      {/* Side Navigation */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-6 space-y-8">
        <button className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500 flex items-center justify-center">
          <Compass className="h-6 w-6 text-purple-400" />
        </button>
        <button className="w-12 h-12 rounded-lg bg-orange-500/20 border border-orange-500 flex items-center justify-center">
          <User className="h-6 w-6 text-orange-400" />
        </button>
        <button className="w-12 h-12 rounded-lg bg-teal-500/20 border border-teal-500 flex items-center justify-center">
          <Utensils className="h-6 w-6 text-teal-400" />
        </button>
        <button className="w-12 h-12 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center">
          <Heart className="h-6 w-6 text-red-400" />
        </button>
        
        <div className="flex-1"></div>
        
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
      </div>

      <div className="flex-1 flex">
        {!hasStartedChat ? (
          // Full Screen Welcome View
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AnimatedKeila />
            <h1 className="text-5xl font-bold mt-12 mb-4">Ready to explore the world?</h1>
            <p className="text-xl text-gray-400 mb-12">Let's plan your dream trip! ✨</p>
            
            {/* Central Input */}
            <div className="w-full max-w-2xl mb-12">
              <div className="relative">
                <textarea
                  rows={2}
                  value={desktopInput}
                  onChange={(e) => setDesktopInput(e.target.value)}
                  placeholder="Ask me anything about your trip.."
                  className="w-full bg-[#1e1e1e] text-white text-lg rounded-xl p-4 pl-12 pr-12 outline-none border border-pink-500/20 focus:border-pink-500 placeholder-gray-500 resize-none"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(desktopInput))}
                />
                <button className="absolute bottom-3 left-3 text-white text-sm">
                  <Plus className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleSendMessage(desktopInput)} 
                  disabled={!desktopInput.trim() || loading} 
                  className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
              <button onClick={() => handleWelcomePrompt("Create a new trip")} className="flex items-center gap-2 bg-[#1e1e1e] border border-green-500/30 hover:border-green-500 text-base px-6 py-3 rounded-full transition">
                <span>🧳</span> Create a new trip
              </button>
              <button onClick={() => handleWelcomePrompt("Get inspired")} className="flex items-center gap-2 bg-[#1e1e1e] border border-blue-500/30 hover:border-blue-500 text-base px-6 py-3 rounded-full transition">
                <span>🌍</span> Get inspired
              </button>
              <button onClick={() => handleWelcomePrompt("Inspire me where to go")} className="flex items-center gap-2 bg-[#1e1e1e] border border-indigo-500/30 hover:border-indigo-500 text-base px-6 py-3 rounded-full transition">
                <span>🗺️</span> Inspire me where to go
              </button>
              <button onClick={() => handleWelcomePrompt("Plan a solo trip")} className="flex items-center gap-2 bg-[#1e1e1e] border border-yellow-500/30 hover:border-yellow-500 text-base px-6 py-3 rounded-full transition">
                <span>🚴</span> Solo trip
              </button>
              <button onClick={() => handleWelcomePrompt("Find a romantic getaway for two")} className="flex items-center gap-2 bg-[#1e1e1e] border border-pink-500/30 hover:border-pink-500 text-base px-6 py-3 rounded-full transition">
                <span>💑</span> Partner
              </button>
              <button onClick={() => handleWelcomePrompt("Plan a family vacation")} className="flex items-center gap-2 bg-[#1e1e1e] border border-purple-500/30 hover:border-purple-500 text-base px-6 py-3 rounded-full transition">
                <span>👨‍👩‍👧‍👦</span> Family
              </button>
            </div>
          </div>
        ) : (
          // Chat View - Split Layout
          <div className="flex-1 flex">
            <div className="w-1/3 p-8 flex flex-col justify-center border-r border-gray-700">
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

            <div className="w-2/3 bg-gray-900 rounded-l-2xl">
              <ChatContainer
                messages={messages}
                isLoading={loading}
                onSendMessage={sendMessage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopTravelPlanner;
