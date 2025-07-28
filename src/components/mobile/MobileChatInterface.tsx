import React, { useState } from 'react';
import { X, RefreshCw, Camera, Globe, MapPin, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileItineraryDisplay } from './MobileItineraryDisplay';

interface MobileChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  messages: any[];
  isLoading: boolean;
  onQuickReply?: (reply: string) => void;
}

export const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  messages,
  isLoading,
  onQuickReply
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const suggestionCards = [
    {
      icon: '🏖️',
      category: 'Beach Vacation',
      question: 'Plan me a trip to Cancun',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: '🏔️',
      category: 'Adventure',
      question: 'Plan a mountain adventure in Colorado for 5 days',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: '🍜',
      category: 'Food & Culture',
      question: 'Plan a culinary trip to Tokyo on a $3000 budget',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      icon: '🏰',
      category: 'Europe',
      question: 'Plan a romantic trip to Paris for my anniversary',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const handleSuggestionClick = (question: string) => {
    onSendMessage(question);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleRefreshQuestions = () => {
    // Could implement question refresh logic here
    console.log('Refreshing questions...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col w-full h-full h-[100dvh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <img 
              src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
              alt="Keila" 
              className="w-full h-full" 
            />
          </div>
          <span className="font-semibold text-gray-900">Keila</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 w-full">
        {messages.length === 0 ? (
          <>
            {/* Greeting */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">Hi there!</h1>

            {/* Suggestion Cards */}
            <div className="space-y-3">
              {suggestionCards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(card.question)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors hover:bg-gray-50 ${card.color}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{card.icon}</span>
                    <span className="font-medium text-gray-600">{card.category}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">{card.question}</p>
                </button>
              ))}
            </div>

            {/* Refresh Questions Button */}
            <Button
              variant="outline"
              onClick={handleRefreshQuestions}
              className="w-full mt-6 text-gray-600 border-gray-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Questions
            </Button>

            {/* Feature Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-xs">Recognize Image</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                <Globe className="w-5 h-5 mb-1" />
                <span className="text-xs">Live Translate</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                <MapPin className="w-5 h-5 mb-1" />
                <span className="text-xs">Live Guide</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{message.question}</p>
                  </div>
                </div>

                {/* Comprehensive Itinerary */}
                {message.comprehensiveItinerary && (
                  <div className="w-full">
                    <MobileItineraryDisplay 
                      itinerary={message.comprehensiveItinerary}
                      onQuickReply={onQuickReply}
                    />
                  </div>
                )}

                {/* AI Response */}
                {message.response && !message.comprehensiveItinerary && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm text-gray-800 whitespace-pre-line">{message.response}</p>
                      
                      {/* Quick Replies */}
                      {message.quickReplies && message.quickReplies.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.quickReplies.map((reply: string, replyIndex: number) => (
                            <Button
                              key={replyIndex}
                              variant="outline"
                              size="sm"
                              className="mr-2 mb-2 text-xs"
                              onClick={() => onQuickReply ? onQuickReply(reply) : onSendMessage(reply)}
                            >
                              {reply}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading indicator */}
                {message.loading && (
                  <div className="flex justify-start">
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
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0 w-full">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything you want..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1 p-2 h-8 w-8 rounded-full"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="rounded-full w-10 h-10 p-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};