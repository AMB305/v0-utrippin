// src/pages/AiTravel.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { Send, MessageSquare, LogIn } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { ItineraryCard } from "@/components/ItineraryCard";
import DesktopTravelPlanner from "@/components/DesktopTravelPlanner";
import { Link } from "react-router-dom";
import { AnimatedKeila } from "@/components/AnimatedKeila";

const KeilaThinking = () => (
  <div className="bg-white px-4 py-3 rounded-2xl max-w-[80%] shadow-md animate-pulse">
    <p className="text-sm text-gray-500 italic">Keila is planning your trip...</p>
  </div>
);

const AuthWall = () => (
  <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-[#0b1120] to-[#1a2a41]">
    <div className="bg-[#101c33] rounded-2xl shadow-lg p-8 w-full max-w-md relative border border-blue-800/30 text-center text-white">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2">
        <img src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" alt="Keila Bot" className="w-28 h-28 animate-float drop-shadow-[0_5px_15px_rgba(100,100,255,0.3)]" />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2 leading-tight">Welcome to Keila!</h2>
        <p className="text-blue-200/80 mb-6">Let's plan your perfect Staycation or Vacation together!</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full font-bold text-lg rounded-full">
          <Link to="/auth">Sign In to Get Started</Link>
        </Button>
      </div>
    </div>
  </div>
);

const AiTravel = () => {
  const { user, loading: authLoading } = useAuth();
  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  useEffect(() => {
    if (user) resetSession();
  }, [user]);

  const handleSendMessage = (message) => sendMessage(message);

  if (authLoading) {
    return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading...</div>;
  }

  if (!user) {
    return <AuthWall />;
  }

  return (
    <>
      <SEOHead title="AI Travel Planner | Utrippin" description="Your personal AI travel assistant, Keila." canonical="https://utrippin.ai/ai-travel" />
      <DesktopTravelPlanner
        hasStartedChat={hasStartedChat}
        onClearChat={resetSession}
        chatMessages={messages}
        isLoading={loading}
        onSendMessage={handleSendMessage}
        onQuestionSelect={handleSendMessage}
      />
    </>
  );
};

export default AiTravel;