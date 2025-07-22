import React, { useEffect, useState, useRef } from "react";
import { useTrips } from "@/hooks/useTrips";
import { useDebounce } from "@/hooks/useDebounce";
import { useChatAI } from "@/hooks/useChatAI";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useEnhancedOpenAITrips } from "@/hooks/useEnhancedOpenAITrips";
import { useAITripPlanner } from "@/hooks/useAITripPlanner";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { BudgetSlider } from "@/components/BudgetSlider";
import AITripPlannerDisplay from "@/components/AITripPlannerDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackToTop } from '@/components/BackToTop';
import { Sparkles } from "lucide-react";
import { SkipNavigation } from '@/components/AccessibilityEnhancements';
import keilaLogo from '@/assets/Keila_logo.png';
import { TextAnimate } from "@/components/magicui/text-animate";  
import { BlurFade } from "@/components/magicui/blur-fade";
import { PromptInputArea } from '@/components/custom/prompt-input-area';
import { ChatContainer, Message as MessageType } from '@/components/custom/chat-container';

// Add CSS animations for darkmode styles
const scrollingStyles = `
  /* Darkmode styles for Home component */
  .dark-home-component {
    --background-elevated: rgba(22, 23, 26, 1);
    --foreground: rgba(250, 250, 250, 1);
    --background: rgba(18, 19, 22, 1);
    --layout: rgba(18, 19, 22, 1);
    --card: rgba(43, 46, 53, 0.3);
    --card-hover: rgba(60, 63, 72, 0.3);
    --card-solid: rgba(43, 46, 53, 0.3);
    --card-inner: rgba(12, 12, 16, 0.3);
    --card-foreground: rgba(250, 250, 250, 0.6);
    --primary: rgba(28, 103, 243, 1);
    --primary-soft: rgba(0, 25, 72, 1);
    --primary-foreground: rgba(250, 250, 250, 1);
    --secondary: rgba(43, 46, 53, 0.3);
    --secondary-foreground: rgba(250, 250, 250, 1);
    --muted: rgba(38, 41, 45, 1);
    --muted-foreground: rgba(150, 152, 158, 1);
    --accent: rgba(26, 28, 31, 1);
    --accent-foreground: rgba(250, 250, 250, 1);
    --border: rgba(36, 38, 44, 1);
    --input: rgba(36, 38, 44, 1);
    --input-hover: rgba(44, 47, 54, 1);
    --bubble: rgba(23, 37, 84, 1);
    
    background-color: rgba(18, 19, 22, 1);
    color: rgba(250, 250, 250, 1);
  }

  .dark-home-component * {
    border-color: rgba(36, 38, 44, 1);
  }

  .dark-home-component .bg-card {
    background-color: rgba(43, 46, 53, 0.3);
    backdrop-filter: blur(20px);
  }

  .dark-home-component .text-foreground {
    color: rgba(250, 250, 250, 1);
  }

  .dark-home-component .text-foreground\\/80 {
    color: rgba(250, 250, 250, 0.8);
  }

  .dark-home-component .text-foreground\\/70 {
    color: rgba(250, 250, 250, 0.7);
  }

  .dark-home-component .text-foreground\\/60 {
    color: rgba(250, 250, 250, 0.6);
  }

  .dark-home-component .text-foreground\\/50 {
    color: rgba(250, 250, 250, 0.5);
  }

  .dark-home-component .text-muted-foreground {
    color: rgba(150, 152, 158, 1);
  }

  .dark-home-component .bg-primary {
    background-color: rgba(28, 103, 243, 1);
  }

  .dark-home-component .hover\\:bg-primary\\/90:hover {
    background-color: rgba(28, 103, 243, 0.9);
  }

  .dark-home-component .bg-primary\\/10 {
    background-color: rgba(28, 103, 243, 0.1);
  }

  .dark-home-component .border-primary\\/20 {
    border-color: rgba(28, 103, 243, 0.2);
  }

  .dark-home-component .bg-secondary {
    background-color: rgba(43, 46, 53, 0.3);
  }

  .dark-home-component .hover\\:bg-card-foreground\\/10:hover {
    background-color: rgba(250, 250, 250, 0.1);
  }

  .dark-home-component .border-input {
    border-color: rgba(36, 38, 44, 1);
  }

  .dark-home-component .hover\\:bg-primary\\/10:hover {
    background-color: rgba(28, 103, 243, 0.1);
  }

  .dark-home-component .text-neutral-500 {
    color: rgba(150, 152, 158, 1);
  }

  .dark-home-component .placeholder\\:text-muted-foreground\\/70::placeholder {
    color: rgba(150, 152, 158, 0.7);
  }

  .dark-home-component .shadow-2 {
    box-shadow: 0 1px 2px rgba(11, 12, 14, 0.02);
  }

  /* Input area darkmode styles */
  .dark-home-component .bg-card.border-primary\\/20 {
    background-color: rgba(43, 46, 53, 0.3);
    border-color: rgba(28, 103, 243, 0.2);
  }

  .dark-home-component .focus-visible\\:outline-none:focus-visible {
    outline: none;
  }

  .dark-home-component .focus-visible\\:ring-0:focus-visible {
    box-shadow: none;
  }

  /* Suggestion chips darkmode styles */
  .dark-home-component .border-input {
    border-color: rgba(36, 38, 44, 1);
  }

  .dark-home-component .hover\\:bg-primary\\/10:hover {
    background-color: rgba(28, 103, 243, 0.15);
  }

  /* Button darkmode styles */
  .dark-home-component .hover\\:bg-secondary\\/50:hover {
    background-color: rgba(43, 46, 53, 0.15);
  }

  /* Animate bounce for loading dots */
  .dark-home-component .animate-bounce {
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  /* Form inputs in modals */
  .dark-home-component input,
  .dark-home-component select {
    background-color: rgba(36, 38, 44, 1);
    border-color: rgba(60, 63, 72, 1);
    color: rgba(250, 250, 250, 1);
  }

  .dark-home-component input::placeholder {
    color: rgba(150, 152, 158, 0.7);
  }

  .dark-home-component input:focus,
  .dark-home-component select:focus {
    border-color: rgba(28, 103, 243, 0.5);
    outline: none;
    box-shadow: 0 0 0 3px rgba(28, 103, 243, 0.1);
  }
`;

interface Trip {
  name: string;
  summary: string;
  detailedDescription?: string;
  highlights?: string[];
  imageUrl?: string;
  budget?: number;
  flights_url?: string;
  hotels_url?: string;
  cars_url?: string;
  details?: string;
  destination?: string;
  description?: string;
}

interface AISuggestion {
  name?: string;
  destination?: string;
  description?: string;
}

interface AIResponse {
  response?: string;
  suggestions?: (AISuggestion | string)[];
  trips?: Trip[];
}

export default function AiTravel() {
  const [budget, setBudget] = useState(3000);
  const [tripType, setTripType] = useState<'staycation' | 'vacation'>('staycation');
  const [groupSize, setGroupSize] = useState(1);
  const [zipCode, setZipCode] = useState('');
  const debouncedBudget = useDebounce(budget, 1000);
  const { trips } = useTrips({ budget: debouncedBudget });
  const { sendMessage } = useChatAI(trips);
  const { generateTrips } = useEnhancedOpenAITrips();
  const { messages: tripPlannerMessages, sendMessage: sendTripPlannerMessage } = useAITripPlanner();
  const [aiTrips, setAiTrips] = useState<Trip[]>([]);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [isGeneratingTrips, setIsGeneratingTrips] = useState(false);
  const { preferences } = usePersonalization();
  
  // New chat functionality for desktop
  const [desktopMessages, setDesktopMessages] = useState<MessageType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addDesktopMessage = (message: MessageType) => {
    setDesktopMessages((prevMessages) => [...prevMessages, message]);
  };

  const allThemes = [
    "city breaks", "weekend spa retreats", "nearby attractions",
    "3-day getaways", "food & wine tours", "cultural festivals",
    "hiking adventures", "beach escapes", "winter wonderlands",
    "family vacations", "solo adventures", "romantic trips"
  ];

  const [dailyThemes, setDailyThemes] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...allThemes].sort(() => 0.5 - Math.random());
    setDailyThemes(shuffled.slice(0, 6));
  }, []);

  // Desktop chat submit handler with AI integration
  const handleDesktopSubmit = async (message: string, files: File[]) => {
    if (message.trim() || files.length > 0) {
      const userMessage: MessageType = {
        id: desktopMessages.length + 1,
        role: 'user',
        content: message.trim(),
        files: files,
      };
      
      addDesktopMessage(userMessage);
      
      // Add loading message
      const loadingMessage: MessageType = {
        id: desktopMessages.length + 2,
        role: 'assistant',
        content: (
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-muted-foreground">Planning your perfect trip...</span>
          </div>
        ),
      };
      addDesktopMessage(loadingMessage);

      try {
        // Call AI trip planner API
        const { data, error: apiError } = await supabase.functions.invoke<AIResponse>('ai-trip-planner', {
            body: {
            message: message.trim(),
            conversationHistory: desktopMessages
              .filter(msg => msg.role === 'user' || msg.role === 'assistant')
              .map(msg => ({
                role: msg.role,
                content: typeof msg.content === 'string' ? msg.content : message.trim()
              })),
            budget: budget,
            groupSize: groupSize,
            zipCode: zipCode,
            tripType: tripType,
            preferences: preferences,
            isMobileChat: true
          }
        });

        // Remove loading message
        setDesktopMessages(prev => prev.slice(0, prev.length - 1));

          if (apiError) {
            throw new Error(apiError.message);
          }

        let aiResponseContent = (
          <div className="flex flex-col gap-2">
            <h3 className='text-foreground/80 text-lg font-semibold'>
              Great question! Let me help you plan an amazing trip.
            </h3>
            <p className='text-foreground/60'>
              Based on your request, I'll create a personalized itinerary that matches your preferences and budget.
            </p>
          </div>
        );
          
          if (data?.response) {
          // Check if response is JSON format (for mobile chat) or HTML format (for full trip planning)
          let parsedResponse = null;
          try {
            parsedResponse = JSON.parse(data.response);
          } catch (e) {
            // Not JSON, treat as HTML/text response
          }

          if (parsedResponse && parsedResponse.title && parsedResponse.content) {
            // Handle JSON format response
            aiResponseContent = (
              <div className="flex flex-col gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-foreground text-xl font-bold">
                    {parsedResponse.title}
                  </h3>
                  {parsedResponse.subtitle && (
                    <p className="text-foreground/70 text-sm">
                      {parsedResponse.subtitle}
                    </p>
                  )}
                </div>
                
                {/* Content */}
                <div 
                  className="prose prose-sm max-w-none text-foreground/90"
                  dangerouslySetInnerHTML={{
                    __html: parsedResponse.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                      .replace(/\n\n/g, '</p><p class="text-foreground/80">')
                      .replace(/\n/g, '<br>')
                      .replace(/^/, '<p class="text-foreground/80">')
                      .replace(/$/, '</p>')
                  }}
                />

                {/* Utrippin Link */}
                {parsedResponse.utrippin_link && (
                  <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <a 
                      href={parsedResponse.utrippin_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      🌟 Explore more at Utrippin.ai
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Suggestions */}
                {data.suggestions && data.suggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-card/50 rounded-xl border border-border/50">
                    <h4 className="text-foreground/80 font-medium mb-2">Suggested Destinations:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {data.suggestions.slice(0, 4).map((suggestion: AISuggestion | string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleDesktopSubmit(`Tell me more about ${typeof suggestion === 'string' ? suggestion : (suggestion.name || suggestion.destination || 'this destination')}`, [])}
                          className="text-left p-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                        >
                          <span className="text-foreground/90 text-sm">
                            {typeof suggestion === 'string' ? suggestion : (suggestion.name || suggestion.destination || 'Destination')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          } else {
            // Handle HTML/text format response (existing behavior)
            aiResponseContent = (
              <div className="flex flex-col gap-3">
                <div 
                  className="prose prose-sm max-w-none text-foreground/90"
                  dangerouslySetInnerHTML={{
                    __html: data.response
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                      .replace(/\n\n/g, '</p><p class="text-foreground/80">')
                      .replace(/\n/g, '<br>')
                      .replace(/^/, '<p class="text-foreground/80">')
                      .replace(/$/, '</p>')
                  }}
                />
                {data.suggestions && data.suggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-card/50 rounded-xl border border-border/50">
                    <h4 className="text-foreground/80 font-medium mb-2">Suggested Destinations:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {data.suggestions.slice(0, 4).map((suggestion: AISuggestion | string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleDesktopSubmit(`Tell me more about ${typeof suggestion === 'string' ? suggestion : (suggestion.name || suggestion.destination || 'this destination')}`, [])}
                          className="text-left p-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                        >
                          <span className="text-foreground/90 text-sm">
                            {typeof suggestion === 'string' ? suggestion : (suggestion.name || suggestion.destination || 'Destination')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        } else if (data?.trips && data.trips.length > 0) {
          // Handle trip recommendations
          aiResponseContent = (
            <div className="flex flex-col gap-3">
              <h3 className='text-foreground/80 text-lg font-semibold'>
                Here are some amazing trip suggestions for you!
              </h3>
              <div className="grid gap-3">
                {data.trips.slice(0, 3).map((trip: Trip, index: number) => (
                  <div key={index} className="p-4 bg-card/50 rounded-xl border border-border/50">
                    <h4 className="text-foreground font-medium mb-2">{trip.name || trip.destination}</h4>
                    <p className="text-foreground/70 text-sm mb-2">{trip.description || trip.summary}</p>
                    {trip.budget && (
                      <span className="text-primary font-medium text-sm">
                        Budget: ${trip.budget.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        const aiResponse: MessageType = {
          id: desktopMessages.length + 2,
          role: 'assistant',
          content: aiResponseContent,
        };
        
        addDesktopMessage(aiResponse);

        // Also trigger the existing trip generation for additional suggestions
        try {
          const result = await generateTrips(message.trim(), budget);
          if (result && result.length > 0) {
            setAiTrips(result.slice(0, 6));
          }
        } catch (tripError) {
          console.log('Additional trip generation failed:', tripError);
        }

      } catch (error) {
        console.error('Error calling AI API:', error);
        
        // Remove loading message
        setDesktopMessages(prev => prev.slice(0, prev.length - 1));
        
        // Add error message
        const errorResponse: MessageType = {
          id: desktopMessages.length + 2,
          role: 'assistant', 
          content: (
            <div className="flex flex-col gap-2">
              <h3 className='text-foreground/80 text-lg font-semibold'>
                I'm having trouble connecting right now
              </h3>
              <p className='text-foreground/60'>
                Please try again in a moment. In the meantime, I can help you plan a trip if you provide more details about your destination, dates, and preferences.
              </p>
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-foreground/70 text-sm">
                  <strong>Tip:</strong> Try asking something like "Plan a 5-day trip to Paris for 2 people with a $3000 budget"
                </p>
              </div>
            </div>
          ),
        };
        addDesktopMessage(errorResponse);
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    setIsGeneratingTrips(true);
    
    try {
      // Use the generateTrips hook to create trip suggestions
      const result = await generateTrips(message, budget);
      setAiTrips(result.slice(0, 6));
    } catch (error) {
      console.error('Trip generation failed:', error);
      setAiTrips([]); // Clear any existing trips
    } finally {
      setIsGeneratingTrips(false);
    }
  };

  return (
    <>
      <style>{scrollingStyles}</style>
      <SkipNavigation />
      <SEOHead 
        title="AI Travel Planner - Smart Trip Planning | Utrippin.ai"
        description="Plan perfect trips with AI. Get personalized itineraries, find flights and hotels, and discover unique destinations tailored to your budget and preferences."
        canonical="https://utrippin.ai/ai-travel"
        keywords="AI travel planner, trip planning, personalized itinerary, smart travel, AI recommendations"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "name": "AI Travel Planner",
              "description": "AI-powered travel planning tool that creates personalized itineraries",
              "applicationCategory": "Travel",
              "operatingSystem": "Web",
              "url": "https://utrippin.ai/ai-travel",
              "provider": {
                "@type": "Organization",
                "name": "Utrippin.ai"
              }
            },
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/ai-travel#webpage",
              "url": "https://utrippin.ai/ai-travel",
              "name": "AI Travel Planner - Smart Trip Planning | Utrippin.ai",
              "description": "Plan perfect trips with AI. Get personalized itineraries, find flights and hotels, and discover unique destinations tailored to your budget and preferences.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      
      {/* Trip Planner Display Modal - Only show when explicitly requested */}
      {showTripPlanner && tripPlannerMessages.length > 0 && (
        <AITripPlannerDisplay
          messages={tripPlannerMessages}
          onClose={() => setShowTripPlanner(false)}
        />
      )}

      <Header />
      {/* Responsive view for all devices */}
      <div className="flex flex-col min-h-screen bg-background dark-home-component">
        
        <main className="flex-1 flex min-h-[calc(100vh-190px)] md:min-h-[calc(100vh-115px)]">
              
          {/* Main Content - Responsive */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-7 pb-16 md:pb-24 lg:pb-4 px-2 md:px-0">
            {desktopMessages?.length <= 0 && (
              <>
                <BlurFade delay={0.25} inView>
                  <div className="w-[70px] -mb-6">
                     <img 
                       src={keilaLogo} 
                       alt="Keila" 
                      className="w-full h-auto object-contain"
                     />
                   </div>
                </BlurFade>
                <div className="flex flex-col w-full items-center gap-2 pt-4 pb-7 text-center">
                  <TextAnimate animation="blurInUp" delay={0.5} by="character" once as="h1" className='leading-8 font-normal text-2xl text-foreground'>
                    Ready to explore the world?
                  </TextAnimate>

                  <TextAnimate animation="blurIn" delay={0.8} as="p" className='leading-6 text-lg text-muted-foreground'>
                    Let's plan your dream trip! ✨
                  </TextAnimate>
                       </div>
              </>
            )}

            {desktopMessages?.length > 0 && (
              <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto flex justify-center"
              >
                <div className="max-w-[752px] w-full px-4">
                  <ChatContainer messages={desktopMessages} containerRef={containerRef} />
                       </div>
                     </div>
                   )}

            <PromptInputArea
              onSubmit={handleDesktopSubmit}
              showSuggestions={desktopMessages?.length <= 0}
              className="max-w-[752px] w-full px-2"
            />
            </div>
        </main>

        {/* Budget Trip Planning Section - Hidden on Mobile */}
        <div className="hidden md:block bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-t border-border/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Sparkles className="h-4 w-4" />
                Trip Planner
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                Plan Your Perfect Adventure
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Customize your journey with our intelligent trip planner. Set your preferences and discover amazing destinations.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Trip Type Toggle */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  🎯 Trip Type
                </h3>
                <div className="bg-slate-100/80 p-2 rounded-xl max-w-md mx-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTripType('staycation')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                        tripType === 'staycation'
                          ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                          : 'text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      🏠 Staycation
                    </button>
                    <button
                      onClick={() => setTripType('vacation')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                        tripType === 'vacation'
                          ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                          : 'text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      ✈️ Vacation
                    </button>
                  </div>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  💰 Budget Range
                </h3>
                <BudgetSlider budget={budget} onBudgetChange={setBudget} min={100} max={1000000} />
                <div className="text-center mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg max-w-md mx-auto">
                  <span className="text-blue-600 font-semibold">
                    Perfect for a ${budget.toLocaleString()} {tripType}
                  </span>
                </div>
              </div>

              {/* Group Size */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  👥 Group Size
                </h3>
                <div className="flex items-center justify-center gap-6 bg-slate-50/80 p-4 rounded-xl max-w-md mx-auto">
                  <button
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                    className="w-12 h-12 bg-white hover:bg-blue-50 text-blue-600 rounded-full font-bold text-xl transition-all hover:shadow-md border border-blue-200"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">{groupSize}</div>
                    <div className="text-sm text-slate-500">{groupSize === 1 ? 'person' : 'people'}</div>
                  </div>
                  <button
                    onClick={() => setGroupSize(groupSize + 1)}
                    className="w-12 h-12 bg-white hover:bg-blue-50 text-blue-600 rounded-full font-bold text-xl transition-all hover:shadow-md border border-blue-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Location Input */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  📍 Location {tripType === 'staycation' ? '(Staycation Area)' : '(Starting Point)'}
                </h3>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter your zip code"
                  className="w-full max-w-md mx-auto block bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Action Button & Quick Suggestions */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <button
                  onClick={() => {
                    const location = zipCode ? `near ${zipCode}` : '';
                    const message = `Plan a ${tripType} for ${groupSize} ${groupSize === 1 ? 'person' : 'people'} with a budget of $${budget} ${location}`;
                    handleSendMessage(message);
                  }}
                  className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-6"
                >
                  <Sparkles className="h-5 w-5" />
                  Create My Trip Plan
                </button>
                
                {/* Quick Suggestions */}
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-3 text-center">Quick Ideas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
                    {dailyThemes.slice(0, 4).map((theme, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(`Plan ${theme} under $${budget}`)}
                        className="bg-gradient-to-r from-slate-100 to-blue-50 hover:from-blue-50 hover:to-indigo-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 transition-all text-center"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Generated Trips Display */}
              {(aiTrips.length > 0 || isGeneratingTrips) && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" /> 
                    AI Generated Trips
                    {isGeneratingTrips && <span className="text-sm text-slate-500 ml-2">Generating...</span>}
                  </h3>
                  {isGeneratingTrips ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white/50 p-4 sm:p-5 rounded-2xl border border-slate-200 animate-pulse">
                          <div className="h-5 bg-slate-300 rounded mb-2"></div>
                          <div className="h-16 bg-slate-300 rounded mb-4"></div>
                          <div className="flex gap-3">
                            <div className="h-8 w-20 bg-slate-300 rounded"></div>
                            <div className="h-8 w-20 bg-slate-300 rounded"></div>
                            <div className="h-8 w-20 bg-slate-300 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {aiTrips.map((trip, i) => (
                        <div key={i} className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors shadow-sm">
                          <h4 className="text-slate-800 font-semibold text-lg mb-2">{trip.name || trip.destination}</h4>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3">{trip.description || trip.summary}</p>
                          {trip.budget && (
                            <p className="text-blue-600 font-medium text-sm mb-3">
                              Budget: ${trip.budget.toLocaleString()}
                            </p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => window.open(`https://utrippin.ai/flights?destination=${encodeURIComponent(trip.name || trip.destination || '')}`, '_blank')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            >
                              ✈️ Flights
                            </button>
                            <button
                              onClick={() => window.open(`https://utrippin.ai/hotels?destination=${encodeURIComponent(trip.name || trip.destination || '')}`, '_blank')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            >
                              🏨 Hotels
                            </button>
                            <button
                              onClick={() => window.open(`https://utrippin.ai/cars?destination=${encodeURIComponent(trip.name || trip.destination || '')}`, '_blank')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            >
                              🚗 Cars
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
                  </div>
                        </div>
        <Footer />
      </div>
      
      <BackToTop />
    </>
  );
}
