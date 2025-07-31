import React, { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatAI } from "@/hooks/useChatAI";
import UtrippinLogo from "@/components/UtrippinLogo";
import keilaCompassIcon from "@/assets/keila-compass-icon.png";
import StaycationModal from "@/components/StaycationModal";
import VacationChat from "@/components/VacationChat";

export default function AiTravel() {
  const { resetSession } = useChatAI();
  const isMobile = useIsMobile();
  
  // New state for managing travel flow
  const [flow, setFlow] = useState('start');
  
  // Function to reset the flow back to the start
  const resetFlow = () => setFlow('start');

  const handleStartNewTrip = () => {
    resetSession();
    resetFlow();
  };

  // Render content based on the current flow state
  const renderFlow = () => {
    switch (flow) {
      case 'staycation':
        return <StaycationModal onClose={resetFlow} />;
      case 'vacation':
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <VacationChat />
          </div>
        );
      default:
        // The initial choice buttons - replaces the old From/Travel Month fields
        return (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">How are you traveling?</h1>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setFlow('staycation')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-12 rounded-xl text-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                🏠 Staycation
                <div className="text-sm mt-2 opacity-90">Explore your local area</div>
              </button>
              <button
                onClick={() => setFlow('vacation')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-xl text-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                ✈️ Vacation
                <div className="text-sm mt-2 opacity-90">Travel somewhere new</div>
              </button>
            </div>
          </div>
        );
    }
  };

  // For mobile users, show different interface
  if (isMobile) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SEOHead 
          title="AI Travel Assistant - Keila | Plan Your Perfect Trip"
          description="Get personalized travel recommendations from Keila, your AI travel assistant. Plan trips, discover destinations, and get expert travel advice."
        />
        {renderFlow()}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOHead 
        title="AI Travel Assistant - Keila | Plan Your Perfect Trip"
        description="Get personalized travel recommendations from Keila, your AI travel assistant. Plan trips, discover destinations, and get expert travel advice."
      />
      
      {flow === 'start' && (
        <>
          {/* Top Header Bar */}
          <header className="bg-white shadow-sm p-4 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <UtrippinLogo />
            </div>
            
            {/* The main choice section - this replaces the old From/Travel Month */}
            <div className="flex-grow max-w-xl mx-4">
              <div className="text-center">
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
        </>
      )}
      
      {flow !== 'start' && renderFlow()}
    </div>
  );
}