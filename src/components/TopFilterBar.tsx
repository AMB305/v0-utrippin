import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TopFilterBarProps {
  onCreateTripWithAI: () => void;
}

export const TopFilterBar: React.FC<TopFilterBarProps> = ({ onCreateTripWithAI }) => {
  return (
    <div className="flex items-center gap-4 mb-6 px-4">
      <div className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
        From <strong className="ml-1 text-gray-800">Your Location</strong>
      </div>
      <div className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
        Travel month <strong className="ml-1 text-gray-800">Any Month</strong>
      </div>
      <Input
        type="text"
        placeholder="Search destinations..."
        className="flex-1 px-4 py-2 rounded-full bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Button 
        onClick={onCreateTripWithAI}
        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-full shadow hover:opacity-90 transition-all"
      >
        ✨ Create trip with AI
      </Button>
    </div>
  );
};