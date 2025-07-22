import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTrips } from "@/hooks/useTrips";
import { useDebounce } from "@/hooks/useDebounce";
import { useChatAI } from "@/hooks/useChatAI";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useEnhancedOpenAITrips } from "@/hooks/useEnhancedOpenAITrips";
import { useAITripPlanner } from "@/hooks/useAITripPlanner";
import { supabase } from "@/integrations/supabase/client";
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
import travelImage1 from '@/assets/travel-image-1.png';
import travelImage2 from '@/assets/travel-image-2.png';
import travelImage3 from '@/assets/travel-image-3.png';
import travelImage4 from '@/assets/travel-image-4.png';
import travelImage5 from '@/assets/travel-image-5.png';
import TravelCarousel from '@/components/TravelCarousel';
import { TextAnimate } from "@/components/magicui/text-animate";  
import { BlurFade } from "@/components/magicui/blur-fade";
import { PromptInputArea } from '@/components/custom/prompt-input-area';
import { ChatContainer, Message as MessageType } from '@/components/custom/chat-container';
// import { Navbar } from '@/components/custom/navbar';
import { useChat } from '@/hooks/use-chat';
import UtrippinLogo from '@/components/UtrippinLogo';

// Add CSS animations for auto-scrolling and darkmode styles
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

  .card-item:hover ~ .animate-scroll-left,
  .card-item:hover ~ .animate-scroll-right,
  .animate-scroll-left:hover,
  .animate-scroll-right:hover {
    animation-play-state: paused;
  }

  .marquee-left, .marquee-right {
    overflow: hidden;
    white-space: nowrap;
  }

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

  /* Navbar specific darkmode styles */
  .dark-home-component nav {
    background-color: rgba(43, 46, 53, 0.3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(36, 38, 44, 1);
  }

  .dark-home-component nav .hover\\:bg-card:hover {
    background-color: rgba(60, 63, 72, 0.3);
  }

  .dark-home-component nav .bg-card {
    background-color: rgba(60, 63, 72, 0.3);
  }

  /* ChatContainer darkmode styles */
  .dark-home-component .bg-transparent {
    background-color: transparent;
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
  .dark-home-component .text-neutral-500 {
    color: rgba(150, 152, 158, 1);
  }

  .dark-home-component .border-input {
    border-color: rgba(36, 38, 44, 1);
  }

  .dark-home-component .hover\\:bg-primary\\/10:hover {
    background-color: rgba(28, 103, 243, 0.15);
  }

  /* Icon colors for darkmode - more vibrant for dark background */
  .dark-home-component .text-green-600 {
    color: rgba(34, 197, 94, 1);
  }

  .dark-home-component .text-cyan-600 {
    color: rgba(8, 145, 178, 1);
  }

  .dark-home-component .text-indigo-600 {
    color: rgba(99, 102, 241, 1);
  }

  .dark-home-component .text-yellow-600 {
    color: rgba(202, 138, 4, 1);
  }

  .dark-home-component .text-pink-600 {
    color: rgba(219, 39, 119, 1);
  }

  .dark-home-component .text-pink-500 {
    color: rgba(236, 72, 153, 1);
  }

  /* Suggestion buttons hover state */
  .dark-home-component button[variant="outline"]:hover {
    background-color: rgba(28, 103, 243, 0.1);
    border-color: rgba(28, 103, 243, 0.3);
    color: rgba(250, 250, 250, 0.9);
  }

  /* File upload button darkmode */
  .dark-home-component .hover\\:bg-card-foreground\\/10:hover {
    background-color: rgba(250, 250, 250, 0.1);
  }

  /* AdvancedTripPlanner darkmode styles */
  .dark-home-component .bg-slate-900 {
    background-color: rgba(22, 23, 26, 1);
  }

  .dark-home-component .bg-slate-800 {
    background-color: rgba(36, 38, 44, 1);
  }

  .dark-home-component .bg-slate-800\\/50 {
    background-color: rgba(36, 38, 44, 0.5);
  }

  .dark-home-component .bg-slate-800\\/70 {
    background-color: rgba(36, 38, 44, 0.7);
  }

  .dark-home-component .bg-slate-700 {
    background-color: rgba(43, 46, 53, 1);
  }

  .dark-home-component .hover\\:bg-slate-600:hover {
    background-color: rgba(60, 63, 72, 1);
  }

  .dark-home-component .hover\\:bg-slate-800\\/70:hover {
    background-color: rgba(36, 38, 44, 0.7);
  }

  .dark-home-component .border-slate-600 {
    border-color: rgba(60, 63, 72, 1);
  }

  .dark-home-component .border-blue-500\\/20 {
    border-color: rgba(28, 103, 243, 0.2);
  }

  .dark-home-component .text-slate-400 {
    color: rgba(150, 152, 158, 1);
  }

  .dark-home-component .text-slate-300 {
    color: rgba(210, 210, 210, 1);
  }

  .dark-home-component .text-white {
    color: rgba(250, 250, 250, 1);
  }

  /* Status badge colors */
  .dark-home-component .bg-yellow-500\\/20 {
    background-color: rgba(232, 162, 0, 0.2);
  }

  .dark-home-component .text-yellow-400 {
    color: rgba(251, 191, 36, 1);
  }

  .dark-home-component .bg-green-500\\/20 {
    background-color: rgba(0, 145, 107, 0.2);
  }

  .dark-home-component .text-green-400 {
    color: rgba(34, 197, 94, 1);
  }

  .dark-home-component .bg-blue-500\\/20 {
    background-color: rgba(28, 103, 243, 0.2);
  }

  .dark-home-component .text-blue-400 {
    color: rgba(96, 165, 250, 1);
  }

  /* Button colors for trip planner */
  .dark-home-component .bg-blue-600 {
    background-color: rgba(28, 103, 243, 1);
  }

  .dark-home-component .hover\\:bg-blue-500:hover {
    background-color: rgba(59, 130, 246, 1);
  }

  .dark-home-component .bg-green-600 {
    background-color: rgba(0, 145, 107, 1);
  }

  .dark-home-component .hover\\:bg-green-500:hover {
    background-color: rgba(34, 197, 94, 1);
  }

  /* Modal overlay */
  .dark-home-component .bg-black\\/70 {
    background-color: rgba(0, 0, 0, 0.8);
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

  /* Header integration with darkmode */
  .dark-home-component > header,
  .dark-home-component > div > header {
    background-color: rgba(22, 23, 26, 1);
    border-bottom-color: rgba(36, 38, 44, 1);
  }

  /* Footer integration with darkmode */
  .dark-home-component + div footer,
  .dark-home-component footer {
    background-color: rgba(22, 23, 26, 1);
    border-top-color: rgba(36, 38, 44, 1);
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

  @keyframes shine {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }

  .animate-shine {
    animation: shine var(--duration, 4s) infinite linear;
  }

  /* Darkmode shimmer effect */
  .dark-home-component .motion-safe\\:animate-shine {
    animation: shine var(--duration, 4s) infinite linear;
  }

  .dark-home-component .will-change-\\[background-position\\] {
    will-change: background-position;
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

interface CardData {
  icon: string;
  bgColor: string;
  badgeColor: string;
  category: string;
  question: string;
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
  const { messages, sendMessage } = useChatAI(trips);
  const { generateTrips } = useEnhancedOpenAITrips();
  const { messages: tripPlannerMessages, sendMessage: sendTripPlannerMessage } = useAITripPlanner();
  const [aiTrips, setAiTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const { preferences } = usePersonalization();
  
  // New chat functionality for desktop
  const [desktopMessages, setDesktopMessages] = useState<MessageType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addDesktopMessage = (message: MessageType) => {
    setDesktopMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearDesktopMessages = () => {
    setDesktopMessages([]);
  };
  

  




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
      className="relative flex-shrink-0 w-[480px] h-[174px] border border-border rounded-lg mr-12 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group card-item hover:scale-[1.02] cursor-pointer"
      style={{ backgroundColor: '#f5f7fa' }}
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
            isMobile: true
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
          // Format the AI response properly
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
    // Unified behavior for all devices
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
      {/* Responsive view for all devices */}
      <div className="flex flex-col min-h-screen bg-background dark-home-component">
        
        <main className="flex-1 flex min-h-[calc(100vh-115px)]">
              
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
        <div className="hidden md:block bg-white" style={{color: '#f5f7fa'}}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ">
            {/* Form Section */}
            <div className="text-center mb-8">
              <div className="text-3xl sm:text-4xl font-bold mb-4" style={{color: '#0f2948'}}>
                Plan Your Perfect
              </div>
              <div className="inline-block bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-6 py-2 rounded-full text-xl sm:text-2xl font-bold mb-6">
                Staycation or Vacation
              </div>
              <div className="text-lg" style={{color: '#0f2948', fontSize: '14px'}}>
                Set your budget and group size to discover amazing destinations
              </div>
            </div>

            {/* Trip Type Toggle */}
            <div className="mb-8 flex justify-center">
              <div className="bg-gray-100 border border-gray-200 p-2 rounded-2xl shadow-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTripType('staycation')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      tripType === 'staycation'
                        ? 'bg-blue-600 text-white shadow-lg'
                          : 'hover:bg-gray-200'
                    }`}
                     style={{color: tripType === 'staycation' ? '#ffffff' : '#0f2948'}}
                  >
                    🏠 Staycation
                  </button>
                  <button
                    onClick={() => setTripType('vacation')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      tripType === 'vacation'
                        ? 'bg-blue-600 text-white shadow-lg'
                         : 'hover:bg-gray-200'
                    }`}
                     style={{color: tripType === 'vacation' ? '#ffffff' : '#0f2948'}}
                  >
                    ✈️ Vacation
                  </button>
                </div>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="mb-8">
              <label className="block font-medium mb-4" style={{color: '#0f2948'}}>Budget Range</label>
              <BudgetSlider budget={budget} onBudgetChange={setBudget} min={100} max={1000000} />
              <div className="text-center mt-2">
                <span className="text-orange-400 text-lg font-semibold">
                  Perfect for a nice {tripType} day
                </span>
              </div>
            </div>

            {/* Group Size */}
            <div className="mb-8">
              <label className="block font-medium mb-4 flex items-center gap-2" style={{color: '#0f2948'}}>
                👥 Group Size
              </label>
              <div className="flex items-center justify-center gap-4 bg-gray-100 border border-gray-200 p-4 rounded-2xl shadow-sm">
                <button
                  onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-bold text-xl transition-colors"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                  {groupSize}
                </span>
                <button
                  onClick={() => setGroupSize(groupSize + 1)}
                  className="w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Zip Code Input */}
            <div className="mb-8">
              <label className="block font-medium mb-4" style={{color: '#0f2948'}}>
                Enter Zip Code {tripType === 'staycation' ? '(for staycations)' : ''}
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter Zip Code"
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors shadow-sm"
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
                  </div>
                        </div>
        <Footer />
      </div>
      
      <BackToTop />
    </>
  );
}
