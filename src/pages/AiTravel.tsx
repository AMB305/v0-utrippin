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
  console.log('AiTravel component starting to render...');
  
  try {
    const { user, loading: authLoading } = useAuth();
    console.log('useAuth hook succeeded:', { user: !!user, authLoading });
    
    if (authLoading) {
      console.log('Auth still loading...');
      return <div className="flex items-center justify-center h-dvh bg-black text-white">Loading...</div>;
    }

    if (!user) {
      console.log('No user found, showing LoginCard');
      return <LoginCard />;
    }

    console.log('User authenticated, rendering simple debug UI');
    return (
      <div className="flex items-center justify-center h-dvh bg-green-500 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">AI Travel - DEBUG MODE</h1>
          <p>User is authenticated: {user.email}</p>
          <p>Component is rendering successfully!</p>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Error in AiTravel component:', error);
    return (
      <div className="flex items-center justify-center h-dvh bg-red-500 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ERROR</h1>
          <p>Component failed to render: {error.message}</p>
        </div>
      </div>
    );
  }
};

export default AiTravel;