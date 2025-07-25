// DesktopTravelPlanner.tsx
import React from 'react';
import { ChatContainer } from './custom/ChatContainer';
import { useAuth } from '@/hooks/useAuth';
import { TextAnimate } from '@/components/magicui/text-animate';
import { BlurFade } from '@/components/magicui/blur-fade';
import StarfieldBackground from './StarfieldBackground';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface DesktopTravelPlannerProps {
  onQuestionSelect?: (question: string) => void;
  hasStartedChat?: boolean;
  onClearChat?: () => void;
  chatMessages?: any[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

export default function DesktopTravelPlanner({ 
  onQuestionSelect,
  hasStartedChat = false,
  onClearChat,
  chatMessages = [],
  isLoading = false,
  onSendMessage
}: DesktopTravelPlannerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickQuestions = [
    "Plan a weekend getaway to Paris",
    "Best beaches in Thailand for couples",
    "Family-friendly activities in Tokyo",
    "Budget backpacking through Europe",
    "Luxury safari in Kenya",
    "Cultural experiences in Morocco"
  ];

  const handleQuestionClick = (question: string) => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
  };

  const handleStartNewTrip = () => {
    if (onClearChat) {
      onClearChat();
    }
  };

  return (
    <div className="hidden lg:block bg-black min-h-screen text-white relative overflow-hidden">
      <StarfieldBackground />
      
      <div className="relative z-10">
        {/* Fixed Header with Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-700"></div>
              
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                  alt="Keila Bot" 
                  className="w-8 h-8 animate-float"
                />
                <span className="text-gradient-keila text-lg font-bold">Keila AI</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasStartedChat && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartNewTrip}
                    className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-white transition-all duration-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Start New Trip
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearChat}
                    className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-red-600/20 hover:border-red-500/50 hover:text-white transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Clear Chat
                  </Button>
                </>
              )}
              <span className="text-sm text-gray-400">Plan. Share. Go.</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-20 px-6 py-10">
          {!hasStartedChat ? (
            // Welcome Screen
            <main className="max-w-4xl mx-auto">
              <div className="text-center">
                <BlurFade delay={0.5} inView>
                  <div className="mb-8">
                    <img 
                      src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                      alt="Keila Bot" 
                      className="mx-auto mb-6 w-20 h-20 animate-float hover:scale-110 transition-transform duration-300"
                    />
                    <TextAnimate 
                      animation="blurInUp" 
                      delay={0.7} 
                      by="character" 
                      once 
                      as="h1" 
                      className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight mb-4"
                    >
                      Ready to explore the world?
                    </TextAnimate>
                    <BlurFade delay={0.9} inView>
                      <p className="text-lg text-gray-300">Let's plan your dream trip! ✨</p>
                    </BlurFade>
                  </div>
                </BlurFade>

                <BlurFade delay={1.1} inView>
                  <div className="bg-zinc-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-2xl mx-auto text-white mb-8 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300">
                    <p className="text-base leading-relaxed">
                      Plan a 6-day adventure trip to Barcelona for 3 friends in October. Include hiking in Montserrat, a bike tour of the city, and a day for exploring Gothic Quarter. Budget-friendly options preferred.
                    </p>
                  </div>
                </BlurFade>

                <BlurFade delay={1.3} inView>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-5xl mx-auto">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`
                          rounded-2xl border-zinc-700 px-6 py-4 text-base font-medium
                          bg-zinc-800/50 backdrop-blur-sm text-gray-300 
                          hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-white 
                          transition-all duration-300 hover:scale-105 hover:shadow-lg 
                          hover:shadow-purple-500/20 animate-fade-in-up min-h-[60px]
                          text-center whitespace-normal leading-relaxed
                        `}
                        style={{ animationDelay: `${1.5 + index * 0.1}s` }}
                        onClick={() => handleQuestionClick(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </BlurFade>

                <BlurFade delay={2.0} inView>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
                    onClick={() => handleQuestionClick("I want to plan a custom trip")}
                  >
                    Let's Go ✨
                  </Button>
                </BlurFade>
              </div>
            </main>
          ) : (
            // Chat Interface
            <main className="max-w-6xl mx-auto">
              <div className="mb-6 text-center">
                <BlurFade delay={0.1} inView>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img 
                      src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
                      alt="Keila Bot" 
                      className="w-12 h-12 animate-float"
                    />
                    <TextAnimate 
                      animation="blurInUp" 
                      delay={0.2} 
                      by="character" 
                      once 
                      as="h2" 
                      className="text-2xl font-bold text-gradient-keila"
                    >
                      Let me help you plan your perfect trip!
                    </TextAnimate>
                  </div>
                </BlurFade>
              </div>

              {/* Chat Container */}
              <BlurFade delay={0.3} inView>
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden">
                  <ChatContainer
                    userId={user?.id}
                    variant="desktop"
                    enableReactions={true}
                    enablePinning={true}
                    enableSharing={true}
                  />
                </div>
              </BlurFade>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}