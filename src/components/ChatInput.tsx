import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  variant?: "fixed" | "sticky";
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  loading = false,
  placeholder = "Type your message...",
  className = "",
  variant = "fixed"
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerClasses = variant === "sticky" 
    ? "sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent backdrop-blur-sm"
    : "absolute bottom-0 left-0 right-0 z-40 p-6 flex-shrink-0";

  const wrapperClasses = variant === "sticky" 
    ? "max-w-4xl mx-auto"
    : "max-w-4xl mx-auto";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={wrapperClasses}>
        <div className="bg-slate-800/70 backdrop-blur-xl border-2 border-slate-600/50 rounded-3xl p-4 flex items-center gap-4 shadow-2xl transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-blue-500/20 focus-within:bg-slate-800/90 hover:border-blue-400/50">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 focus:outline-none text-base h-auto py-3 text-lg"
            disabled={loading}
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white border-none rounded-2xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
