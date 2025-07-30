// src/pages/AiTravel.tsx

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatAI } from "@/hooks/useChatAI";
import { useIsMobile } from "@/hooks/use-mobile";
import { SEOHead } from "@/components/SEOHead";
import DesktopTravelPlanner from "@/components/DesktopTravelPlanner";
import LoginCard from "@/components/LoginCard";
import { MobileTravelInterface } from "@/components/mobile/MobileTravelInterface";

const AiTravel = () => {
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const { messages, sendMessage, resetSession, loading } = useChatAI();
  const hasStartedChat = messages.length > 0;

  console.log('[AiTravel Page] Rendering. State:', {
    isAuthLoading: authLoading,
    isUser: !!user,
    isMobile,
    isChatLoading: loading,
    hasStartedChat,
    messagePairsCount: messages.length,
    messagesArray: messages 
  });

  useEffect(() => {
    if (user) {
      // console.log('User detected, you can reset session here if needed.');
    }
  }, [user]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

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
      sendMessage("Hi Keila! I'd like to plan a trip. Can you help me?");
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading Authentication...</div>;
  }

  if (!user) {
    return <LoginCard />;
  }

  if (isMobile) {
    return (
      <>
        <SEOHead title="AI Travel Planner | Utrippin" description="Your personal AI travel assistant, Keila." canonical="https://utrippin.ai/ai-travel" />
        <MobileTravelInterface
          onSearch={handleMobileSearch}
          onCategorySelect={handleMobileCategorySelect}
          onDestinationClick={handleMobileDestinationClick}
          onChatStart={handleMobileChatStart}
        />
      </>
    );
  }

  console.log('[AiTravel Page] Passing props to DesktopTravelPlanner:', {
    hasStartedChat,
    chatMessages: messages,
    isLoading: loading,
  });

  return (
    <>
      <SEOHead title="AI Travel Planner | Utrippin" description="Your personal AI travel assistant, Keila." canonical="https://utrippin.ai/ai-travel" />
      <DesktopTravelPlanner
        hasStartedChat={hasStartedChat}
        onClearChat={resetSession}
        chatMessages={messages} // This is the array of {id, question, response, ...} objects
        isLoading={loading} // This is the global loading state
        onSendMessage={handleSendMessage}
      />
    </>
  );
};

export default AiTravel;