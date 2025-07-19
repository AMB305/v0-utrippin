
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import Typewriter from "typewriter-effect";
import { useAITripPlanner } from "@/hooks/useAITripPlanner";
import TripPlanCards from "./TripPlanCards";
import "../styles/trip-planner.css";

const AITripPlanner = () => {
  const { messages, sendMessage, isLoading, clearConversation } = useAITripPlanner();
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const tripPlanningExamples = [
    "Plan me a trip to Mexico in November for 3 people",
    "Plan a solo trip to Italy on a $2000 budget for 7 days",
    "Find me a 5-day adventure trip to Costa Rica under $3000",
    "Plan a romantic weekend getaway to Paris for under $1500",
    "Plan a family trip to Tokyo for 4 people in spring",
    "Plan a business trip to London with cultural activities",
    "Plan a beach vacation to Thailand for 2 weeks"
  ];

  const handleGenerate = () => {
    const messageToSend = inputValue.trim() || tripPlanningExamples[Math.floor(Math.random() * tripPlanningExamples.length)];
    sendMessage(messageToSend);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleCloseTripPlan = () => {
    clearConversation();
  };

  const assistantMessages = messages.filter(msg => msg.role === 'assistant');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-travel-navy via-travel-blue-dark to-primary overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-overlay opacity-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Describe your perfect trip and get a comprehensive plan!
            </h2>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Get detailed itineraries with attractions, restaurants, hotels, and booking links tailored just for you.
            </p>
          </div>

          {/* AI Input Interface */}
          <div className="bg-background/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-large border border-white/10 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center bg-background/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 gap-3 sm:gap-4">
              {/* AI Icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-travel-blue rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>

              {/* Input Field with Typewriter Overlay */}
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-transparent border-none text-sm sm:text-base md:text-lg p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                
                {/* Typewriter overlay - only show when input is empty and not focused */}
                {!inputValue && !isInputFocused && (
                  <div className="absolute inset-0 pointer-events-none text-muted-foreground text-sm sm:text-base md:text-lg">
                    <Typewriter
                      options={{
                        strings: tripPlanningExamples,
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                <Button 
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`w-full sm:w-auto bg-gradient-to-r from-primary to-travel-blue hover:from-primary-hover hover:to-travel-blue-dark text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                    isLoading 
                      ? 'animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)] ring-2 ring-primary/30 ring-offset-2 ring-offset-background' 
                      : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <span className="ml-1">Planning...</span>
                    </span>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-12">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-white">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="font-medium">Generating your comprehensive travel plan...</span>
                </div>
              </div>
            </div>
          )}

          {/* Instruction text below the generate box */}
          {!isLoading && messages.length === 0 && (
            <p className="text-white/70 text-sm sm:text-base mt-3 sm:mt-4">
              Try: "Plan me a trip to Mexico in November for 3 people"
            </p>
          )}

          {/* Additional Info */}
          {messages.length === 0 && (
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                Powered by advanced AI • Comprehensive itineraries • Real-time booking links
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-travel-gold rounded-full"></div>
                  Detailed Attractions
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-travel-gold rounded-full"></div>
                  Restaurant Recommendations
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-travel-gold rounded-full"></div>
                  Expedia Booking Links
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Trip Plan Results - Display with TripPlanCards component */}
        {assistantMessages.length > 0 && !isLoading && (
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-travel-gold" />
                Your Custom Trip Plan
              </h3>
              <p className="text-white/80 mb-4">Professional itinerary with booking links and detailed recommendations</p>
              
              {/* Close Button moved under subtitle */}
              <Button
                onClick={handleCloseTripPlan}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-6 py-3 border border-white/20 hover:border-white/40 transition-all duration-200"
              >
                Close out the Trip Planner
              </Button>
            </div>
            
            <div className="p-4 sm:p-6">
              {assistantMessages.map((message, index) => (
                <TripPlanCards 
                  key={index}
                  htmlContent={message.content}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AITripPlanner;
