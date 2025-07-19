import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { SimpleChatInput } from "@/components/SimpleChatInput";

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI travel assistant. How can I help you plan your perfect trip?",
      isUser: false
    }
  ]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const newMessages = [
      ...messages,
      { id: Date.now(), text: message, isUser: true },
      { 
        id: Date.now() + 1, 
        text: "I'd love to help you plan that trip! Let me suggest some great options based on your interests.", 
        isUser: false 
      }
    ];
    setMessages(newMessages);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border border-blue-500/20 rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-slate-800 rounded-t-2xl p-4 flex items-center justify-between border-b border-blue-500/20">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <h3 className="text-white font-semibold">AI Travel Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-blue-500/20">
            <SimpleChatInput 
              onSendMessage={handleSendMessage}
              placeholder="Ask me about destinations, planning tips..."
            />
          </div>
        </div>
      )}
    </>
  );
};