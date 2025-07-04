import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageCircle, 
  Plane, 
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  TrendingUp, 
  Globe, 
  Camera, 
  Utensils, 
  Shield,
  Zap,
  Brain,
  Target,
  Lightbulb,
  ChevronRight,
  Play,
  Mic,
  Image,
  FileText,
  BarChart3
} from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";

export default function AiTravelAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI Travel Assistant. I can help you plan complex trips, find the best deals, and create personalized itineraries. What kind of adventure are you planning?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeDemo, setActiveDemo] = useState("planning");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response based on input
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let response = "";

    if (input.includes("japan") || input.includes("tokyo") || input.includes("kyoto")) {
      response = "🇯🇵 Japan is an amazing choice! I'd recommend a 10-day itinerary: Tokyo (4 days) for modern culture and food, Kyoto (3 days) for temples and traditional experiences, and Osaka (2 days) for street food. Best time to visit is spring (cherry blossoms) or fall (autumn colors). Budget around $200-300/day including accommodation. Would you like me to find specific flights and hotels?";
    } else if (input.includes("europe") || input.includes("paris") || input.includes("london")) {
      response = "🇪🇺 Europe offers incredible diversity! For a first trip, I suggest the classic route: London (3 days) → Paris (4 days) → Rome (3 days). Use the Eurail pass for easy travel between cities. Budget €150-200/day. Spring and early fall have the best weather and fewer crowds. I can help you find flights, book accommodations, and suggest must-see attractions in each city.";
    } else if (input.includes("budget") || input.includes("cheap") || input.includes("affordable")) {
      response = "💰 I specialize in budget travel! Here are my top money-saving tips: 1) Book flights 6-8 weeks in advance, 2) Use Tuesday-Thursday departures, 3) Consider alternative airports, 4) Mix hostels with budget hotels, 5) Eat like a local at markets. I can find you deals that are 40-60% cheaper than regular prices. What's your destination and budget range?";
    } else if (input.includes("family") || input.includes("kids") || input.includes("children")) {
      response = "👨‍👩‍👧‍👦 Family travel requires special planning! I'll help you find family-friendly accommodations, kid-approved activities, and restaurants with children's menus. Consider destinations like Orlando (theme parks), San Diego (beaches + zoo), or Costa Rica (adventure + wildlife). I can also suggest travel timing to avoid school crowds and find deals on family packages.";
    } else if (input.includes("romantic") || input.includes("honeymoon") || input.includes("anniversary")) {
      response = "💕 Planning something special? I have access to romantic destinations worldwide! Consider Santorini for sunset views, Bali for luxury resorts, or Paris for classic romance. I can arrange couples' spa treatments, private dining experiences, and sunset excursions. What's your preferred style - beach relaxation, city exploration, or mountain retreat?";
    } else {
      response = "I'd love to help you plan the perfect trip! I can assist with finding flights, hotels, activities, and creating detailed itineraries. I have access to real-time pricing, exclusive deals, and local insights. Could you tell me more about your destination preferences, travel dates, and what type of experience you're looking for?";
    }

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
  };

  const quickPrompts = [
    "Plan a 7-day trip to Japan for $3000",
    "Find family-friendly hotels in Orlando",
    "Best time to visit Europe for good weather?",
    "Romantic getaway ideas under $2000",
    "Budget backpacking through Southeast Asia",
    "Luxury safari in Africa recommendations"
  ];

  const aiCapabilities = [
    {
      icon: Brain,
      title: "Smart Trip Planning",
      description: "AI analyzes millions of data points to create personalized itineraries based on your preferences, budget, and travel style.",
      features: ["Custom itineraries", "Budget optimization", "Preference learning", "Real-time updates"]
    },
    {
      icon: Target,
      title: "Deal Discovery",
      description: "Advanced algorithms continuously scan for the best deals, price drops, and exclusive offers across all travel categories.",
      features: ["Price prediction", "Deal alerts", "Exclusive offers", "Bundle savings"]
    },
    {
      icon: Globe,
      title: "Local Insights",
      description: "Access to local knowledge, hidden gems, and authentic experiences that typical travel sites don't offer.",
      features: ["Local recommendations", "Cultural insights", "Hidden gems", "Authentic experiences"]
    },
    {
      icon: Shield,
      title: "Travel Safety",
      description: "Real-time safety monitoring, travel advisories, and health recommendations for worry-free travel.",
      features: ["Safety alerts", "Health updates", "Emergency assistance", "Travel insurance"]
    }
  ];

  const demoScenarios = [
    {
      id: "planning",
      title: "Trip Planning",
      description: "Watch AI create a complete 10-day Europe itinerary",
      icon: MapPin,
      steps: [
        "Analyze travel preferences and budget",
        "Research destinations and activities", 
        "Optimize route and timing",
        "Book flights, hotels, and experiences",
        "Create day-by-day itinerary"
      ]
    },
    {
      id: "deals",
      title: "Deal Finding",
      description: "See how AI finds the best travel deals",
      icon: TrendingUp,
      steps: [
        "Scan 1000+ travel sites simultaneously",
        "Compare prices across dates and airlines",
        "Identify price drop patterns",
        "Apply exclusive discounts and coupons",
        "Present best options with savings"
      ]
    },
    {
      id: "support",
      title: "24/7 Support",
      description: "Get instant help during your travels",
      icon: MessageCircle,
      steps: [
        "Real-time flight delay notifications",
        "Alternative route suggestions",
        "Local emergency contacts",
        "Restaurant and activity recommendations",
        "Language translation assistance"
      ]
    }
  ];

  const stats = [
    { label: "Trips Planned", value: "2.5M+", icon: MapPin },
    { label: "Average Savings", value: "$847", icon: TrendingUp },
    { label: "Response Time", value: "<3 sec", icon: Zap },
    { label: "Satisfaction Rate", value: "98.7%", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="AI Travel Assistant: Smart Trip Planning & Booking | UTrippin" 
        description="Experience the future of travel planning with our AI assistant. Get personalized itineraries, find exclusive deals, and book everything in one conversation." 
      />
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">🤖 AI-Powered Travel Planning!</span>
          <span>Plan complex trips in minutes, not hours. Try our AI assistant now! <span className="underline">Get Started</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0068EF] via-[#0055A5] to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Meet Your AI Travel Assistant
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                Plan complex trips in minutes, find exclusive deals, and get personalized recommendations with the power of artificial intelligence.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5 mr-2" />
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Button 
                size="lg" 
                className="bg-white text-[#0068EF] hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-bold"
                onClick={() => document.getElementById('ai-chat').scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Planning Now
              </Button>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003C8A] mb-4">
                What Makes Our AI Special?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI doesn't just search for flights and hotels. It understands your preferences, learns from your choices, and creates truly personalized travel experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aiCapabilities.map((capability, idx) => (
                <Card key={idx} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <capability.icon className="h-8 w-8 text-[#0068EF]" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#003C8A]">{capability.title}</h3>
                    <p className="text-gray-600 mb-4">{capability.description}</p>
                    <div className="space-y-2">
                      {capability.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-[#0068EF] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003C8A] mb-4">
                See AI in Action
              </h2>
              <p className="text-xl text-gray-600">
                Watch how our AI handles different travel scenarios
              </p>
            </div>
            
            <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
                {demoScenarios.map((scenario) => (
                  <TabsTrigger 
                    key={scenario.id} 
                    value={scenario.id}
                    className="flex items-center gap-2 data-[state=active]:bg-[#0068EF] data-[state=active]:text-white"
                  >
                    <scenario.icon className="h-4 w-4" />
                    {scenario.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {demoScenarios.map((scenario) => (
                <TabsContent key={scenario.id} value={scenario.id}>
                  <Card className="max-w-4xl mx-auto border-2 border-[#0068EF]/20">
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <scenario.icon className="h-8 w-8 text-[#0068EF]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#003C8A] mb-2">{scenario.title}</h3>
                        <p className="text-gray-600">{scenario.description}</p>
                      </div>
                      
                      <div className="space-y-4">
                        {scenario.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-[#0068EF] text-white rounded-full flex items-center justify-center mr-4 font-bold">
                              {idx + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mt-8">
                        <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                          <Play className="mr-2 h-4 w-4" />
                          Watch Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div id="ai-chat" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003C8A] mb-4">
                Try the AI Assistant
              </h2>
              <p className="text-xl text-gray-600">
                Start a conversation and see how AI can help plan your next trip
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-[#0068EF]/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <Bot className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">AI Travel Assistant</CardTitle>
                        <p className="text-blue-100 text-sm">Online • Ready to help</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                          {message.type === 'ai' && (
                            <div className="w-8 h-8 bg-[#0068EF] rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              message.type === 'user'
                                ? 'bg-[#0068EF] text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {message.type === 'user' && (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">You</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-[#0068EF] rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Prompts */}
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-600 mb-3">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputMessage(prompt)}
                          className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors text-[#0068EF] hover:border-[#0068EF]"
                          disabled={isTyping}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-6 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Ask me about travel plans, destinations, or deals..."
                          className="pr-20 border-2 border-gray-300 focus:border-[#0068EF]"
                          disabled={isTyping}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mic className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Image className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-[#0068EF] hover:bg-[#0055A5] px-4 py-2"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003C8A] mb-4">
                Everything You Need in One AI
              </h2>
              <p className="text-xl text-gray-600">
                From planning to booking to support - our AI handles it all
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Instant Itineraries",
                  description: "Get detailed day-by-day plans with activities, restaurants, and transportation."
                },
                {
                  icon: BarChart3,
                  title: "Price Optimization",
                  description: "AI finds the best combination of flights, hotels, and activities for your budget."
                },
                {
                  icon: Globe,
                  title: "Multi-Destination Planning",
                  description: "Plan complex trips across multiple countries with optimized routing."
                },
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description: "AI considers weather, crowds, and local events for perfect timing."
                },
                {
                  icon: Users,
                  title: "Group Coordination",
                  description: "Manage group preferences and split costs automatically."
                },
                {
                  icon: Shield,
                  title: "Travel Protection",
                  description: "Real-time alerts for delays, cancellations, and safety updates."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[#0068EF]" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-[#003C8A]">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience AI-Powered Travel?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join millions of travelers who've discovered the future of trip planning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#0068EF] hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => document.getElementById('ai-chat').scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Planning Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#0068EF] text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}