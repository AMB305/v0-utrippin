import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Home, Plane, MapPinIcon } from "lucide-react";

export const AITravelSelectorMobile = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"staycation" | "vacation">("staycation");
  const [budget, setBudget] = useState(100);
  const [groupSize, setGroupSize] = useState(1);
  const [zip, setZip] = useState("");

  const handleSubmit = () => {
    const query = new URLSearchParams({
      mode,
      budget: budget.toString(),
      groupSize: groupSize.toString(),
      ...(mode === "staycation" && zip && { zip }),
    });

    navigate(`/ai-travel?${query.toString()}`);
  };

  // Format budget display
  const formatBudget = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  // Get dynamic budget description
  const getBudgetDescription = () => {
    if (budget <= 300) return "Great for local escapes";
    if (budget <= 1000) return "Perfect for weekend getaways";
    if (budget <= 5000) return "Amazing vacation experiences";
    return "Luxury adventures await!";
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode to get zip code
          setZip("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white rounded-xl mx-4 my-4 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-white">
          Where to Next?
        </h2>
        <p className="text-base text-blue-100 opacity-90">
          Let's find your perfect adventure. Tell us a bit about it:
        </p>
      </div>

      {/* Segmented Control */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 mx-2">
        <div className="flex relative">
          <button
            onClick={() => setMode("staycation")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 flex-1 relative z-10 ${
              mode === "staycation" 
                ? "bg-white text-blue-900 shadow-lg font-semibold" 
                : "text-white/80 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            Staycation
          </button>
          <button
            onClick={() => setMode("vacation")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 flex-1 relative z-10 ${
              mode === "vacation" 
                ? "bg-white text-blue-900 shadow-lg font-semibold" 
                : "text-white/80 hover:text-white"
            }`}
          >
            <Plane className="w-4 h-4" />
            Vacation
          </button>
        </div>
      </div>

      {/* Budget Slider */}
      <div className="bg-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-lg font-medium text-white">Your Budget</label>
          <span className="text-3xl font-bold text-white bg-white/10 px-4 py-2 rounded-xl">
            {formatBudget(budget)}
          </span>
        </div>
        
        <div className="relative pt-6">
          {/* Budget value indicator that follows the slider */}
          <div 
            className="absolute -top-1 bg-white text-blue-900 px-3 py-1 rounded-lg text-sm font-semibold shadow-lg transform -translate-x-1/2"
            style={{
              left: `${((budget - 100) / (10000 - 100)) * 100}%`,
              transition: 'left 0.1s ease-out'
            }}
          >
            {formatBudget(budget)}
          </div>
          
          <input
            type="range"
            min={100}
            max={10000}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider-enhanced"
            style={{
              background: `linear-gradient(to right, #60A5FA 0%, #60A5FA ${((budget - 100) / (10000 - 100)) * 100}%, rgba(255,255,255,0.2) ${((budget - 100) / (10000 - 100)) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-white/70 mt-2">
            <span>$100</span>
            <span>$10K+</span>
          </div>
        </div>
        
        <p className="text-center text-base text-blue-200 font-medium bg-white/10 py-2 px-4 rounded-xl">
          {getBudgetDescription()}
        </p>
      </div>

      {/* Group Size */}
      <div className="bg-white/5 rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-200" />
            <span className="text-lg font-medium text-white">Group Size</span>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setGroupSize(Math.max(1, groupSize - 1))} 
              className={`w-12 h-12 rounded-full text-2xl font-bold transition-all duration-200 flex items-center justify-center touch-manipulation ${
                groupSize <= 1 
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-white/20 hover:bg-white/30 text-white active:scale-95"
              }`}
              disabled={groupSize <= 1}
            >
              −
            </button>
            <span className="text-2xl font-bold text-white min-w-[3rem] text-center bg-white/10 px-4 py-2 rounded-xl">
              {groupSize}
            </span>
            <button 
              onClick={() => setGroupSize(groupSize + 1)} 
              className="bg-white/20 hover:bg-white/30 w-12 h-12 rounded-full text-2xl font-bold transition-all duration-200 flex items-center justify-center text-white active:scale-95 touch-manipulation"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Zip Code Field - Only for Staycation */}
      {mode === "staycation" && (
        <div className="bg-white/5 rounded-2xl p-5 space-y-3">
          <label className="text-lg font-medium text-white block">Location</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Your Zip Code"
              className="w-full p-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-lg"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              maxLength={5}
            />
            <button
              onClick={handleLocationDetect}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200"
              title="Use Current Location"
            >
              <MapPinIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white text-xl font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 touch-manipulation"
      >
        <MapPin className="w-6 h-6" />
        Find My Perfect Trip
      </button>
    </div>
  );
};

// Enhanced CSS for slider
const styles = `
.slider-enhanced::-webkit-slider-thumb {
  appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: 3px solid #60A5FA;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: all 0.2s ease;
}

.slider-enhanced::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.5);
}

.slider-enhanced::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: 3px solid #60A5FA;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: all 0.2s ease;
}

.slider-enhanced::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.5);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}