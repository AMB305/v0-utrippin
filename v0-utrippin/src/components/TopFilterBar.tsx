import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TopFilterBarProps {
  onCreateTripWithAI: () => void;
}

export const TopFilterBar: React.FC<TopFilterBarProps> = ({ onCreateTripWithAI }) => {
  return (
    <div className="flex items-center gap-4 mb-6 px-4">
      <div className="flex items-center space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Staycation
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Vacation
        </button>
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
