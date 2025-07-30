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
import { MobileTravelInterface } from "@/components/mobile/MobileTravelInterface";

const KeilaThinking = () => (
  <div className="bg-white px-4 py-3 rounded-2xl max-w-[80%] shadow-md animate-pulse">
    <p className="text-sm text-gray-500 italic">Keila is planning your trip...</p>
  </div>
);

const AiTravel = () => {
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Mobile debugging
  console.log('AiTravel - Mobile Debug:', {
    authLoading,
    user: user ? 'exists' : 'null',
    userAgent: navigator.userAgent,
    isMobile
  });

  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  // Only reset session on initial load, not on every user change
  useEffect(() => {
    console.log('AiTravel useEffect - initial load');
    // Don't reset session on user changes to prevent chat wipe
  }, []); // Empty dependency array for initial load only

  const handleSendMessage = (message: string) => sendMessage(message);

  const handleMobileSearch = (query: string) => {
    sendMessage(`I want to plan a trip to ${query}`);
  };

  const handleMobileCategorySelect = (category: string) => {
    const categoryMessages = {
      hotels: "I'm looking for hotel recommendations",
      flights: "I need help finding flights",
      packages: "I want to book a flight and hotel package",
      trains: "I'm interested in train travel",
      rentals: "I need a vacation rental",
      attractions: "Show me popular attractions",
      cars: "I need to rent a car",
      transfers: "I need airport transfer options"
    };
    
    const message = categoryMessages[category] || `Help me with ${category}`;
    sendMessage(message);
  };

  const handleMobileDestinationClick = (destination: string) => {
    sendMessage(`I want to visit ${destination}. Can you help me plan a trip?`);
  };

  const handleMobileChatStart = () => {
    if (!hasStartedChat) {
      sendMessage("Keila, can you help me plan a trip?");
    }
  };

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

  // Mobile View
  if (isMobile) {
    return (
      <>
        <SEOHead title="AI Travel Planner | Utrippin" description="Your personal AI travel assistant, Keila." canonical="https://utrippin.ai/ai-travel" />
        <MobileTravelInterface
          onSearch={handleMobileSearch}
          onCategorySelect={handleMobileCategorySelect}
          onDestinationClick={handleMobileDestinationClick}
          onChatStart={handleMobileChatStart}
          onSendMessage={sendMessage}
          messages={messages}
          isLoading={loading}
        />
      </>
    );
  }

  // Desktop View
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