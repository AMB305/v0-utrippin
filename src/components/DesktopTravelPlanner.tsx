// src/components/DesktopTravelPlanner.tsx

import React, { useState } from 'react';
import ChatContainer from './custom/ChatContainer';
import { useAuth } from '@/hooks/useAuth';
import { CategoryFilter } from './CategoryFilter';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { AnimatedKeila } from './AnimatedKeila';

const DesktopTravelPlanner = ({ onQuestionSelect, hasStartedChat, onClearChat, chatMessages, isLoading, onSendMessage }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      // Generate category-specific travel question
      const categoryQuestions = {
        Religious: "I'm interested in religious and spiritual travel experiences",
        Cultural: "I want to explore cultural attractions and experiences",
        Nature: "I'm looking for nature-based travel destinations",
        Food: "I want to discover amazing food experiences while traveling",
        Festivals: "I'm interested in festivals and cultural events",
        Historical: "I want to explore historical sites and landmarks",
        Shopping: "I'm looking for great shopping destinations",
        Beaches: "I want to find beautiful beach destinations",
        Mountains: "I'm interested in mountain destinations and activities",
        Outdoors: "I want outdoor adventure travel experiences",
        Nightlife: "I'm looking for destinations with great nightlife",
        Luxury: "I want luxury travel experiences and accommodations",
        Wellness: "I'm interested in wellness and spa travel",
        Romance: "I'm planning a romantic getaway",
        NightSkies: "I want to see amazing night skies and stargazing",
        Sports: "I'm interested in sports-related travel",
        Offbeat: "I want unique and offbeat travel experiences"
      };
      
      const question = categoryQuestions[category];
      if (question) {
        onQuestionSelect(question);
      }
    }
  };

  return (
    <div className="hidden lg:flex flex-col h-screen bg-white">
      {/* Top Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      {/* Header with New Chat Button */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Travel Planner</h1>
          <p className="text-gray-600">Welcome, {user?.email || 'Traveler'}. Let Keila help you plan your trip.</p>
        </div>
        <Button onClick={onClearChat} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white">
        {hasStartedChat ? (
          <ChatContainer
            messages={chatMessages}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <AnimatedKeila />
            <h1 className="text-3xl font-bold mt-4 text-gray-900">Hi, I'm Keila!</h1>
            <p className="text-gray-500 mt-2">Select a category above to start planning your trip, or ask me anything!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopTravelPlanner;