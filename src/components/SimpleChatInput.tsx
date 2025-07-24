import React, { useState } from "react";
import { Send } from "lucide-react";

interface SimpleChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export const SimpleChatInput: React.FC<SimpleChatInputProps> = ({
  onSendMessage,
  placeholder = "Ask me to plan your next adventure..."
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
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full px-6 py-4 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-14"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};