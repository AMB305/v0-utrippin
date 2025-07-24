import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useChatAI } from "@/hooks/useChatAI";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { RecommendationsPanel } from "@/components/recommendations/RecommendationsPanel";
import { 
  Send, 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Plane, 
  Hotel, 
  Camera,
  Map,
  MessageCircle,
  Settings,
  Menu,
  ArrowLeft,
  Star,
  Clock,
  ExternalLink,
  Languages
} from "lucide-react";
import { TripSummaryCard } from "@/components/TripSummaryCard";
import { SEOHead } from "@/components/SEOHead";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MobileQuickQuestions } from "@/components/MobileQuickQuestions";
import { KeilaThinking } from "@/components/KeilaThinking";
import { ChatCTAButtons } from "@/components/ChatCTAButtons";
import { SaveTripDialog } from "@/components/SaveTripDialog";
import { AuthRequiredDialog } from "@/components/AuthRequiredDialog";
import UtrippinLogo from "@/components/UtrippinLogo";
import Header from "@/components/Header";
import HereLocationAutocomplete from "@/components/HereLocationAutocomplete";
import { EnhancedMapComponent } from "@/components/EnhancedMapComponent";
import { DetailedItineraryCard } from "@/components/DetailedItineraryCard";

interface ChatMessage {
  id: string;
  question: string;
  response?: string;
  loading?: boolean;
  showMap?: boolean;
  mapLocation?: string;
  tripCards?: Array<{
    type: 'hotel' | 'flight' | 'activity';
    title: string;
    description: string;
    price?: string;
    rating?: number;
    duration?: string;
    bookingUrl?: string;
  }>;
  quickReplies?: string[];
  recommendations?: {
    flights: string;
    hotels: string;
  };
  trips?: Array<{
    id: string;
    name: string;
    summary: string;
    enhanced_flights_url: string;
    enhanced_hotels_url: string;
    reason: string;
  }>;
  callsToAction?: Array<{
    text: string;
    action: string;
  }>;
  isDetailedItinerary?: boolean;
  detailedItinerary?: {
    title: string;
    summary: string;
    recommendations: Array<{
      category_name: string;
      places: Array<{
        name: string;
        description: string;
        type: string;
        image_url?: string;
        location?: string;
        rating?: number;
        price_range?: string;
      }>;
    }>;
    actionable_suggestions: string[];
    follow_up_questions: string[];
  };
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  user_id: string;
}

const AiTravel = () => {
  const [mobileInput, setMobileInput] = useState("");
  const [desktopInput, setDesktopInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showSaveTripDialog, setShowSaveTripDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [lastChatResponse, setLastChatResponse] = useState<any>(null);
  const [tripType, setTripType] = useState("staycation");
  const [budget, setBudget] = useState(3000);
  const isMobile = useIsMobile();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { toast } = useToast();
  const { 
    trackSearch, 
    trackDestinationView, 
    trackTripSave, 
    trackClick 
  } = useBehaviorTracking();

  const { data: trips, isLoading: tripsLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trips").select("*");
      if (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error fetching trips",
          description: "Failed to load your trips. Please try again.",
          variant: "destructive",
        });
        return [];
      }
      return data as Trip[];
    },
  });

  const {
    messages: mobileChatMessages,
    sendMessage: sendMobileChatMessage,
    clearChat: clearMobileChat,
    loading: mobileChatLoading,
  } = useChatAI([]);

  // Enhanced message sending for desktop with budget information
  const sendEnhancedMessage = (message: string, includeBudget: boolean = true) => {
    console.log('=== sendEnhancedMessage START ===');
    console.log('AiTravel: sendEnhancedMessage called with message:', message);
    console.log('AiTravel: includeBudget:', includeBudget);
    console.log('AiTravel: isDesktop:', isDesktop);
    console.log('AiTravel: budget:', budget);
    console.log('AiTravel: tripType:', tripType);
    console.log('AiTravel: sendMobileChatMessage function exists:', !!sendMobileChatMessage);
    
    let enhancedMessage = message;
    
    if (includeBudget && isDesktop) {
      // For desktop, always include budget context in the message to trigger detailed itinerary
      const budgetText = budget >= 1000 ? `$${(budget/1000).toFixed(0)}k` : `$${budget}`;
      const tripTypeText = tripType === "staycation" ? "staycation" : "vacation";
      
      // Enhance the message to include budget context and ensure itinerary generation
      enhancedMessage = `${message}. This is for a ${tripTypeText} with a total budget of approximately ${budgetText}. Please provide a complete day-by-day itinerary with detailed recommendations that fit within this budget.`;
      console.log('AiTravel: Enhanced message:', enhancedMessage);
    } else {
      console.log('AiTravel: Using original message (no enhancement)');
    }
    
    // Send the message (enhanced or original)
    console.log('AiTravel: About to call sendMobileChatMessage with:', enhancedMessage);
    sendMobileChatMessage(enhancedMessage);
    console.log('AiTravel: sendMobileChatMessage completed');
    console.log('=== sendEnhancedMessage END ===');
  };

  const handleMobileSubmit = (message: string) => {
    if (message.trim()) {
      trackSearch(message);
      setHasStartedChat(true);
      sendEnhancedMessage(message, false); // Mobile doesn't need budget enhancement
      setMobileInput("");
    }
  };

  const handleDesktopSubmit = (message: string) => {
    if (message.trim()) {
      // For desktop, always start a chat session with budget-aware enhanced messaging
      trackSearch(message);
      setHasStartedChat(true);
      sendEnhancedMessage(message, true); // Desktop gets budget enhancement
      setMobileInput("");
    }
  };

  // Handler for new chat sessions from welcome screen and suggested prompts
  const handleNewChatFromWelcome = (question: string) => {
    if (question.trim()) {
      // Clear existing chat history before starting new session
      clearMobileChat();
      // Start new chat session with appropriate enhancement
      setHasStartedChat(true);
      sendEnhancedMessage(question, isDesktop);
    }
  };

  // Update last chat response when messages change
  React.useEffect(() => {
    if (mobileChatMessages.length > 0) {
      const lastMessage = mobileChatMessages[mobileChatMessages.length - 1];
      if (lastMessage.response && !lastMessage.loading) {
        setLastChatResponse({
          response: lastMessage.response,
          tripCards: lastMessage.tripCards,
          recommendations: lastMessage.recommendations,
          mapLocation: lastMessage.mapLocation,
          quickReplies: lastMessage.quickReplies,
          callsToAction: lastMessage.callsToAction
        });
      }
    }
  }, [mobileChatMessages]);

  const handleSaveTrip = async () => {
    if (!lastChatResponse) {
      toast({
        title: "No trip to save",
        description: "Please have a conversation with Keila first to save a trip.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthDialog(true);
    } else {
      setShowSaveTripDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    // After successful authentication, show the save trip dialog
    setShowSaveTripDialog(true);
  };

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Show loading state in chat
      setHasStartedChat(true);
      
      // Create a loading message for image recognition
      const loadingMessage = "🔍 Identifying landmark...";
      sendMobileChatMessage(loadingMessage);

      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Call the recognize-image edge function
      const { data, error } = await supabase.functions.invoke('recognize-image', {
        body: formData,
      });

      if (error) {
        console.error('Error recognizing image:', error);
        toast({
          title: "Image recognition failed",
          description: "Unable to identify the landmark. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.success && data.response) {
        // Send the AI response as a new message
        sendMobileChatMessage(`📸 Live Guide: ${data.response}`);
      } else {
        toast({
          title: "No landmark detected",
          description: "I couldn't identify any landmarks in this image. Try taking a clearer photo of a notable location.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: "Something went wrong while analyzing your photo. Please try again.",
        variant: "destructive",
      });
    }

    // Clear the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <>
      <SEOHead
        title="AI Travel Planner | Utrippin"
        description="Get personalized travel recommendations and itineraries powered by AI. Plan your perfect trip with intelligent suggestions for destinations, activities, and more."
        canonical="https://utrippin.ai/ai-travel"
      />
      
      {!isDesktop ? (
        // Mobile Layout - Keep existing mobile design
        <div className="min-h-dvh bg-black text-white">
          <div className="flex flex-col h-dvh bg-black">
            {!hasStartedChat ? (
              // Welcome Screen - Clean with hamburger menu
              <div className="flex-1 flex flex-col bg-black">
                {/* Hamburger Menu - Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-white hover:bg-gray-800"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-black border-gray-800 text-white">
                      <SheetHeader>
                        <SheetTitle className="text-white">Navigation</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4 pt-4">
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/"}>
                          🏠 Home
                        </Button>
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/flights"}>
                          ✈️ Flights
                        </Button>
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/hotels"}>
                          🏨 Hotels
                        </Button>
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/cars"}>
                          🚗 Cars
                        </Button>
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/experiences"}>
                          ✨ Experiences
                        </Button>
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/deals"}>
                          🏷️ Deals
                        </Button>
                        
                        {/* Separator */}
                        <div className="border-t border-gray-700 my-2"></div>
                        
                        {/* Authentication Options */}
                        <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/auth"}>
                          👤 Log In
                        </Button>
                        <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.location.href = "/auth"}>
                          ⭐ Join Utrippin
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Main Content - Bot and Text centered and moved up */}
                <div className="flex-1 flex flex-col items-center justify-start pt-16 px-6">
                  <BlurFade delay={0.1} inView>
                    <div className="flex items-center gap-1 mb-6 justify-start w-full -ml-4 flex-nowrap">
                      {/* Keila Bot with Float Animation */}
                      <img 
                        src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                        alt="Keila Bot" 
                        className="w-14 h-14 animate-float hover:scale-110 transition-transform duration-300 flex-shrink-0"
                      />
                      
                      {/* Greeting Text - Properly centered */}
                      <TextAnimate animation="blurInUp" delay={0.3} by="character" once as="h1" className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight whitespace-nowrap">
                        Hi there! I&apos;m Keila
                      </TextAnimate>
                    </div>
                  </BlurFade>

                  {/* Mobile Quick Questions - Moved up significantly */}
                  <div className="px-2 -mt-4 w-full">
                    <BlurFade delay={0.7} inView>
                      <MobileQuickQuestions onQuestionSelect={handleNewChatFromWelcome} />
                    </BlurFade>
                  </div>
                </div>

                {/* Mobile Input Area with Live Translate and Live Guide */}
                <div className="p-4 bg-black border-t border-gray-800">
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs border-gray-800 text-gray-400 hover:bg-gray-900">
                      <Languages className="h-3 w-3" />
                      Live Translate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 text-xs border-gray-800 text-purple-400 hover:bg-gray-900 hover:text-purple-300"
                      onClick={() => document.getElementById('camera-input')?.click()}
                    >
                      <Camera className="h-3 w-3" />
                      Live Guide
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me about your travel plans..."
                      className="flex-1 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleMobileSubmit(mobileInput);
                        }
                      }}
                    />
                    {/* Camera Button for Live Guide */}
                    <Button
                      onClick={() => document.getElementById('camera-input')?.click()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={mobileChatLoading}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleMobileSubmit(mobileInput)}
                      disabled={!mobileInput.trim() || mobileChatLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Hidden camera input */}
                  <input
                    id="camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handleImageCapture}
                  />
                </div>
              </div>
            ) : (
              // Chat Interface
              <div className="flex flex-col h-dvh bg-black">
                {/* Chat Header with Keila branding */}
                <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-black flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setHasStartedChat(false)}>
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                        alt="Keila Bot" 
                        className="w-8 h-8"
                      />
                      <h1 className="text-lg font-bold text-white">
                        Let's Go!
                      </h1>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    onClick={handleSaveTrip}
                  >
                    Save Trip
                  </Button>
                </div>

                {/* Chat Messages - with proper flex to ensure input stays visible */}
                <div className="flex-1 overflow-y-auto bg-black pb-2">
                  {mobileChatMessages.map((message) => (
                    <div key={message.id} className="px-4 py-3">
                      <div className="flex flex-col space-y-3">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-600 px-4 py-2 rounded-2xl max-w-[80%]">
                            <p className="text-sm leading-relaxed text-white">{message.question}</p>
                          </div>
                        </div>

                        {/* Loading State */}
                        {message.loading && <KeilaThinking />}

                        {/* AI Response */}
                        {message.response && !message.loading && (
                          <div className="flex justify-start w-full">
                            {message.isDetailedItinerary && message.detailedItinerary ? (
                              /* Rich Detailed Itinerary Card */
                              <DetailedItineraryCard 
                                itinerary={message.detailedItinerary}
                                destination={message.mapLocation}
                                onFollowUpClick={(question) => handleMobileSubmit(question)}
                              />
                            ) : (
                              /* Simple Response */
                              <div className="bg-gray-900 px-4 py-2 rounded-2xl max-w-[80%] border border-gray-800">
                                <p className="text-sm leading-relaxed text-gray-200">{message.response}</p>
                                {/* CTA Buttons */}
                                {message.callsToAction && (
                                  <ChatCTAButtons 
                                    ctas={message.callsToAction} 
                                    onContinueChat={() => {
                                      // Focus the input when "Continue Chat" is clicked
                                      const input = document.querySelector('input[placeholder="Ask me anything..."]') as HTMLInputElement;
                                      input?.focus();
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input with Live Translate and Live Guide - Always visible at bottom */}
                <div className="p-4 bg-black border-t border-gray-800 flex-shrink-0">
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs border-gray-800 text-gray-400 hover:bg-gray-900">
                      <Languages className="h-3 w-3" />
                      Live Translate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 text-xs border-gray-800 text-purple-400 hover:bg-gray-900 hover:text-purple-300"
                      onClick={() => document.getElementById('camera-input')?.click()}
                    >
                      <Camera className="h-3 w-3" />
                      Live Guide
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleMobileSubmit(mobileInput);
                        }
                      }}
                    />
                    {/* Camera Button for Live Guide */}
                    <Button
                      onClick={() => document.getElementById('camera-input')?.click()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={mobileChatLoading}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleMobileSubmit(mobileInput)}
                      disabled={!mobileInput.trim() || mobileChatLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Desktop Layout - AI Command Center (Two Column)
        <div className="min-h-screen bg-slate-900 text-white flex">
          {/* Left Column - Control Panel (40%) */}
          <div className="w-2/5 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                  alt="Keila Bot" 
                  className="w-10 h-10"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    AI Travel Planner
                  </h1>
                  <p className="text-sm text-slate-400">
                    Chat with Keila to plan your perfect trip
                  </p>
                </div>
              </div>
            </div>

            {/* Chat History - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!hasStartedChat ? (
                <div className="text-center py-12">
                  <img 
                    src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                    alt="Keila Bot" 
                    className="w-16 h-16 mx-auto mb-4 animate-float"
                  />
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Hi there! I'm Keila
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Ready to plan your dream trip? Let's get started!
                  </p>
                  
                  {/* Suggested Prompts */}
                  <div className="space-y-2">
                    <p className="text-sm text-slate-500 mb-3">Try asking:</p>
                    {[
                      "Plan a weekend trip to Paris",
                      "Find me a beach vacation under $2000",
                      "Suggest family activities in Tokyo",
                      "Plan a romantic getaway"
                    ].map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="block w-full text-left border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => {
                          setHasStartedChat(true);
                          sendEnhancedMessage(prompt, true); // Desktop gets budget enhancement
                        }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                // Chat Messages
                mobileChatMessages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-blue-600 px-4 py-2 rounded-2xl max-w-[80%]">
                        <p className="text-sm text-white">{message.question}</p>
                      </div>
                    </div>

                    {/* Loading State */}
                    {message.loading && <KeilaThinking />}

                    {/* AI Response */}
                    {message.response && !message.loading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700 px-4 py-2 rounded-2xl max-w-[80%] border border-slate-600">
                          <p className="text-sm text-slate-200">{message.response}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Text Input - Fixed at Bottom */}
            <div className="p-6 border-t border-slate-700">
              <div className="flex gap-2">
                <Input
                  value={mobileInput}
                  onChange={(e) => {
                    console.log('AiTravel: Input onChange - new value:', e.target.value);
                    console.log('AiTravel: Input onChange - previous mobileInput:', mobileInput);
                    setMobileInput(e.target.value);
                  }}
                  placeholder="Ask me about your travel plans..."
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  onKeyPress={(e) => {
                    console.log('AiTravel: onKeyPress - key:', e.key);
                    console.log('AiTravel: onKeyPress - mobileInput value:', mobileInput);
                    console.log('AiTravel: onKeyPress - input element value:', (e.target as HTMLInputElement).value);
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      console.log('AiTravel: Enter pressed, calling sendEnhancedMessage with:', mobileInput);
                      sendEnhancedMessage(mobileInput, true); // Desktop gets budget enhancement
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    console.log('AiTravel: Send button clicked');
                    console.log('AiTravel: mobileInput value:', mobileInput);
                    console.log('AiTravel: mobileInput.trim():', mobileInput.trim());
                    console.log('AiTravel: mobileChatLoading:', mobileChatLoading);
                    console.log('AiTravel: button disabled?', !mobileInput.trim() || mobileChatLoading);
                    sendEnhancedMessage(mobileInput, true); // Desktop gets budget enhancement
                  }}
                  disabled={!mobileInput.trim() || mobileChatLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Canvas (60%) */}
          <div className="flex-1 bg-slate-900 flex flex-col">
            {/* Canvas Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Travel Plan Canvas
                </h2>
                {hasStartedChat && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    onClick={handleSaveTrip}
                  >
                    Save Trip
                  </Button>
                )}
              </div>
            </div>

            {/* Canvas Content */}
            <div className="flex-1 p-6">
              {!hasStartedChat ? (
                // Welcome State
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Map className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Your Travel Canvas Awaits
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Start chatting with Keila on the left, and watch your travel plans come to life here with interactive maps, hotel cards, and detailed itineraries.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        Interactive Maps
                      </Badge>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        Hotel & Flight Cards
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Day-by-Day Itineraries
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                // Dynamic Content Area - Always show detailed itineraries
                <div className="space-y-6">
                  {mobileChatMessages.map((message) => (
                    <div key={`canvas-${message.id}`}>
                      {/* Always render detailed itinerary cards for desktop Canvas */}
                      {message.isDetailedItinerary && message.detailedItinerary ? (
                        <div className="w-full">
                          <DetailedItineraryCard 
                            itinerary={message.detailedItinerary}
                            destination={message.mapLocation}
                            onFollowUpClick={(question) => sendEnhancedMessage(question, true)}
                          />
                        </div>
                      ) : message.response && !message.loading ? (
                        // Fallback for non-itinerary responses - still show structured content
                        <div className="space-y-4">
                          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Travel Recommendations</h3>
                            <p className="text-slate-300 mb-4">{message.response}</p>
                            
                            {/* Show any trip cards */}
                            {message.tripCards && message.tripCards.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {message.tripCards.map((card, idx) => (
                                  <Card key={idx} className="bg-slate-700 border-slate-600">
                                    <div className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        {card.type === 'hotel' && <Hotel className="w-4 h-4 text-blue-400" />}
                                        {card.type === 'flight' && <Plane className="w-4 h-4 text-green-400" />}
                                        {card.type === 'activity' && <Star className="w-4 h-4 text-yellow-400" />}
                                        <h4 className="font-semibold text-white">{card.title}</h4>
                                      </div>
                                      <p className="text-sm text-slate-300 mb-3">{card.description}</p>
                                      <div className="flex items-center justify-between">
                                        {card.price && (
                                          <span className="text-lg font-bold text-green-400">{card.price}</span>
                                        )}
                                        {card.rating && (
                                          <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-slate-300">{card.rating}</span>
                                          </div>
                                        )}
                                      </div>
                                       {card.bookingUrl ? (
                                         <a 
                                           href={card.bookingUrl} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="block w-full mt-3"
                                         >
                                           <Button 
                                             size="sm" 
                                             className="w-full bg-blue-600 hover:bg-blue-700 pointer-events-none"
                                           >
                                             Book on Utrippin
                                             <ExternalLink className="w-3 h-3 ml-1" />
                                           </Button>
                                         </a>
                                       ) : (
                                         <Button 
                                           size="sm" 
                                           className="w-full mt-3 bg-gray-600 cursor-not-allowed"
                                           disabled
                                         >
                                           Book on Utrippin
                                           <ExternalLink className="w-3 h-3 ml-1" />
                                         </Button>
                                       )}
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}
                            
                            {/* Follow-up questions */}
                            {message.quickReplies && message.quickReplies.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold text-white mb-2">Continue Planning:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {message.quickReplies.map((reply, idx) => (
                                    <Button
                                      key={idx}
                                      variant="outline"
                                      size="sm"
                                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                                      onClick={() => sendEnhancedMessage(reply, true)}
                                    >
                                      {reply}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* Map Display */}
                      {message.showMap && message.mapLocation && (
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Explore {message.mapLocation}
                          </h3>
                          <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-slate-400">Interactive map for {message.mapLocation}</p>
                              <p className="text-xs text-slate-500 mt-1">Map integration coming soon</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Required Dialog */}
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
        title="Save Your Trip"
        description="Create an account or sign in to save your trip plans and access them anytime, anywhere."
      />

      {/* Save Trip Dialog */}
      <SaveTripDialog
        open={showSaveTripDialog}
        onOpenChange={setShowSaveTripDialog}
        tripData={lastChatResponse}
        destination={lastChatResponse?.mapLocation}
      />
    </>
  );
};

export default AiTravel;
