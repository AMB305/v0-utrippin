import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { SimpleChatInput } from "@/components/SimpleChatInput";
import { useChatAI } from "@/hooks/useChatAI";

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages: aiMessages, sendMessage, loading } = useChatAI();

  // Convert AI messages to display format
  const displayMessages = React.useMemo(() => {
    console.log('=== ChatAssistant: displayMessages useMemo START ===');
    console.log('ChatAssistant: aiMessages input:', aiMessages);
    console.log('ChatAssistant: aiMessages length:', aiMessages.length);
    
    const converted = [];
    
    // Only add greeting on first load, not after clearing
    if (aiMessages.length === 0) {
      // Don't automatically add greeting - let the chat start empty
    }

    // Convert AI messages to display format
    aiMessages.forEach((msg, index) => {
      console.log(`ChatAssistant: Processing message ${index}:`, msg);
      console.log(`ChatAssistant: Message properties - id: ${msg.id}, question: ${msg.question}, response: ${msg.response}, loading: ${msg.loading}`);
      
      // Add user message
      const userMessage = {
        id: `user-${msg.id}`,
        text: msg.question,
        isUser: true
      };
      console.log(`ChatAssistant: Adding user message:`, userMessage);
      converted.push(userMessage);

      // Add AI response or loading state
      if (msg.loading) {
        console.log('ChatAssistant: Adding loading message');
        const loadingMessage = {
          id: `loading-${msg.id}`,
          text: "Keila is thinking...",
          isUser: false,
          isLoading: true
        };
        console.log('ChatAssistant: Loading message:', loadingMessage);
        converted.push(loadingMessage);
      } else if (msg.response) {
        console.log('ChatAssistant: Adding AI response:', msg.response);
        const aiMessage = {
          id: `ai-${msg.id}`,
          text: msg.response,
          isUser: false
        };
        console.log('ChatAssistant: AI message:', aiMessage);
        converted.push(aiMessage);
      } else {
        console.log('ChatAssistant: Message has no response yet, current state:', {
          loading: msg.loading,
          response: msg.response,
          hasResponse: !!msg.response
        });
      }
    });

    console.log('ChatAssistant: Final converted messages:', converted);
    console.log('ChatAssistant: Final converted length:', converted.length);
    console.log('=== ChatAssistant: displayMessages useMemo END ===');
    return converted;
  }, [aiMessages]);

  const handleSendMessage = async (message: string) => {
    console.log('=== ChatAssistant handleSendMessage START ===');
    console.log('ChatAssistant: handleSendMessage called with message:', message);
    console.log('ChatAssistant: message length:', message.length);
    console.log('ChatAssistant: sendMessage function exists:', !!sendMessage);
    console.log('ChatAssistant: loading state:', loading);
    console.log('ChatAssistant: current aiMessages before send:', aiMessages);
    console.log('ChatAssistant: current displayMessages before send:', displayMessages);
    
    if (!message || message.trim().length === 0) {
      console.log('ChatAssistant: Empty message, aborting');
      return;
    }
    
    try {
      console.log('ChatAssistant: About to call sendMessage...');
      await sendMessage(message);
      console.log('ChatAssistant: sendMessage completed successfully');
    } catch (error) {
      console.error('ChatAssistant: Error in handleSendMessage:', error);
    }
    
    console.log('ChatAssistant: current aiMessages after send:', aiMessages);
    console.log('ChatAssistant: current displayMessages after send:', displayMessages);
    console.log('=== ChatAssistant handleSendMessage END ===');
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
            {displayMessages.map((message) => (
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
                  <p className={`text-sm ${(message as any).isLoading ? 'italic text-slate-400' : ''}`}>
                    {message.text}
                  </p>
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
