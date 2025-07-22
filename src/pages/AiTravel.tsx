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
  ExternalLink
} from "lucide-react";
import { TripCard } from "@/components/TripCard";
import { MapComponent } from "@/components/MapComponent";
import { SEOHead } from "@/components/SEOHead";
import TextAnimate from "@/components/TextAnimate";
import BlurFade from "@/components/magicui/blur-fade";
import { MobileQuickQuestions } from "@/components/MobileQuickQuestions";

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
  name: string;
  summary: string;
  start_date: string;
  end_date: string;
  enhanced_flights_url: string;
  enhanced_hotels_url: string;
  event_name: string;
  event_date: string;
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
  } = useChatAI(trips || []);

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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white">
        {isMobile ? (
          <div className="flex flex-col h-screen">
            {!hasStartedChat ? (
              // Welcome Screen
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
                  <BlurFade delay={0.25} inView>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                  </BlurFade>
                  <div className="flex flex-col w-full items-center gap-2 pt-2 pb-7 text-center">
                    <TextAnimate animation="blurInUp" delay={0.5} by="character" once as="h1" className='leading-8 font-normal text-2xl text-foreground'>
                      Hey I'm Keila, Your Ultimate Adventure Planner
                    </TextAnimate>

                    <TextAnimate animation="blurIn" delay={0.8} as="p" className='leading-6 text-lg text-muted-foreground'>
                      Ask me anything about your next trip!
                    </TextAnimate>
                  </div>

                  {/* Mobile Quick Questions */}
                  <BlurFade delay={1.0} inView>
                    <MobileQuickQuestions onQuestionSelect={handleMobileSubmit} />
                  </BlurFade>
                </div>

                {/* Mobile Input Area */}
                <div className="p-4 bg-slate-900/50 backdrop-blur border-t border-slate-700/50">
                  <div className="flex gap-2">
                    <Input
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me about your travel plans..."
                      className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
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
              <div className="flex flex-col h-screen">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="absolute top-4 left-4 md:hidden">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-sm">
                    <SheetHeader className="text-left">
                      <SheetTitle>Settings</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium leading-none">Trip Preferences</p>
                        <p className="text-sm text-muted-foreground">
                          Customize your trip settings to get the most relevant recommendations.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
                      </div>
                      <Separator />
                      <div>
                        <Button variant="outline" className="w-full">
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="px-4 py-2 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">
                      {trips && trips.length > 0 ? trips[0].name : "Philippines Adventure"}
                    </h1>
                  </div>
                  <Button variant="secondary" size="sm">
                    Save Trip
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {mobileChatMessages.map((message) => (
                    <div key={message.id} className="px-4 py-3">
                      <div className="flex flex-col">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-2/3">
                            <p className="text-sm leading-relaxed">{message.question}</p>
                          </div>
                        </div>

                        {/* AI Response */}
                        {message.response && (
                          <div className="flex justify-start mt-2">
                            <div className="bg-slate-800/60 backdrop-blur-sm text-white px-4 py-2 rounded-2xl max-w-2/3 border border-slate-700/50">
                              {message.loading ? (
                                <p>Loading...</p>
                              ) : (
                                <p className="text-sm leading-relaxed text-slate-200">{message.response}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-900/50 backdrop-blur border-t border-slate-700/50">
                  <div className="flex gap-2">
                    <Input
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
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
          <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">AI Travel Planner</h1>

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
                  <h2 className="text-2xl font-semibold">Plan Your Next Adventure</h2>
                  <p className="text-md text-slate-400">
                    Get personalized travel recommendations and itineraries powered by AI.
                  </p>
                </div>

                <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-white">
                  <Card className="bg-transparent border-0 shadow-none">
                    <div className="p-4">
                      <Textarea
                        placeholder="Tell me where you want to go..."
                        className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
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
                  <h2 className="text-2xl font-semibold">Your Saved Trips</h2>
                  <p className="text-md text-slate-400">
                    View and manage your saved travel itineraries.
                  </p>
                </div>

                {tripsLoading ? (
                  <p>Loading trips...</p>
                ) : trips && trips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                ) : (
                  <p>No trips saved yet.</p>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Settings</h2>
                  <p className="text-md text-slate-400">
                    Customize your travel preferences and account settings.
                  </p>
                </div>

                <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-white">
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
