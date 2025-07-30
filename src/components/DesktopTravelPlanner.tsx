import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Sparkles, Paperclip, ArrowUp, Map, Compass, Star, Plane, MapPin } from "lucide-react";

// This reusable component is simple and correct. No changes needed here.
const ChatMessage = ({ message, children = null }) => {
  const { text = "", isUser = false } = message;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isUser && text) {
      const words = text.split(" ");
      let currentWordIndex = 0;
      setDisplayedText(""); // Clear previous text

      const intervalId = setInterval(() => {
        if (currentWordIndex < words.length) {
          setDisplayedText((prev) =>
            prev ? `${prev} ${words[currentWordIndex]}` : words[currentWordIndex]
          );
          currentWordIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 100); // Adjust the speed of word rendering here (in milliseconds)

      return () => clearInterval(intervalId);
    } else {
      // For user messages, display them instantly
      setDisplayedText(text);
    }
  }, [text, isUser]);

  const wrapperClasses = `flex items-end gap-3 my-4 ${
    isUser ? "justify-end" : "justify-start"
  }`;

  const bubbleClasses = isUser
    ? "bg-blue-600 text-white rounded-2xl rounded-br-none" // User bubble
    : " text-gray-200 rounded-2xl rounded-bl-none"; // AI bubble
  
  const UserAvatar = () => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
      <User className="text-white" />
    </div>
  );

  const AiAvatar = () => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
      <Sparkles className="text-white" />
    </div>
  );

  return (
    <div className={wrapperClasses}>
      {/* Show AI avatar on the left, user avatar on the right */}
      {!isUser && <AiAvatar />}
      
      <div className={` px-4 text-white py-3 shadow-md ${bubbleClasses}`}>
        {children ? children : (
          text && <p className="whitespace-pre-wrap text-white font-white">
            {displayedText}
            {!isUser && displayedText.length > 0 && displayedText.length < text.length && (
              <span className="inline-block w-1 h-4 bg-white ml-1 animate-pulse"></span>
            )}
          </p>
        )}
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
};

// --- NEW COMPONENT: Flight Details ---
const FlightDetails = () => (
  <div className="mt-4">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-bold text-gray-100">How to get there</h3>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Fastest</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70"><path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
      </div>
    </div>

    {/* Flight Option 1 */}
    <div className="bg-[#0D1117] rounded-lg p-4 mb-3 border border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img src="https://ai-travel-planner-smoky.vercel.app/images/american-airlines.svg" alt="American Airlines" className="w-6 h-6 bg-white p-0.5 rounded-sm"/>
          <span className="text-sm font-semibold text-gray-300">American Airlines</span>
          <span className="text-xs bg-gray-600 text-gray-200 px-2 py-0.5 rounded">ADS</span>
        </div>
        <span className="text-xl font-bold text-white">$449</span>
      </div>
      <div className="flex justify-between items-center mt-3 text-center">
        <div>
          <p className="text-lg font-semibold">JFK</p>
          <p className="text-sm text-gray-400">New York</p>
          <p className="text-xs text-gray-500 mt-1">11 May - 20:00</p>
        </div>
        <div className="flex-1 text-center px-4">
          <p className="text-xs text-gray-400">5h 50</p>
          <div className="w-full h-px bg-gray-600 my-1 relative">
             <Plane size={16} className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-gray-400 bg-[#0D1117] px-1" />
          </div>
          <p className="text-xs text-green-400">Direct</p>
        </div>
        <div>
          <p className="text-lg font-semibold">LAX</p>
          <p className="text-sm text-gray-400">Los Angeles</p>
          <p className="text-xs text-gray-500 mt-1">12 May - 01:50</p>
        </div>
      </div>
    </div>
    
    {/* Flight Option 2 */}
    <div className="bg-[#0D1117] rounded-lg p-4 border border-gray-700">
       <div className="flex justify-between items-start">
         <div className="flex items-center gap-3">
           <img src="https://ai-travel-planner-smoky.vercel.app/images/swiss-airlines.svg" alt="Swiss Airlines" className="w-6 h-6 bg-white p-0.5 rounded-sm"/>
           <span className="text-sm font-semibold text-gray-300">Swiss</span>
         </div>
        <span className="text-xl font-bold text-white">$489</span>
      </div>
      <div className="flex justify-between items-center mt-3 text-center">
        <div>
          <p className="text-lg font-semibold">JFK</p>
          <p className="text-sm text-gray-400">New York</p>
          <p className="text-xs text-gray-500 mt-1">11 May - 21:10</p>
        </div>
        <div className="flex-1 text-center px-4">
          <p className="text-xs text-gray-400">7h 50</p>
          <div className="w-full h-px bg-gray-600 my-1 relative">
             <Plane size={16} className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-gray-400 bg-[#0D1117] px-1" />
          </div>
          <p className="text-xs text-gray-400">1 stop</p>
        </div>
        <div>
          <p className="text-lg font-semibold">BCN</p>
          <p className="text-sm text-gray-400">Barcelona-El Prat</p>
          <p className="text-xs text-gray-500 mt-1">12 May - 04:50</p>
        </div>
      </div>
    </div>
    <p className="text-right text-xs text-gray-500 mt-2">Powered by Skyscanner</p>
  </div>
);

// --- NEW COMPONENT: Hotel Details ---
const HotelDetails = () => (
  <div className="mt-6">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-bold text-gray-100">Where to stay</h3>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Cheapest</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70"><path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
      </div>
    </div>

    <div className="bg-[#0D1117] rounded-lg border border-gray-700 overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3 relative">
        <img src="https://ai-travel-planner-smoky.vercel.app/images/hotel-1.jpg" alt="Catalonia Atenas" className="w-full h-full object-cover"/>
        <button className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:text-red-500 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-bold text-white">Catalonia Atenas</h4>
            <div className="flex text-yellow-400">
              {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              <Star size={16} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 bg-blue-600 text-white font-bold text-xs rounded">4.8/5</span>
            <span className="text-sm text-gray-300">Very Good</span>
            <span className="text-sm text-gray-400">(167 reviews)</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-400">
            <MapPin size={14}/>
            <span className="text-sm">Near Sagrada Familia</span>
          </div>
          <p className="text-sm text-gray-300 mt-3">Double Room or Twin Room</p>
          <p className="text-sm text-gray-400">Breakfast included • <span className="text-green-400">Free cancellation</span></p>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
             <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded-md">Special Discount</span>
             <div className="flex items-baseline gap-2 mt-1">
                <span className="text-gray-500 line-through text-xl">$72</span>
                <span className="text-white font-bold text-3xl">$48</span>
             </div>
             <p className="text-xs text-gray-400">Total price: $240</p>
          </div>
          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2">
            Check Availability <ArrowUp size={16} className="transform rotate-45"/>
          </button>
        </div>
      </div>
    </div>
     <p className="text-right text-xs text-gray-500 mt-2">Powered by Booking.com</p>
  </div>
);


const DesktopTravelPlanner = ({
  chatMessages = [],
  isLoading,
  onSendMessage,
  onClearChat,
  hasStartedChat,
}) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  console.log('[DesktopTravelPlanner] Component received props:', {
    hasStartedChat,
    isGlobalLoading: isLoading,
    chatMessagePairsCount: chatMessages.length,
    chatMessages,
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !isLoading) {
      onSendMessage(trimmedInput);
      setInputValue("");
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  const EmptyChatView = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="mb-6 w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl animate-pulse">
        <Sparkles size={48} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-100 mb-2">Ready To Plan Your Trip?</h1>
      <p className="text-lg text-gray-400 mb-8">Select a prompt or type a custom request below.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
        <button onClick={() => handlePromptClick("Plan a 3-day trip to Paris for me")} className="text-left p-4 bg-[#1c1c24] rounded-xl hover:bg-[#2a2a33] transition-all duration-200 border border-transparent hover:border-blue-500">
          <p className="font-semibold text-white">Paris Adventure</p>
          <p className="text-sm text-gray-400">for a 3-day trip</p>
        </button>
        <button onClick={() => handlePromptClick("I want to find beautiful beach destinations in Thailand")} className="text-left p-4 bg-[#1c1c24] rounded-xl hover:bg-[#2a2a33] transition-all duration-200 border border-transparent hover:border-blue-500">
          <p className="font-semibold text-white">Thailand Beaches</p>
          <p className="text-sm text-gray-400">for a relaxing getaway</p>
        </button>
      </div>
    </div>
  );

  const ChatView = () => {
    console.log('[DesktopTravelPlanner] Now mapping through chat message pairs...');
    
    return (
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6">
        {/* --- ADDED FLIGHT AND HOTEL SECTIONS --- */}
        <ChatMessage message={{ isUser: false }}>
          <div>
            <FlightDetails />
            <HotelDetails />
          </div>
        </ChatMessage>
        
        {chatMessages.map((messagePair) => (
        <React.Fragment key={messagePair.id}>
          {messagePair.question && (
            <ChatMessage message={{ text: messagePair.question, isUser: true }} />
          )}

          {messagePair.loading ? (
            <div className="flex items-start gap-3 my-4 justify-start">
             
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" />
              </div>
              <div className="max-w-xl p-4 shadow-md bg-[#2a2a33] text-white rounded-2xl rounded-bl-none">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce delay-0"></span>
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          ) : (
            messagePair.response && (
              <ChatMessage message={{ text: messagePair.response, isUser: false }} />
            )
          )}
        </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      <style>{`
        @keyframes beam { 0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); } 50% { transform: translateX(400%) translateY(400%) rotate(45deg); } 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .beam-container { position: relative; overflow: hidden; }
        .beam-container::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3), transparent); animation: beam 3s infinite; border-radius: inherit; opacity: 0; transition: opacity 0.3s ease; }
        .beam-container:hover::before, .beam-container.focused::before { opacity: 1; }
        .gradient-border { background: linear-gradient(45deg, #1f2937, #3b82f6, #8b5cf6, #ec4899, #1f2937); background-size: 300% 300%; animation: gradient-shift 4s ease infinite; padding: 2px; border-radius: 0.75rem; }
        .gradient-border.focused { background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6); background-size: 300% 300%; animation: gradient-shift 2s ease infinite; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2), 0 0 60px rgba(236, 72, 153, 0.1); }
        .inner-container { background: #1c1c24; border-radius: 0.625rem; position: relative; z-index: 1; }
      `}</style>
      
      <div className="flex flex-col items-center py-6 px-2 w-20 bg-black shadow-lg">
        <button className="mb-8 p-3" onClick={onClearChat}>
          <img src="/public/utrippin-logo.svg" alt="U-Trippin Logo" className="w-10 h-10" />
        </button>
        <div className="flex flex-col gap-6 flex-1">
          <button title="New Trip" className="p-3 rounded-full bg-[#1c1c24] hover:bg-[#2a2a33] transition-colors"><Map size={20} /></button>
          <button title="Explore" className="p-3 rounded-full bg-[#1c1c24] hover:bg-[#2a2a33] transition-colors"><Compass size={20} /></button>
        </div>
        <div className="mt-auto mb-2">
          <img src={user?.user_metadata?.avatar_url || "/public/utrippin-logo.svg"} alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-green-400 object-cover" />
        </div>
      </div>

      <main className="flex-1 flex flex-col bg-[#0D1117]">
        {hasStartedChat ? <ChatView /> : <EmptyChatView />}

        <div className="px-6 pb-6 mt-auto">
          <div className="w-full max-w-4xl mx-auto">
            <div className={`gradient-border ${isFocused ? 'focused' : ''}`}>
              <div className={`beam-container ${isFocused ? 'focused' : ''}`}>
                <form onSubmit={handleFormSubmit} className="inner-container p-2 flex items-center gap-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors relative z-10">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none text-base text-gray-200 placeholder-gray-500 relative z-10"
                    placeholder="Message your AI travel planner..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl relative z-10 transform hover:scale-105"
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send Message"
                  >
                    <ArrowUp size={20} />
                  </button>
                </form>
              </div>
            </div>
            <p className="text-xs text-center text-gray-600 mt-2">
              U-Trippin may produce inaccurate information. Verify important details.
            </p>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesktopTravelPlanner;