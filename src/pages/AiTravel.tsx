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
import keilaLogo from '@/assets/Keila_logo.png';
import TravelCarousel from '@/components/TravelCarousel';

// Add CSS animations for auto-scrolling
const scrollingStyles = `
  @keyframes scroll-left {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-33.33%);
    }
  }

  @keyframes scroll-right {
    0% {
      transform: translateX(-33.33%);
    }
    100% {
      transform: translateX(0%);
    }
  }

  .animate-scroll-left {
    animation: scroll-left 20s linear infinite;
  }

  .animate-scroll-right {
    animation: scroll-right 20s linear infinite;
  }

  .marquee-left, .marquee-right {
    overflow: hidden;
    white-space: nowrap;
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
}

interface CardData {
  icon: string;
  bgColor: string;
  badgeColor: string;
  category: string;
  question: string;
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

  // Card data arrays
  const firstRowCards = [
    {
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      bgColor: "bg-teal-500",
      badgeColor: "from-teal-100 to-teal-50 text-teal-700 border-teal-200",
      category: "✨ Things to do",
      question: "Are there any famous seafood restaurants in Tokyo?"
    },
    {
      icon: "M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z",
      bgColor: "bg-purple-500",
      badgeColor: "from-purple-100 to-purple-50 text-purple-700 border-purple-200",
      category: "📅 Itinerary plan",
      question: "What should I include in a 5-day itinerary for Paris?"
    },
    {
      icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
      bgColor: "bg-red-500",
      badgeColor: "from-red-100 to-red-50 text-red-700 border-red-200",
      category: "🏨 Stays",
      question: "Are there any famous seafood restaurants in Tokyo?"
    },
    {
      icon: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z",
      bgColor: "bg-green-500",
      badgeColor: "from-green-100 to-green-50 text-green-700 border-green-200",
      category: "🎯 Activities",
      question: "Which outdoor activities are popular in New Zealand?"
    }
  ];

  const secondRowCards = [
    {
      icon: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
      bgColor: "bg-blue-500",
      badgeColor: "from-blue-100 to-blue-50 text-blue-700 border-blue-200",
      category: "✈️ Flights",
      question: "How can I avoid jet lag on long-haul flights?"
    },
    {
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
      bgColor: "bg-orange-500",
      badgeColor: "from-orange-100 to-orange-50 text-orange-700 border-orange-200",
      category: "💡 Tips",
      question: "What is the best time to visit Italy?"
    },
    {
      icon: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
      bgColor: "bg-indigo-500",
      badgeColor: "from-indigo-100 to-indigo-50 text-indigo-700 border-indigo-200",
      category: "🛫 Flights",
      question: "How can I avoid jet lag on long-haul flights?"
    },
    {
      icon: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
      bgColor: "bg-pink-500",
      badgeColor: "from-pink-100 to-pink-50 text-pink-700 border-pink-200",
      category: "📋 Bookings",
      question: "What is the best time to visit Italy?"
    }
  ];

  const renderCard = (card: CardData, key: string) => (
    <div 
      key={key}
      className="relative inline-block shadow-lg hover:shadow-xl transition-all duration-300 group card-item" 
      style={{ 
        width: '480px', 
        height: '174px', 
        background: '#f5f7fa', 
        borderRadius: '8px 0 8px 8px',
        marginRight: '45px',
        padding: '20px',
        fontSize: '16px'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d={card.icon}/>
          </svg>
        </div>
        <span className={`bg-gradient-to-r ${card.badgeColor} px-4 py-2 rounded-full text-sm font-semibold border`}>
          {card.category}
        </span>
      </div>
      <p className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
        {card.question}
      </p>
    </div>
  );

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

  // Debug logging
  console.log('AI Travel Debug:', {
    showTripPlanner,
    tripPlannerMessagesLength: tripPlannerMessages.length,
    tripPlannerMessages: tripPlannerMessages.slice(0, 2) // Show first 2 messages for debugging
  });

  // Only show trip planner when user explicitly requests it
  // Don't auto-show on message load

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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white">
        
        <main className="flex-1">
          {/* New Keila Hero Section */}
          <div 
            className="text-gray-800 px-4 flex items-center justify-center" 
            style={{ 
              position: 'relative',
              width: '100%',
              height: 'calc(100vh - 115px)',
              padding: '100px 0',
              boxSizing: 'border-box',
              textAlign: 'center',
              backgroundImage: 'url(/src/assets/ai_travel_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              {/* Keila Logo and Title */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <img 
                  src={keilaLogo} 
                  alt="Keila" 
                  className="w-40 h-40 object-contain"
                />
                <div className="text-6xl sm:text-7xl font-bold" style={{ color: '#0f2948' }}>
                  Meet Keila
                </div>
              </div>
              
              <p className="text-3xl font-bold mb-16 whitespace-nowrap" style={{ color: '#0f2948' }}>
                Your most comprehensive and free AI Trip Planner by <span className="text-blue-600 font-medium">utrippin<span className="text-yellow-500">.</span>ai</span>
              </p>
              
              {/* Try Keila on App Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Try Keila on App
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Experience AI travel magic on your mobile device
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors">
                    Download App
                  </button>
                </div>
              </div>
              
              {/* Find out more link */}
              <div className="text-center">
                <div 
                  className="text-base text-gray-700 hover:text-gray-900 font-medium cursor-pointer"
                  onClick={() => {
                    document.getElementById('trip-planner-section')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  🔍 Find out more
                </div>
                        </div>
        </div>
      </div>

      {/* Keila Responds Section */}
      <div id="trip-planner-section" className="px-4" style={{ background: '#f5f7fa', paddingTop: '56px', overflow: 'hidden' }}>
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h2 className="font-bold" style={{ lineHeight: 'normal', fontSize: '46px', margin: '0 0 12px 20%', color: '#0f294D' }}>
              Keila Responds to
            </h2>
            <h3 className="font-bold" style={{ 
              position: 'relative',
              padding: '0 20%',
              marginBottom: '61px',
              fontSize: '54px',
              fontWeight: '700',
              lineHeight: 'normal', 
              color: 'transparent', 
              WebkitBackgroundClip: 'text', 
              backgroundClip: 'text', 
              backgroundImage: 'linear-gradient(-266.03deg, #59c8ff 6.6%, #7378e6 85.42%)'
            }}>
              All Your Travel Questions
            </h3>
          </div>

          {/* Travel Destinations Carousel */}
          <div className="mb-16">
            <TravelCarousel 
              images={Array(5).fill('/src/assets/picture_image.png')}
              className="mb-8"
            />
          </div>

          {/* Keila Benefits Section */}
          <div className="picture-scroll">
            <p className="plus" style={{ fontSize: '32px', fontWeight: '700', marginLeft: '20%', color: '#0f294D' }}>
              Plus,
            </p>
            <p className="more-benefits" style={{ fontSize: '32px', fontWeight: '700', marginLeft: '20%', color: '#0f294D' }}>
              Keila Has More Benefits...
            </p>
            <div className="bottom-desc" style={{ 
              display: 'flex', 
              marginLeft: '20%', 
              marginTop: '35px', 
              maxWidth: '1160px', 
              paddingBottom: '122px' 
            }}>
                             <p style={{ display: 'flex', flex: '1 1', paddingRight: '64px' }}>
                 <img src="https://dimg04.tripcdn.com/images/1qd6412000eigq23mE2D9.png" alt="Attractions icon" style={{ width: '48px', height: '48px' }} />
                 <span style={{ display: 'inline-block', verticalAlign: 'top', fontSize: '20px' }}>Over 1 million attractions covering more than 180 countries or regions</span>
               </p>
               <p style={{ display: 'flex', flex: '1 1', paddingRight: '64px' }}>
                 <img src="https://dimg04.tripcdn.com/images/1qd6o12000eigptmg60CA.png" alt="Advice icon" style={{ width: '48px', height: '48px' }} />
                 <span style={{ display: 'inline-block', verticalAlign: 'top', fontSize: '20px' }}>Advice for every step of your trip</span>
               </p>
               <p style={{ display: 'flex', flex: '1 1', paddingRight: '64px' }}>
                 <img src="https://dimg04.tripcdn.com/images/1qd5c12000eigq32z1E19.png" alt="App icon" style={{ width: '48px', height: '48px' }} />
                 <span style={{ display: 'inline-block', verticalAlign: 'top', fontSize: '20px' }}>A user-friendly, convenient app that you can use on the go</span>
               </p>
                         </div>
           </div>
        </div>
      </div>
      

          {/* Keila More to Offer Section */}
          <div className="py-16" style={{ background: '#fff', paddingTop: '56px', overflow: 'hidden' }}>
            <div className="mb-12">
              <h2 className="font-bold" style={{ 
                lineHeight: 'normal', 
                fontSize: '46px', 
                margin: '0 0 12px 20%', 
                color: '#0f294D' 
              }}>
                Keila Has a Lot
              </h2>
              <h3 className="font-bold" style={{ 
                position: 'relative',
                padding: '0 20%',
                marginBottom: '61px',
                fontSize: '54px',
                fontWeight: '700',
                lineHeight: 'normal', 
                color: 'transparent', 
                WebkitBackgroundClip: 'text', 
                backgroundClip: 'text', 
                backgroundImage: 'linear-gradient(-266.03deg, #59c8ff 6.6%, #7378e6 85.42%)'
              }}>
                More to Offer...
              </h3>
            </div>

                         {/* Auto-scrolling rows */}
             <div className="relative overflow-hidden">
               {/* First row - moves left */}
               <div className="marquee-left mb-6">
                 <div className="flex animate-scroll-left">
                   {/* First set */}
                   {firstRowCards.map((card, index) => renderCard(card, `first-${index}`))}
                   
                   {/* Second set - duplicate for seamless loop */}
                   {firstRowCards.map((card, index) => renderCard(card, `first-dup1-${index}`))}
                   
                   {/* Third set - duplicate for seamless loop */}
                   {firstRowCards.map((card, index) => renderCard(card, `first-dup2-${index}`))}
                 </div>
               </div>

               {/* Second row - moves right */}
               <div className="marquee-right">
                 <div className="flex animate-scroll-right">
                   {/* First set */}
                   {secondRowCards.map((card, index) => renderCard(card, `second-${index}`))}
                   
                   {/* Second set - duplicate for seamless loop */}
                   {secondRowCards.map((card, index) => renderCard(card, `second-dup1-${index}`))}
                   
                   {/* Third set - duplicate for seamless loop */}
                   {secondRowCards.map((card, index) => renderCard(card, `second-dup2-${index}`))}
                 </div>
               </div>
             </div>
          </div>


      {/* Original Hero Section */}
          <div id="trip-planner-section" className="bg-[#f5f7fa] text-white py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: '#0f294D' }}>
                Describe your perfect trip and budget!
              </div>
              <p className="text-xl sm:text-2xl text-blue-100 mb-12" style={{ 
                lineHeight: 'normal', 
                color: 'transparent', 
                fontWeight: '700',
                WebkitBackgroundClip: 'text', 
                backgroundClip: 'text', 
                backgroundImage: 'linear-gradient(-266.03deg, #59c8ff 6.6%, #7378e6 85.42%)'
              }}>
                Get custom itineraries, dates, and budgets tailored just for you.
              </p>
              
              {/* Main Input Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                <div className="flex items-center gap-4 bg-white rounded-2xl p-2 mb-6">
                  <div className="bg-blue-600 rounded-xl p-3 flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Plan me a trip to Mexico in Nov for 3 people"
                    className="flex-1 text-gray-800 text-lg px-4 py-3 bg-transparent outline-none placeholder-gray-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          handleSendMessage(target.value);
                          target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
                      if (input?.value.trim()) {
                        handleSendMessage(input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-[#0f294D] text-lg font-bold">
                  Describe your perfect trip...
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <p className="text-[#0f294D] text-lg mb-4 font-bold">
                  Powered by advanced AI • Personalized recommendations • Real-time pricing
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-medium">
                    🎯 Custom Itineraries
                  </span>
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-medium">
                    💰 Budget Optimization
                  </span>
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-medium">
                    📅 Real-time Booking
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
        </main>

        <Footer />
      </div>
      
      <BackToTop />
    </>
  );
}
