import React, { useEffect, useState, useMemo } from "react";
import { useTrips } from "@/hooks/useTrips";
import { useDebounce } from "@/hooks/useDebounce";
import { useChatAI } from "@/hooks/useChatAI";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useEnhancedOpenAITrips } from "@/hooks/useEnhancedOpenAITrips";
import { useAITripPlanner } from "@/hooks/useAITripPlanner";
import { SEOHead } from "@/components/SEOHead";
import { BudgetSlider } from "@/components/BudgetSlider";
import { ChatInput } from "@/components/ChatInput";
import { TripSuggestion } from "@/components/TripSuggestion";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import AITripPlannerDisplay from "@/components/AITripPlannerDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackToTop } from '@/components/BackToTop';
import { SmartImage } from "@/components/SmartImage";
import { Sparkles } from "lucide-react";
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ResponsiveDesignFixes';
import { AccessibleButton, SkipNavigation } from '@/components/AccessibilityEnhancements';
import { FormField, FormValidation, validationRules } from '@/components/EnhancedFormValidation';

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
}

export default function AiTravel() {
  const [budget, setBudget] = useState(3000);
  const [tripType, setTripType] = useState<'staycation' | 'vacation'>('staycation');
  const [groupSize, setGroupSize] = useState(1);
  const [zipCode, setZipCode] = useState('');
  const debouncedBudget = useDebounce(budget, 1000);
  const { trips } = useTrips({ budget: debouncedBudget });
  const { messages, sendMessage } = useChatAI(trips);
  const { generateTrips } = useEnhancedOpenAITrips();
  const { messages: tripPlannerMessages, sendMessage: sendTripPlannerMessage } = useAITripPlanner();
  const [aiTrips, setAiTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const { preferences } = usePersonalization();

  const allThemes = [
    "city breaks", "weekend spa retreats", "nearby attractions",
    "3-day getaways", "food & wine tours", "cultural festivals",
    "hiking adventures", "beach escapes", "winter wonderlands",
    "family vacations", "solo adventures", "romantic trips"
  ];

  const [dailyThemes, setDailyThemes] = useState<string[]>([]);
  const [isGeneratingTrips, setIsGeneratingTrips] = useState(false);

  useEffect(() => {
    const shuffled = [...allThemes].sort(() => 0.5 - Math.random());
    setDailyThemes(shuffled.slice(0, 6));
  }, []);

  const curatedTrips = useMemo(() => {
    return trips.length > 0 ? trips.slice(0, 6) : [];
  }, [trips]);

  const handleSendMessage = async (message: string) => {
    setIsGeneratingTrips(true);
    sendMessage(message);
    
    // Send to trip planner but don't auto-show the modal
    await sendTripPlannerMessage(message);
    
    try {
      const result = await generateTrips(message, budget);
      setAiTrips(result.slice(0, 6));
      setSelectedTrip(null);
    } finally {
      setIsGeneratingTrips(false);
    }
  };

  // Only show trip planner when user explicitly requests it
  // Don't auto-show on message load

  return (
    <>
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
      
      {/* Trip Planner Display Modal */}
      {showTripPlanner && (
        <AITripPlannerDisplay
          messages={tripPlannerMessages}
          onClose={() => setShowTripPlanner(false)}
        />
      )}
      
      {/* Mobile sidebar overlay */}
      <div className="lg:hidden fixed left-0 top-0 w-[280px] h-screen z-50 transform -translate-x-full transition-transform duration-300">
        <ConversationSidebar
          conversations={preferences.savedConversations || []}
          onNewConversation={() => {
            setAiTrips([]);
            setSelectedTrip(null);
            setShowTripPlanner(false);
          }}
        />
      </div>

      {/* Desktop sidebar - always visible on large screens */}
      <div className="hidden lg:block fixed left-0 top-0 w-[300px] h-screen bg-slate-900 border-r border-slate-700 z-40">
        <ConversationSidebar
          conversations={preferences.savedConversations || []}
          onNewConversation={() => {
            setAiTrips([]);
            setSelectedTrip(null);
            setShowTripPlanner(false);
          }}
        />
      </div>

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white">
        <Header />
        
        <main className="flex-1 lg:ml-[300px]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-32">
            {/* AI Chat Section */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Tell AI Your Dream Vacation
              </h1>
              <p className="text-slate-300 mb-6">
                Describe your perfect trip and let AI plan every detail for you
              </p>
              
              {/* Chat Input */}
              <div className="bg-slate-800/50 rounded-2xl border border-slate-600/30 p-6 mb-8">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder="Tell me about your dream vacation... (e.g., 'I want a romantic weekend getaway in Europe for under $3000')"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-slate-600"></div>
              <span className="px-4 text-slate-400 text-sm">OR PLAN WITH FORM</span>
              <div className="flex-1 border-t border-slate-600"></div>
            </div>

            {/* Form Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Plan Your Perfect
              </h2>
              <div className="inline-block bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-6 py-2 rounded-full text-xl sm:text-2xl font-bold mb-6">
                Staycation or Vacation
              </div>
              <p className="text-slate-300 text-lg">
                Set your budget and group size to discover amazing destinations
              </p>
            </div>

            {/* Trip Type Toggle */}
            <div className="mb-8 flex justify-center">
              <div className="bg-slate-800/50 p-2 rounded-2xl border border-slate-600/30">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTripType('staycation')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      tripType === 'staycation'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    🏠 Staycation
                  </button>
                  <button
                    onClick={() => setTripType('vacation')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      tripType === 'vacation'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    ✈️ Vacation
                  </button>
                </div>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4">Budget Range</label>
              <BudgetSlider budget={budget} onBudgetChange={setBudget} min={100} max={1000000} />
              <div className="text-center mt-2">
                <span className="text-orange-400 text-lg font-semibold">
                  Perfect for a nice {tripType} day
                </span>
              </div>
            </div>

            {/* Group Size */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4 flex items-center gap-2">
                👥 Group Size
              </label>
              <div className="flex items-center justify-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-600/30">
                <button
                  onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xl transition-colors"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                  {groupSize}
                </span>
                <button
                  onClick={() => setGroupSize(groupSize + 1)}
                  className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Zip Code Input */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4">
                Enter Zip Code {tripType === 'staycation' ? '(for staycations)' : ''}
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter Zip Code"
                className="w-full bg-slate-800/50 border border-slate-600/30 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Find My Trips Button */}
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  const location = zipCode ? `near ${zipCode}` : '';
                  const message = `Plan a ${tripType} for ${groupSize} ${groupSize === 1 ? 'person' : 'people'} with a budget of $${budget} ${location}`;
                  handleSendMessage(message);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 mx-auto transition-all transform hover:scale-105 shadow-lg"
              >
                📍 Find My Trips
              </button>
            </div>

            {/* Suggested Themes */}
            <div className="mt-8">
              <h3 className="flex items-center gap-2 text-orange-400 mb-4 text-sm justify-center">
                <Sparkles className="h-4 w-4" /> Or explore these ideas
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 justify-center">
                {dailyThemes.slice(0, 4).map((theme, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(`Plan ${theme} under $${budget}`)}
                    className="bg-slate-700/50 hover:bg-slate-600/60 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-slate-500/20 transition-all whitespace-nowrap flex-shrink-0"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {selectedTrip ? (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                  {/* Close button - always visible */}
                  <button 
                    onClick={() => setSelectedTrip(null)} 
                    className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-3xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    ×
                  </button>
                  
                  {/* Hero Image */}
                  <div className="relative h-48 md:h-64 overflow-hidden rounded-t-3xl">
                    <SmartImage
                      destination={selectedTrip.name}
                      description={selectedTrip.summary || selectedTrip.detailedDescription}
                      className="w-full h-full object-cover"
                      alt={selectedTrip.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white pr-12">{selectedTrip.name}</h2>
                    <p className="text-blue-400 text-lg mb-4">{selectedTrip.summary}</p>
                    
                    {/* Detailed Description */}
                    {selectedTrip.detailedDescription && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Experience</h3>
                        <div className="text-slate-300 leading-relaxed text-sm">
                          {selectedTrip.detailedDescription}
                        </div>
                      </div>
                    )}
                    
                    {/* Highlights */}
                    {selectedTrip.highlights && selectedTrip.highlights.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Trip Highlights</h3>
                        <div className="space-y-2">
                          {selectedTrip.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                              <span className="text-blue-400 mt-1">✦</span>
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                     {/* Booking Buttons */}
                     <ResponsiveGrid cols="1 sm:3" className="pt-4 border-t border-slate-700">
                        <AccessibleButton
                          onClick={() => window.open(`https://www.expedia.com/Flights?CAMREF=1101l5dQSW&destination=${encodeURIComponent(selectedTrip.name)}`, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors text-center"
                          ariaLabel={`Book flight to ${selectedTrip.name}`}
                        >
                          ✈️ Book Flight
                        </AccessibleButton>
                        <AccessibleButton
                          onClick={() => window.open(`https://www.expedia.com/Hotels?CAMREF=1101l5dQSW&destination=${encodeURIComponent(selectedTrip.name)}`, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors text-center"
                          ariaLabel={`Book hotel in ${selectedTrip.name}`}
                        >
                          🏨 Book Hotel
                        </AccessibleButton>
                        <AccessibleButton
                          onClick={() => window.open(`https://www.expedia.com/Cars?CAMREF=1101l5dQSW&destination=${encodeURIComponent(selectedTrip.name)}`, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors text-center"
                          ariaLabel={`Book car rental in ${selectedTrip.name}`}
                        >
                          🚗 Book Car
                        </AccessibleButton>
                     </ResponsiveGrid>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {(aiTrips.length > 0 || isGeneratingTrips) && (
                  <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                      <Sparkles className="w-4 h-4 text-blue-400" /> 
                      AI Generated Trips
                      {isGeneratingTrips && <span className="text-sm text-slate-400 ml-2">Generating...</span>}
                    </h2>
                    {isGeneratingTrips ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-700 animate-pulse">
                            <div className="h-5 bg-slate-700 rounded mb-2"></div>
                            <div className="h-16 bg-slate-700 rounded mb-4"></div>
                            <div className="flex gap-3">
                              <div className="h-8 w-20 bg-slate-700 rounded"></div>
                              <div className="h-8 w-20 bg-slate-700 rounded"></div>
                              <div className="h-8 w-20 bg-slate-700 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {aiTrips.map((trip, i) => (
                          <TripSuggestion key={i} trip={trip} camref="1101l5dQSW" onSelect={() => setSelectedTrip(trip)} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {aiTrips.length === 0 && curatedTrips.length > 0 && (
                  <div className="mt-8 sm:mt-10">
                    <h2 className="text-lg font-semibold mb-4 text-white">Curated Trips for Your Budget</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {curatedTrips.map((trip, i) => (
                        <TripSuggestion key={i} trip={trip} camref="1101l5dQSW" onSelect={() => setSelectedTrip(trip)} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Chat input */}
          <div className="fixed bottom-0 left-0 lg:left-[300px] right-0 bg-gradient-to-t from-slate-900 to-transparent p-4 sm:p-6 z-20">
            <div className="max-w-2xl mx-auto">
              <ChatInput
                onSendMessage={handleSendMessage}
                placeholder="Type something like 'Plan me a weekend getaway...'"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
      
      <BackToTop />
    </>
  );
}
