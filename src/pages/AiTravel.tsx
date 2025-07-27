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

  return (
    <>
      <SEOHead title="AI Travel Planner | Utrippin" description="Your personal AI travel assistant, Keila." canonical="https://utrippin.ai/ai-travel" />
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <div className="bg-white p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">AI Travel Planner</h1>
            <p>Debug: User is authenticated</p>
            <p>Messages: {messages.length}</p>
            <p>Loading: {loading ? 'true' : 'false'}</p>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-bold">Hi, I'm Keila!</h2>
            <p>Your AI travel assistant</p>
            <button 
              onClick={() => handleSendMessage("Hello Keila")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Test Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiTravel;