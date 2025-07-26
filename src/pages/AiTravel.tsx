// src/pages/AiTravel.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { Send, MessageSquare, LogIn, Compass, Heart, Utensils, User } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { ItineraryCard } from "@/components/ItineraryCard";
import DesktopTravelPlanner from "@/components/DesktopTravelPlanner";
import { Link } from "react-router-dom";
import { AnimatedKeila } from "@/components/AnimatedKeila";
import LoginCard from "@/components/LoginCard";

// --- UI COMPONENTS ---

const KeilaThinking = () => (
  <div className="bg-gray-800 px-4 py-3 rounded-2xl max-w-[80%] border border-gray-700">
    <p className="text-sm text-gray-400 italic">Keila is planning your trip...</p>
  </div>
);

const WelcomePromptCard = ({ icon, title, question, onClick }: { icon: React.ReactNode; title: string; question: string; onClick: (question: string) => void }) => (
    <button onClick={() => onClick(question)} className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-4 text-left w-full hover:bg-blue-800/50 transition-colors flex items-center gap-4">
        <div className="text-blue-400">{icon}</div>
        <span className="font-semibold">{title}</span>
    </button>
);

// --- MAIN PAGE COMPONENT ---

const AiTravel = () => {
  const [mobileInput, setMobileInput] = useState("");
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  useEffect(() => {
    if (user) resetSession();
  }, [user]);

  const handleSendMessage = (message: string) => {
    if (message.trim()) sendMessage(message);
    if (isMobile) setMobileInput("");
  };

  const handleWelcomePrompt = (question: string) => {
    if (messages.length > 0) resetSession();
    setTimeout(() => {
      const enhancedQuestion = `${question}. Please provide a complete detailed day-by-day itinerary.`;
      sendMessage(enhancedQuestion);
    }, 100);
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading...</div>;
  }

  if (!user) {
    return <LoginCard />;
  }

  return (
    <>
      <SEOHead
        title="AI Travel Planner | Utrippin"
        description="Your personal AI travel assistant, Keila."
        canonical="https://utrippin.ai/ai-travel"
      />
      
      {isMobile ? (
        <div className="flex flex-col h-dvh bg-black text-white">
          {!hasStartedChat ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <AnimatedKeila />
              <h1 className="text-2xl font-bold mt-4">Hi, I'm Keila!</h1>
              <p className="text-blue-200/80 mt-2 mb-6">How can I help you plan your next trip?</p>
              <div className="w-full max-w-sm space-y-3">
                  <WelcomePromptCard icon={<Compass size={24} />} title="Plan a Full Trip" question="Plan a weekend getaway." onClick={handleWelcomePrompt} />
                  <WelcomePromptCard icon={<Heart size={24} />} title="Romantic Getaway" question="Find a romantic getaway for two." onClick={handleWelcomePrompt} />
                  <WelcomePromptCard icon={<Utensils size={24} />} title="Foodie Tour" question="Create a foodie tour." onClick={handleWelcomePrompt} />
                  <WelcomePromptCard icon={<User size={24} />} title="Solo Adventure" question="Plan a solo adventure." onClick={handleWelcomePrompt} />
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-black flex-shrink-0">
                  <h1 className="text-lg font-bold text-white">Chat with Keila</h1>
                  <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white" onClick={resetSession}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      New Chat
                  </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className="flex justify-end">
                      <div className="bg-blue-600 px-4 py-2 rounded-2xl max-w-[80%]">
                        <p className="text-sm text-white">{message.question}</p>
                      </div>
                    </div>
                    {message.loading ? (
                      <div className="flex justify-start w-full mt-2">
                        <KeilaThinking />
                      </div>
                    ) : message.response || message.detailedItinerary ? (
                      <div className="flex justify-start w-full mt-2">
                        {message.isDetailedItinerary && message.detailedItinerary ? (
                          <ItineraryCard itinerary={message.detailedItinerary} />
                        ) : (
                          <div className="bg-gray-800 px-4 py-2 rounded-2xl max-w-[80%] border border-gray-700">
                            <p className="text-sm text-gray-200">{message.response}</p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="p-4 bg-black border-t border-gray-800">
             <div className="flex gap-2">
              <Input
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                placeholder="Ask Keila to plan a trip..."
                className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(mobileInput)}
              />
              <Button onClick={() => handleSendMessage(mobileInput)} disabled={!mobileInput.trim() || loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <DesktopTravelPlanner 
          onQuestionSelect={handleWelcomePrompt}
        />
      )}
    </>
  );
};

export default AiTravel;
