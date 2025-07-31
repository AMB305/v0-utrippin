import React, { useState } from 'react';
import StaycationModal from '@/components/StaycationModal';
import VacationChat from '@/components/VacationChat';

interface TravelTypeSelectorProps {
  className?: string;
}

export default function TravelTypeSelector({ className = "" }: TravelTypeSelectorProps) {
  const [flow, setFlow] = useState('start');

  const resetFlow = () => setFlow('start');

  if (flow === 'staycation') {
    return <StaycationModal onClose={resetFlow} />;
  }

  if (flow === 'vacation') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] m-4">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Plan Your Vacation with Keila</h2>
            <button
              onClick={resetFlow}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="h-full">
            <VacationChat />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-lg font-bold mb-3 text-gray-800">How are you traveling?</h2>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setFlow('staycation')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          🏠 Staycation
        </button>
        <button
          onClick={() => setFlow('vacation')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          ✈️ Vacation
        </button>
      </div>
    </div>
  );
}