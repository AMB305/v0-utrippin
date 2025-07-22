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
import UtrippinLogo from "@/components/UtrippinLogo";

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

  return (
    <>
      <SEOHead
        title="AI Travel Planner | Utrippin"
        description="Get personalized travel recommendations and itineraries powered by AI. Plan your perfect trip with intelligent suggestions for destinations, activities, and more."
        canonical="https://utrippin.ai/ai-travel"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        {isMobile ? (
          <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
            {!hasStartedChat ? (
              // Welcome Screen - TripGenie Style
              <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
                {/* Header with Logo and Greeting */}
                <div className="px-6 pt-12 pb-4">
                  <BlurFade delay={0.1} inView>
                    <div className="flex flex-col items-center mb-6">
                      <UtrippinLogo />
                      <div className="mt-4 text-center flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <TextAnimate animation="blurInUp" delay={0.3} by="character" once as="h2" className='text-xl font-semibold text-white mb-0'>
                          I'm Keila! Your Ultimate Adventure Planner
                        </TextAnimate>
                      </div>
                    </div>
                  </BlurFade>
                  
                  {/* Hi there! in upper left corner */}
                  <BlurFade delay={0.5} inView>
                    <div className="text-left">
                      <h1 className="text-2xl font-bold text-white mb-2">Hi there!</h1>
                      <p className="text-gray-300 text-base">Ask me anything about your next trip!</p>
                    </div>
                  </BlurFade>
                </div>

                {/* Mobile Quick Questions */}
                <div className="flex-1 px-2">
                  <BlurFade delay={0.7} inView>
                    <MobileQuickQuestions onQuestionSelect={handleMobileSubmit} />
                  </BlurFade>
                </div>

                {/* Mobile Input Area with Live Translate */}
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Languages className="h-3 w-3" />
                      Live Translate
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me about your travel plans..."
                      className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
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
            ) : (
              // Chat Interface
              <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setHasStartedChat(false)}>
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold text-white">
                      Travel Planning
                    </h1>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Save Trip
                  </Button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-800/30">
                  {mobileChatMessages.map((message) => (
                    <div key={message.id} className="px-4 py-3">
                      <div className="flex flex-col space-y-3">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-[80%]">
                            <p className="text-sm leading-relaxed">{message.question}</p>
                          </div>
                        </div>

                        {/* AI Response */}
                        {message.response && (
                          <div className="flex justify-start">
                            <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl max-w-[80%] border border-gray-600">
                              {message.loading ? (
                                <p>Loading...</p>
                              ) : (
                                <p className="text-sm leading-relaxed">{message.response}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input with Live Translate */}
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Languages className="h-3 w-3" />
                      Live Translate
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
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
        ) : (
          // Desktop Layout
          <div className="max-w-5xl mx-auto px-6 py-12 bg-white">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">AI Travel Planner</h1>

            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="justify-center mb-8">
                <TabsTrigger value="chat">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="trips">
                  <Map className="mr-2 h-4 w-4" />
                  Trips
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Plan Your Next Adventure</h2>
                  <p className="text-md text-gray-600">
                    Get personalized travel recommendations and itineraries powered by AI.
                  </p>
                </div>

                <Card className="bg-white border border-gray-200 text-gray-900">
                  <Card className="bg-transparent border-0 shadow-none">
                    <div className="p-4">
                      <Textarea
                        placeholder="Tell me where you want to go..."
                        className="w-full bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Send
                          <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Card>
              </TabsContent>

              <TabsContent value="trips" className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Your Saved Trips</h2>
                  <p className="text-md text-gray-600">
                    View and manage your saved travel itineraries.
                  </p>
                </div>

                {tripsLoading ? (
                  <p>Loading trips...</p>
                ) : trips && trips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                      <Card key={trip.id} className="bg-white border border-gray-200 text-gray-900 p-4">
                        <h3 className="text-lg font-semibold mb-2">{trip.title}</h3>
                        <p className="text-gray-600 mb-2">{trip.destination}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{trip.start_date} - {trip.end_date}</span>
                          <span>${trip.budget}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No trips saved yet.</p>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
                  <p className="text-md text-gray-600">
                    Customize your travel preferences and account settings.
                  </p>
                </div>

                <Card className="bg-white border border-gray-200 text-gray-900">
                  <div className="p-4">
                    <p>Settings content here...</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
};

export default AiTravel;
