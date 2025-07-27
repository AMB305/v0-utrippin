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
  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  useEffect(() => {
    if (user) resetSession();
  }, [user]);

  useEffect(() => {
    console.log('AiTravel component - authLoading:', authLoading, 'user:', user?.email || 'no user');
  }, [authLoading, user]);

  const handleSendMessage = (message) => sendMessage(message);

  console.log('AiTravel rendering - authLoading:', authLoading, 'user:', !!user);

  if (authLoading) {
    console.log('AiTravel: Still loading auth...');
    return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading...</div>;
  }

  if (!user) {
    console.log('AiTravel: No user, showing LoginCard');
    return <LoginCard />;
  }

  console.log('AiTravel: User authenticated, rendering DesktopTravelPlanner');

  try {
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
  } catch (error) {
    console.error('Error rendering AiTravel:', error);
    return <div className="flex items-center justify-center h-dvh bg-red-500 text-white">Error loading page: {error.message}</div>;
  }
};

export default AiTravel;