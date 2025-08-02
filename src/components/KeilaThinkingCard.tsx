import React from 'react';
import { Loader2 } from 'lucide-react';

interface KeilaThinkingCardProps {
  message?: string;
}

const KeilaThinkingCard: React.FC<KeilaThinkingCardProps> = ({ 
  message = "Keila is thinking..." 
}) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 animate-pulse">
      <img 
        src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
        alt="Keila Bot" 
        className="w-8 h-8 animate-float flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-purple-300">Keila</span>
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
        </div>
        <p className="text-gray-300 text-sm">{message}</p>
        <div className="mt-3 space-y-2">
          <div className="h-3 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-700/50 rounded animate-pulse w-1/2"></div>
          <div className="h-3 bg-gray-700/50 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default KeilaThinkingCard;
