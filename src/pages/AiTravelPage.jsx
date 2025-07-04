import React, { useState } from 'react';
import { generateTravelItinerary } from '../services/openai';
import ItineraryDisplay from '../components/ai/ItineraryDisplay';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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

export default function AiTravelPage() {
  const [chatMessages, setChatMessages] = useState([
    { from: 'ai', text: "Hi there! I'm your personal AI travel buddy. Where would you like to go?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState(null);

  const sendMessage = async () => {
    if (!userInput) return;
    const newMessages = [...chatMessages, { from: 'user', text: userInput }];
    setChatMessages(newMessages);
    const currentInput = userInput;
    setUserInput('');
    setIsTyping(true);

    try {
      // Call OpenAI service
      const response = await generateTravelItinerary(currentInput);
      
      setChatMessages(prev => [...prev, { from: 'ai', text: response.text }]);
      
      // If we got an itinerary, display it
      if (response.type === 'itinerary') {
        setCurrentItinerary(response.data);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setChatMessages(prev => [...prev, { 
        from: 'ai', 
        text: "I'm having trouble connecting right now. Please try again in a moment!" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };


  const quickPrompts = [
    "Plan a 7-day trip to Japan for $3000",
    "Find family-friendly hotels in Orlando", 
    "Best time to visit Europe?",
    "Romantic getaway ideas under $2000",
    "Budget backpacking Southeast Asia"
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Trip Planning",
      description: "AI analyzes millions of data points to create personalized itineraries based on your preferences and budget.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Deal Discovery",
      description: "Advanced algorithms scan for the best deals, price drops, and exclusive offers across all travel categories.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Globe,
      title: "Local Insights",
      description: "Access local knowledge, hidden gems, and authentic experiences that typical travel sites don't offer.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Travel Safety",
      description: "Real-time safety monitoring, travel advisories, and health recommendations for worry-free travel.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <SEOHead 
        title="AI Travel Assistant: Smart Trip Planning | UTrippin" 
        description="Plan your perfect trip with AI. Get custom itineraries, book flights, reserve dinners & find travel buddies with our intelligent travel assistant."
      />
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">🤖 AI-Powered Travel Planning!</span>
          <span>Plan complex trips in minutes with our AI assistant. <span className="underline">Try Now</span></span>
        </div>
      </div>

      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 text-center">
        <div className="max-w-6xl mx-auto px-4">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Plan Your Perfect Trip with UTrippin AI ✈️</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Get custom itineraries, book flights, reserve dinners & find travel buddies with our intelligent assistant.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              Instant Planning
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Best Deals
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
              <Users className="h-4 w-4 mr-2" />
              2M+ Trips Planned
            </Badge>
          </div>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-bold"
            onClick={() => document.getElementById('ai-chat').scrollIntoView({ behavior: 'smooth' })}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Planning Now
          </Button>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#003C8A]">🧠 AI-Powered Travel Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, idx) => (
              <Card key={idx} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all duration-300 hover:shadow-lg overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chat */}
      <section id="ai-chat" className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-xl rounded-2xl border-2 border-[#0068EF]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#0068EF] rounded-full flex items-center justify-center mr-4">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#003C8A]">🧭 Ask your AI travel buddy</h2>
              <p className="text-sm text-gray-600">Online • Ready to help plan your trip</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            AI Active
          </Badge>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.from === 'ai' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                <div className="flex items-center mb-1">
                  {msg.from === 'ai' ? (
                    <Bot className="h-4 w-4 mr-2" />
                  ) : (
                    <Users className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-semibold text-xs">
                    {msg.from === 'ai' ? 'AI Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-blue-100 text-blue-800 border border-blue-200 px-4 py-3 rounded-lg max-w-xs">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-xs mr-2">AI Assistant</span>
                </div>
                <div className="flex space-x-1 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Prompts */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">💡 Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setUserInput(prompt)}
                className="text-xs bg-blue-50 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors text-[#0068EF]"
                disabled={isTyping}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input 
              type="text"
              className="w-full border-2 border-gray-300 rounded-xl p-3 pr-20 focus:border-[#0068EF] focus:outline-none"
              placeholder="Ask anything about travel..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mic className="h-4 w-4 text-gray-400" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Image className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={sendMessage} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            disabled={isTyping || !userInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Itinerary */}
      {currentItinerary && (
        <section className="max-w-5xl mx-auto mt-12 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#003C8A]">🗓️ Your AI-generated Itinerary</h2>
            <Badge className="bg-green-100 text-green-800">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Optimized
            </Badge>
          </div>
          <ItineraryDisplay itinerary={currentItinerary} />
        </section>
      )}

      {/* Map & Recommendations */}
      <section className="max-w-5xl mx-auto mt-12 p-4">
        <h2 className="text-2xl font-bold mb-6 text-[#003C8A] flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          📍 AI-Recommended places nearby
        </h2>
        <Card className="bg-white shadow-lg border-2 border-gray-200">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 h-64 rounded-lg flex items-center justify-center text-gray-600 relative overflow-hidden">
              {/* Map placeholder with interactive elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-green-200/50"></div>
              <div className="relative z-10 text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-[#0068EF]" />
                <p className="text-lg font-semibold text-[#003C8A]">Interactive Map Coming Soon</p>
                <p className="text-sm text-gray-600">AI-powered location recommendations</p>
              </div>
              
              {/* Floating recommendation cards */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-semibold text-sm">Highly Rated</span>
                </div>
                <p className="text-xs text-gray-600">Central Park - 0.5 miles away</p>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <div className="flex items-center mb-2">
                  <Utensils className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-semibold text-sm">Local Favorite</span>
                </div>
                <p className="text-xs text-gray-600">Joe's Pizza - 2 blocks away</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Travel Buddy */}
      <section className="max-w-5xl mx-auto mt-12 p-4">
        <h2 className="text-2xl font-bold mb-6 text-[#003C8A] flex items-center">
          <Users className="h-6 w-6 mr-2" />
          👫 Find travel buddies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Alex, 28", destination: "Tokyo in June", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
            { name: "Maria, 34", destination: "Paris in August", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" },
            { name: "James, 29", destination: "Bali in July", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
            { name: "Sophie, 26", destination: "Rome in September", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" }
          ].map((buddy, idx) => (
            <Card key={idx} className="bg-white shadow-lg border-2 border-gray-200 hover:border-[#0068EF] transition-all text-center hover:shadow-xl">
              <CardContent className="p-4">
                <img 
                  src={buddy.image} 
                  alt={buddy.name} 
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-gray-200"
                />
                <p className="font-bold text-[#003C8A]">{buddy.name}</p>
                <p className="text-sm text-gray-600 mb-3">{buddy.destination}</p>
                <Button size="sm" className="bg-[#0068EF] hover:bg-[#0055A5] text-white text-xs">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
            <Users className="mr-2 h-4 w-4" />
            View All Travel Buddies
          </Button>
        </div>
      </section>

      {/* Stats & Features */}
      <section className="bg-white py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#003C8A]">Why Choose UTrippin AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-gray-200 hover:border-[#0068EF] transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-[#0068EF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003C8A]">2.5M+ Trips Planned</h3>
                <p className="text-gray-600">
                  Our AI has successfully planned millions of trips, learning from each experience to serve you better.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-gray-200 hover:border-[#0068EF] transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-[#0068EF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Average $847 Saved</h3>
                <p className="text-gray-600">
                  Our AI finds the best deals and optimizes your itinerary to save you money without compromising quality.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-gray-200 hover:border-[#0068EF] transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-[#0068EF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003C8A]">3 Second Response</h3>
                <p className="text-gray-600">
                  Get instant responses to your travel questions with our lightning-fast AI processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}