import React, { useState } from "react";
import { Send, Paperclip } from "lucide-react";

interface SimpleChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SimpleChatInput: React.FC<SimpleChatInputProps> = ({
  onSendMessage,
  placeholder = "Ask me to plan your next adventure...",
  isLoading = false
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== SimpleChatInput handleSubmit START ===');
    console.log('SimpleChatInput: Form submitted with message:', message);
    console.log('SimpleChatInput: message.trim():', message.trim());
    console.log('SimpleChatInput: onSendMessage function exists:', !!onSendMessage);
    
    if (message.trim()) {
      console.log('SimpleChatInput: About to call onSendMessage with:', message.trim());
      onSendMessage(message.trim());
      console.log('SimpleChatInput: onSendMessage called, clearing message');
      setMessage("");
    } else {
      console.log('SimpleChatInput: Message is empty, not sending');
    }
    console.log('=== SimpleChatInput handleSubmit END ===');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Paperclip className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-14 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </form>
    </div>
  );
};
