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
import { MapComponent } from "@/components/MapComponent";
import { SEOHead } from "@/components/SEOHead";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MobileQuickQuestions } from "@/components/MobileQuickQuestions";
import { KeilaThinking } from "@/components/KeilaThinking";
import { ChatCTAButtons } from "@/components/ChatCTAButtons";
import { SaveTripDialog } from "@/components/SaveTripDialog";
import UtrippinLogo from "@/components/UtrippinLogo";
import Header from "@/components/Header";

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
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showSaveTripDialog, setShowSaveTripDialog] = useState(false);
  const [lastChatResponse, setLastChatResponse] = useState<any>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  const handleMobileSubmit = (message: string) => {
    if (message.trim()) {
      setHasStartedChat(true);
      sendMobileChatMessage(message);
      setMobileInput("");
    }
  };

  // Handler for new chat sessions from welcome screen
  const handleNewChatFromWelcome = (question: string) => {
    if (question.trim()) {
      // Clear existing chat history before starting new session
      clearMobileChat();
      // Start new chat session
      setHasStartedChat(true);
      sendMobileChatMessage(question);
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

  const handleSaveTrip = () => {
    if (!lastChatResponse) {
      toast({
        title: "No trip to save",
        description: "Please have a conversation with Keila first to save a trip.",
        variant: "destructive",
      });
      return;
    }
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
      
      {isMobile ? (
        // Mobile Layout - Keep existing mobile design
        <div className="min-h-screen bg-black text-white">
          <div className="flex flex-col h-screen bg-black">
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
              <div className="flex flex-col h-screen bg-black">
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
                          <div className="flex justify-start">
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
        // Desktop Layout - With Header and Original Design
        <>
          <Header activeTab="ai" />
          <div className="min-h-screen bg-black text-white">
            {/* Top Section - Keila Bot Interface */}
            <div className="flex flex-col items-center justify-center min-h-screen px-6">
              {/* Keila Bot */}
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                  alt="Keila Bot" 
                  className="w-20 h-20 mx-auto animate-float hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Main Text */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Ready to explore the world?
                </h1>
                <p className="text-xl text-gray-300">
                  Let's plan your dream trip! ✨
                </p>
              </div>

              {/* Chat Input */}
              <div className="w-full max-w-2xl mb-8">
                <div className="relative">
                  <Input
                    placeholder="Ask me anything about your trip..."
                    className="w-full bg-gray-900 border-gray-700 text-white placeholder-gray-400 px-6 py-4 text-lg rounded-2xl pr-16"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                  🗓️ Create a new trip
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                  📍 Get inspired
                </Button>
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                  ✨ Inspire me where to go
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
                  🚶 Solo trip
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white">
                  💑 Partner
                </Button>
                <Button variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white">
                  👨‍👩‍👧‍👦 Family
                </Button>
              </div>
            </div>

            {/* Bottom Section - Trip Planner */}
            <div className="bg-white text-gray-900 py-16">
              <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                  <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    🧳 Trip Planner
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Plan Your Perfect Adventure
                  </h2>
                  <p className="text-xl text-gray-600">
                    Customize your journey with our intelligent trip planner. Set your preferences and discover amazing destinations.
                  </p>
                </div>

                {/* Trip Type Selection */}
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    🎯 Trip Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                      🏝️ Staycation
                    </Button>
                    <Button variant="outline" className="h-20 text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                      ✈️ Vacation
                    </Button>
                  </div>
                </div>

                {/* Budget Range */}
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    💰 Budget Range
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">$3k</div>
                      <div className="text-gray-600">Budget Range</div>
                    </div>
                    <div className="relative mb-6">
                      <input
                        type="range"
                        min="100"
                        max="100000"
                        defaultValue="3000"
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>$100</span>
                      <span>$1.0M</span>
                    </div>
                    <div className="text-center text-blue-600 font-medium">
                      Perfect for a $3,000 staycation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
