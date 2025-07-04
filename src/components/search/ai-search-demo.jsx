import React, { useState } from "react";
import { Button } from "../ui/button";
import { Sparkles, Send } from "lucide-react";

export default function AiSearchDemo() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessage("");
    }, 2000);
  };

  const exampleQueries = [
    "Plan a 5-day trip to Japan for $2000",
    "Find pet-friendly hotels in Barcelona",
    "Best time to visit Thailand for weather?",
    "Accessible travel options in Europe"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-[#0068EF]/20">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="h-6 w-6 text-[#0068EF] mr-2" />
          <h3 className="text-xl font-semibold text-[#003C8A]">AI Travel Assistant</h3>
        </div>
        <p className="text-gray-600">
          Ask me anything about travel - I'll help you plan, book, and discover amazing destinations
        </p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl p-4 mb-4 min-h-[200px] border">
        <div className="space-y-4">
          {/* AI Welcome Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#0068EF] rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
              <p className="text-sm">
                Hi! I'm your AI travel assistant. I can help you plan trips, find deals, and answer travel questions. What would you like to explore today?
              </p>
            </div>
          </div>

          {/* User Message (if any) */}
          {message && (
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-[#0068EF] text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">{message}</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">You</span>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#0068EF] rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me about travel plans, destinations, or deals..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-[#0068EF] focus:outline-none focus:ring-2 focus:ring-[#0068EF] focus:ring-opacity-20"
          disabled={isTyping}
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || isTyping}
          className="bg-[#0068EF] hover:bg-[#0055A5] px-4 py-3 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Example Queries */}
      <div>
        <p className="text-sm text-gray-600 mb-3">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => setMessage(query)}
              className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
              disabled={isTyping}
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}