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
import LoginCard from "@/components/LoginCard";

const KeilaThinking = () => (
  <div className="bg-white px-4 py-3 rounded-2xl max-w-[80%] shadow-md animate-pulse">
    <p className="text-sm text-gray-500 italic">Keila is planning your trip...</p>
  </div>
);

const AiTravel = () => {
  const { user, loading: authLoading } = useAuth();
  
  // Mobile debugging
  console.log('AiTravel - Mobile Debug:', {
    authLoading,
    user: user ? 'exists' : 'null',
    userAgent: navigator.userAgent,
    isMobile: window.innerWidth < 768
  });

  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  useEffect(() => {
    console.log('AiTravel useEffect - user changed:', user ? 'exists' : 'null');
    if (user) resetSession();
  }, [user]);

  const handleSendMessage = (message) => sendMessage(message);

  // Add timeout fallback for mobile
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authLoading) {
        console.error('Mobile: Auth loading timeout after 10 seconds');
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [authLoading]);

  if (authLoading) {
    console.log('AiTravel - Showing loading screen, authLoading:', authLoading);
    return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading...</div>;
  }

  if (!user) {
    return <LoginCard />;
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