// src/pages/AiTravel.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Send, Menu, ArrowLeft, MessageSquare, LogIn } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MobileQuickQuestions } from "@/components/MobileQuickQuestions";
import { ItineraryCard } from "@/components/ItineraryCard";
import DesktopTravelPlanner from "@/components/DesktopTravelPlanner";
import { Link } from "react-router-dom";
import { AuthStatus } from "@/components/AuthStatus";

const KeilaThinking = () => (
  <div className="bg-gray-900 px-4 py-2 rounded-2xl max-w-[80%] border border-gray-800">
    <p className="text-sm text-gray-400 italic">Keila is planning...</p>
  </div>
);

const AuthWall = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-black text-white">
    <LogIn size={48} className="text-purple-400 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Chat with Keila</h2>
    <p className="text-gray-400 mb-6">Please sign in or create an account to start planning your trip.</p>
    <div className="flex gap-4">
      <Button asChild>
        <Link to="/auth">Log In / Sign Up</Link>
      </Button>
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
    // Clear chat on component mount (page load/refresh)
    resetSession();
    
    // Clear chat when user leaves the page or refreshes
    const handleBeforeUnload = () => {
      resetSession();
    };
    
    const handleUnload = () => {
      resetSession();
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        resetSession();
      }
    };
    
    // Add event listeners for page unload/refresh
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetSession]);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
      if (isMobile) setMobileInput("");
    }
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
            <div className="flex-1 flex flex-col bg-black">
              <div className="absolute top-4 left-4 z-10">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] bg-black border-gray-800 text-white">
                    <SheetHeader>
                      <SheetTitle className="text-white">Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 pt-4">
                      <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/"}>Home</Button>
                      <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/flights"}>Flights</Button>
                      <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/hotels"}>Hotels</Button>
                      <div className="border-t border-gray-700 my-2"></div>
                      <AuthStatus />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
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
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-black flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={resetSession}>
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetSession}
                    className="text-gray-400 hover:text-white"
                  >
                    Clear Chat
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" alt="Keila Bot" className="w-8 h-8"/>
                  <h1 className="text-lg font-bold text-white">Keila</h1>
                </div>
                <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white" onClick={resetSession}>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Chat
                  </div>
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
