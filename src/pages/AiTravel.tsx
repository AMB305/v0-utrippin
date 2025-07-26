// src/pages/AiTravel.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { Send, MessageSquare, LogIn, Compass, Heart, Utensils, User, Plus } from "lucide-react";
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
        <div className="flex h-dvh bg-black text-white">
          {/* Side Navigation */}
          <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-6">
            <button className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500 flex items-center justify-center">
              <Compass className="h-5 w-5 text-purple-400" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500 flex items-center justify-center">
              <User className="h-5 w-5 text-orange-400" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500 flex items-center justify-center">
              <Utensils className="h-5 w-5 text-teal-400" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-400" />
            </button>
            
            <div className="flex-1"></div>
            
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {!hasStartedChat ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <AnimatedKeila />
                <h1 className="text-3xl font-bold mt-8 mb-2">Ready to explore the world?</h1>
                <p className="text-gray-400 mb-8">Let's plan your dream trip! ✨</p>
                
                {/* Central Input */}
                <div className="w-full max-w-2xl mb-8">
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me anything about your trip.."
                      className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl p-4 pl-12 pr-12 outline-none border border-pink-500/20 focus:border-pink-500 placeholder-gray-500 resize-none"
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(mobileInput))}
                    />
                    <button className="absolute bottom-3 left-3 text-white text-sm">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleSendMessage(mobileInput)} 
                      disabled={!mobileInput.trim() || loading} 
                      className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white text-xs disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Prompt Chips */}
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                  <button onClick={() => handleWelcomePrompt("Create a new trip")} className="flex items-center gap-2 bg-[#1e1e1e] border border-green-500/30 hover:border-green-500 text-sm px-4 py-2 rounded-full transition">
                    <span>🧳</span> Create a new trip
                  </button>
                  <button onClick={() => handleWelcomePrompt("Get inspired")} className="flex items-center gap-2 bg-[#1e1e1e] border border-blue-500/30 hover:border-blue-500 text-sm px-4 py-2 rounded-full transition">
                    <span>🌍</span> Get inspired
                  </button>
                  <button onClick={() => handleWelcomePrompt("Inspire me where to go")} className="flex items-center gap-2 bg-[#1e1e1e] border border-indigo-500/30 hover:border-indigo-500 text-sm px-4 py-2 rounded-full transition">
                    <span>🗺️</span> Inspire me where to go
                  </button>
                  <button onClick={() => handleWelcomePrompt("Plan a solo trip")} className="flex items-center gap-2 bg-[#1e1e1e] border border-yellow-500/30 hover:border-yellow-500 text-sm px-4 py-2 rounded-full transition">
                    <span>🚴</span> Solo trip
                  </button>
                  <button onClick={() => handleWelcomePrompt("Find a romantic getaway for two")} className="flex items-center gap-2 bg-[#1e1e1e] border border-pink-500/30 hover:border-pink-500 text-sm px-4 py-2 rounded-full transition">
                    <span>💑</span> Partner
                  </button>
                  <button onClick={() => handleWelcomePrompt("Plan a family vacation")} className="flex items-center gap-2 bg-[#1e1e1e] border border-purple-500/30 hover:border-purple-500 text-sm px-4 py-2 rounded-full transition">
                    <span>👨‍👩‍👧‍👦</span> Family
                  </button>
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
