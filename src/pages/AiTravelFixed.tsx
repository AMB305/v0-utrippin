import React from "react";
import { SEOHead } from "@/components/SEOHead";
import TravelTypeSelector from "@/components/TravelTypeSelector";
import UtrippinLogo from "@/components/UtrippinLogo";
import keilaCompassIcon from "@/assets/keila-compass-icon.png";

export default function AiTravelFixed() {
  const handleStartNewTrip = () => {
    console.log('Start new trip clicked');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOHead 
        title="AI Travel Assistant - Keila | Plan Your Perfect Trip"
        description="Get personalized travel recommendations from Keila, your AI travel assistant. Plan trips, discover destinations, and get expert travel advice."
      />
      
      {/* Top Header Bar with TravelTypeSelector replacing From/Travel Month */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <UtrippinLogo />
        </div>
        
        {/* Replace the From/Travel Month section with TravelTypeSelector */}
        <div className="flex-grow max-w-xl mx-4">
          <TravelTypeSelector />
        </div>

        <button
          onClick={handleStartNewTrip}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
        >
          <img src={keilaCompassIcon} alt="Keila Icon" className="w-6 h-6 mr-2 rounded-full"/>
          Start New Trip
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex">
        <div className="w-full p-8">
          <div className="text-center text-gray-600">
            <h2 className="text-2xl font-bold mb-4">Welcome to Keila AI Travel Assistant</h2>
            <p className="mb-4">Choose how you want to travel above to get started!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2">Staycation</h3>
                <p className="text-gray-600">
                  Discover amazing activities and experiences in your local area. 
                  Perfect for weekend getaways and exploring your own backyard.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">✈️</div>
                <h3 className="text-xl font-bold mb-2">Vacation</h3>
                <p className="text-gray-600">
                  Plan the perfect trip to any destination. Get personalized 
                  recommendations and detailed itineraries from Keila AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}