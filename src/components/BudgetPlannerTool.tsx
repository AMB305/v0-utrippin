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
    <section className="py-10 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight text-gray-900">
            Plan Your Perfect
          </h2>
          <div className="text-gray-900 text-xl font-bold mb-8">
            Staycation or Vacation
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Set your budget and group size to discover amazing destinations
          </p>
        </div>

        {/* Interactive Tool Container */}
        <div className="bg-gray-50 rounded-2xl p-8 mx-auto max-w-3xl" style={{
          boxShadow: '0 10px 25px -5px rgba(111, 123, 255, 0.1), 0 10px 10px -5px rgba(111, 123, 255, 0.04)'
        }}>
          {/* Trip Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-2 rounded-2xl flex">
              <button
                onClick={() => setTripType('staycation')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  tripType === 'staycation'
                    ? 'border border-gray-900 text-gray-900 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home size={20} />
                Staycation
              </button>
              <button
                onClick={() => setTripType('vacation')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  tripType === 'vacation'
                    ? 'border border-gray-900 text-gray-900 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plane size={20} />
                Vacation
              </button>
            </div>
          </div>

          {/* Budget Range */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light">Budget Range</h3>
              <span className="text-3xl font-bold">{formatBudget(budget)}</span>
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
                  background: `linear-gradient(to right, #374151 0%, #374151 ${((budget - 100) / (100000 - 100)) * 100}%, #e5e7eb ${((budget - 100) / (100000 - 100)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$100</span>
                <span>$1.0M</span>
              </div>
            </div>
            
            <p className="text-center text-orange-400 mt-2 font-medium">
              {getBudgetDescription(budget)}
            </p>
          </div>

          {/* Group Size */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600">👥</span>
              <h3 className="text-2xl font-light">Group Size</h3>
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center transition-colors"
                disabled={groupSize <= 1}
              >
                <Minus size={20} />
              </button>
              
              <span className="text-4xl font-bold w-16 text-center">{groupSize}</span>
              
              <button
                onClick={() => setGroupSize(groupSize + 1)}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={handleGenerateItinerary}
              className="bg-gray-900 text-white hover:bg-gray-700 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300"
            >
              Generate Perfect Itinerary
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.3);
        }
      `}</style>
    </section>
  );
};

export default BudgetPlannerTool;