import React from 'react';

export const KeilaThinking: React.FC = () => {
  return (
    <div className="flex justify-start px-4 py-3">
      <div className="bg-gray-900 px-4 py-3 rounded-2xl max-w-[80%] border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
              alt="Keila Bot" 
              className="w-6 h-6 animate-pulse"
            />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-300">Keila is thinking</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};