import React, { useState } from 'react';
import { Home, Plane, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BudgetPlannerTool = () => {
  const [tripType, setTripType] = useState<'staycation' | 'vacation'>('staycation');
  const [budget, setBudget] = useState(3000);
  const [groupSize, setGroupSize] = useState(1);

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  const getBudgetDescription = (amount: number) => {
    if (amount < 500) return "Perfect for local adventures";
    if (amount < 1500) return "Great for regional getaways";
    if (amount < 5000) return "Perfect for a nice staycation day";
    if (amount < 15000) return "Full vacation packages with flights available";
    return "Luxury experiences await";
  };

  const handleGenerateItinerary = () => {
    // This will integrate with the Keila Bot backend
    console.log('Generating itinerary with:', { tripType, budget, groupSize });
    // TODO: Integrate with Keila Bot API
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Plan Your Perfect
          </h2>
          <p className="text-lg text-gray-600 mb-1">
            Staycation or Vacation
          </p>
          <p className="text-sm text-gray-500">
            Set your budget and group size to discover amazing destinations
          </p>
        </div>

        {/* Trip Type Toggle */}
        <div className="mb-6">
          <div className="bg-gray-100 p-1 rounded-full flex">
            <button
              onClick={() => setTripType('staycation')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tripType === 'staycation'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Home size={16} />
              Staycation
            </button>
            <button
              onClick={() => setTripType('vacation')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tripType === 'vacation'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Plane size={16} />
              Vacation
            </button>
          </div>
        </div>

        {/* Budget Range */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">Budget Range</h3>
            <span className="text-2xl font-bold text-gray-900">{formatBudget(budget)}</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((budget - 100) / (100000 - 100)) * 100}%, #e5e7eb ${((budget - 100) / (100000 - 100)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$100</span>
              <span>$100K+</span>
            </div>
          </div>
          
          <p className="text-center text-blue-600 mt-2 text-sm font-medium">
            {getBudgetDescription(budget)}
          </p>
        </div>

        {/* Group Size */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-600">👥</span>
            <h3 className="text-lg font-medium text-gray-900">Group Size</h3>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              disabled={groupSize <= 1}
            >
              <Minus size={16} />
            </button>
            
            <span className="text-3xl font-bold text-gray-900 w-12 text-center">{groupSize}</span>
            
            <button
              onClick={() => setGroupSize(groupSize + 1)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={handleGenerateItinerary}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium rounded-lg transition-all duration-200"
          >
            Generate Perfect Itinerary
          </Button>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </section>
  );
};

export default BudgetPlannerTool;