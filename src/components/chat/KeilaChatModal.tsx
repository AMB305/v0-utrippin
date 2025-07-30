import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, RotateCcw } from 'lucide-react';
import { AnimatedKeila } from '../AnimatedKeila';

interface ChatMessage {
  id: string;
  question: string;
  response?: string;
  loading?: boolean;
  detailedItinerary?: any;
  isDetailedItinerary?: boolean;
  comprehensiveItinerary?: any;
  isComprehensiveItinerary?: boolean;
  showMap?: boolean;
  mapLocation?: string;
  quickReplies?: string[];
  callsToAction?: any[];
}

interface KeilaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  isLoading: boolean;
  resetSession: () => void;
}

export const KeilaChatModal: React.FC<KeilaChatModalProps> = ({ 
  isOpen, 
  onClose, 
  messages, 
  sendMessage, 
  isLoading, 
  resetSession 
}) => {
  const messagesEndRef = useRef(null);
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInput.trim()) {
      sendMessage(currentInput.trim());
      setCurrentInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <AnimatedKeila />
            <div>
              <h3 className="font-semibold text-gray-900">Keila</h3>
              <p className="text-sm text-gray-500">AI Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetSession}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Start new conversation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <AnimatedKeila />
              <p className="text-gray-600 mt-4">Hi! I'm Keila, your AI travel assistant. How can I help you plan your next adventure?</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs break-words">
                    {message.question}
                  </div>
                </div>

                {/* AI response */}
                {message.response && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs break-words">
                      {message.response}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {message.loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Ask me about your travel plans..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !currentInput.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};