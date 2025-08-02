// src/components/DesktopTravelPlanner.tsx

import React, { useState } from 'react';
import ChatContainer from './custom/ChatContainer';
import { useAuth } from '@/hooks/useAuth';
import { CategoryFilter } from './CategoryFilter';
import { TopFilterBar } from './TopFilterBar';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { AnimatedKeila } from './AnimatedKeila';
import { SimpleChatInput } from './SimpleChatInput';
import { ReligionTravelCards } from './ReligionTravelCards';

const DesktopTravelPlanner = ({ onQuestionSelect, hasStartedChat, onClearChat, chatMessages, isLoading, onSendMessage }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category !== 'All' && category !== 'Religious') {
      // Generate category-specific travel question for categories other than Religious
      const categoryQuestions = {
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

  const handleCreateTripWithAI = () => {
    onQuestionSelect("Help me plan my next adventure!");
  };

  const handleCreateComprehensiveTrip = () => {
    onSendMessage("Create a comprehensive travel itinerary for me", true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Top Filter Bar */}
      <div className="bg-white p-4">
        <TopFilterBar onCreateTripWithAI={handleCreateTripWithAI} />
        
        {/* Category Tabs */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {hasStartedChat ? (
          <div className="bg-white rounded-lg shadow-sm h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Chat with Keila</h2>
              <Button onClick={onClearChat} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
            <ChatContainer
              messages={chatMessages}
              isLoading={isLoading}
              onSendMessage={onSendMessage}
            />
          </div>
        ) : selectedCategory === 'Religious' ? (
          <div className="bg-yellow-300 border-8 border-red-500 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">🚨 TEST: Religious & Spiritual Destinations 🚨</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Vatican City", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop" },
                { title: "Mecca", imageUrl: "https://images.unsplash.com/photo-1564769662080-ec2544481688?w=400&h=300&fit=crop" },
                { title: "Jerusalem", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop" },
              ].map((card, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64 border-4 border-green-500"
                  onClick={() => {
                    console.log('🚨 DESKTOP PLANNER CARD CLICKED:', card.title);
                    alert(`🚨 SUCCESS FROM DESKTOP PLANNER: ${card.title}`);
                  }}
                >
                  <div className="absolute inset-0">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                      {card.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            {/* Keila Greeting Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto text-center">
              <AnimatedKeila />
              <h1 className="text-3xl font-bold mt-4 text-gray-900">Hi, I'm Keila!</h1>
              <p className="text-gray-600 mt-2 mb-8">Select a category above to start planning your trip, or ask me anything!</p>
              
              {/* Chat Input */}
              <SimpleChatInput
                onSendMessage={onSendMessage}
                placeholder="Ask me to plan your next adventure..."
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopTravelPlanner;
