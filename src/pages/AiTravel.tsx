// src/pages/AiTravel.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Send, Menu, ArrowLeft, MessageSquare } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MobileQuickQuestions } from "@/components/MobileQuickQuestions";
import { ItineraryCard } from "@/components/ItineraryCard";
import DesktopTravelPlanner from "@/components/DesktopTravelPlanner";
import { Link } from "react-router-dom";
import { AuthStatus } from "@/components/AuthStatus";

// Simple loading component
const KeilaThinking = () => (
  <div className="bg-gray-900 px-4 py-2 rounded-2xl max-w-[80%] border border-gray-800">
    <p className="text-sm text-gray-400 italic">Keila is planning...</p>
  </div>
);

// --- NEW REDESIGNED AUTH WALL ---
const AuthWall = () => (
  <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 via-purple-950 to-black">
    <div className="relative bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 max-w-md w-full text-center shadow-2xl shadow-purple-500/10">
      {/* Keila Bot peeking from the top */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2">
        <img 
          src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
          alt="Keila Bot" 
          className="w-24 h-24 drop-shadow-lg"
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Let's plan your perfect Staycation or Vacation Together!
        </h2>
        <p className="text-gray-400 mb-6">
          Sign in or create your free account to get started with your personal AI travel assistant.
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white w-full">
          <Link to="/auth">Continue</Link>
        </Button>
      </div>
    </div>
  </div>
);

const AiTravel = () => {
  const [mobileInput, setMobileInput] = useState("");
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  useEffect(() => {
    resetSession();
  }, []);

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
    return <AuthWall />;
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
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <BlurFade delay={0.1} inView>
                <div className="flex items-center gap-2 mb-6">
                  <img src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" alt="Keila Bot" className="w-14 h-14 animate-float"/>
                  <TextAnimate animation="blurInUp" delay={0.3} by="character" once as="h1" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                    Hi! I'm Keila
                  </TextAnimate>
                </div>
              </BlurFade>
              <BlurFade delay={0.7} inView>
                <MobileQuickQuestions onQuestionSelect={handleWelcomePrompt} />
              </BlurFade>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-black flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={resetSession}>
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
                <div className="flex items-center gap-2">
                  <img src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" alt="Keila Bot" className="w-8 h-8"/>
                  <h1 className="text-lg font-bold text-white">Keila</h1>
                </div>
                <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white" onClick={resetSession}>
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
                          <div className="bg-gray-900 px-4 py-2 rounded-2xl max-w-[80%] border border-gray-800">
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
                className="flex-1 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
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
          hasStartedChat={hasStartedChat}
          onClearChat={resetSession}
          chatMessages={messages}
          isLoading={loading}
          onSendMessage={sendMessage}
        />
      )}
    </>
  );
};

export default AiTravel;
