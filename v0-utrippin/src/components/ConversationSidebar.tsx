import React from "react";
import { Button } from "@/components/ui/button";
import UtrippinLogo from "@/components/UtrippinLogo";
import { Plus, MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  onNewConversation: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations = [],
  onNewConversation
}) => {
  const recentTrips = [
    "Weekend getaway to Tokyo",
    "Luxury stay in Bali", 
    "Find the cheapest time to fly to Singapore",
    "Business trip to Seoul"
  ];

  return (
    <div className="w-full max-w-[300px] h-full bg-slate-900 flex flex-col border-r border-slate-700/50 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-center mb-6">
          <UtrippinLogo />
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start a new plan
        </Button>
      </div>

      {/* Previous Conversations */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-slate-400 text-xs font-medium mb-4 uppercase tracking-wider">
            No trip plans yet
          </h3>
          
          <div className="space-y-3">
            {recentTrips.map((trip, index) => (
              <div
                key={index}
                className="text-slate-300 text-sm py-4 px-4 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition-all duration-300 border border-transparent hover:border-slate-700/50 hover:shadow-md"
              >
                {trip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700/50 space-y-3">
        <button className="w-full text-left text-slate-400 text-xs py-3 px-4 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 flex items-center gap-3 hover:text-slate-300">
          <MessageSquare className="h-4 w-4" />
          Send feedback
        </button>
        
        <div className="text-slate-500 text-xs space-y-2">
          <p>©2025 Utrippin.AI</p>
          <div className="flex gap-4 flex-wrap">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms & Conditions</span>
          </div>
          <p className="hover:text-slate-400 cursor-pointer transition-colors">How Utrippin.AI works</p>
        </div>
      </div>
    </div>
  );
};
