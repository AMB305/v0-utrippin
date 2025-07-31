import React, { useState } from "react";
import { BudgetSlider } from "@/components/BudgetSlider";
import { SimpleChatInput } from "@/components/SimpleChatInput";
import { SmartImage } from "@/components/SmartImage";
import { SEOHead } from "@/components/SEOHead";
import SimpleReligiousCards from "@/components/SimpleReligiousCards";
import { fallbackTrips } from "@/data/fallbackTrips";
import destinations from "@/data/destinations";
import { affiliateConfig } from "@/config/affiliateConfig";

const ExploreAiTravel = () => {
  const [budget, setBudget] = useState(3000);
  const [lastQuery, setLastQuery] = useState("");

  const handlePlanAI = (destination: string) => {
    setLastQuery(`Plan me a trip to ${destination} under $${budget}`);
    // In real: call your generateTrips / chat
    alert(`(Mock) Planning AI trip to ${destination} with budget $${budget}`);
  };

  const buildExediaUrl = (type: 'hotels' | 'flights' | 'cars', destination: string) => {
    const { clickref, camref, baseUrl } = affiliateConfig.expedia;
    
    switch (type) {
      case 'hotels':
        return `${baseUrl}/Hotel-Search?destination=${encodeURIComponent(destination)}&clickref=${clickref}&camref=${camref}`;
      case 'flights':
        return `${baseUrl}/Flights-Search?flight-type=on&trip=roundtrip&leg1=from:,to:${encodeURIComponent(destination)}&clickref=${clickref}&camref=${camref}`;
      case 'cars':
        return `${baseUrl}/Cars?CAMREF=${camref}&destination=${encodeURIComponent(destination)}`;
      default:
        return `${baseUrl}/?clickref=${clickref}&camref=${camref}`;
    }
  };

  return (
    <>
      <SEOHead
        title="Explore Destinations and Plan with AI | Utrippin"
        description="Discover top destinations, explore curated trips and plan your next adventure with our AI travel assistant."
        canonical="https://utrippin.ai/explore"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">

          <h1 className="text-4xl font-bold mb-6 text-center">
            Explore Destinations & Plan with AI
          </h1>

          {/* Budget Trips */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Curated Trips for Your Budget
            </h2>
            <BudgetSlider
              budget={budget}
              onBudgetChange={setBudget}
              min={500}
              max={1000000}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {fallbackTrips
                .filter((trip) => trip.budget <= budget)
                .slice(0, 6)
                .map((trip, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/40 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-400/40 transition shadow-lg hover:shadow-xl"
                  >
                    <h3 className="text-lg font-semibold mb-2">{trip.name}</h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {trip.summary}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(trip.enhanced_flights_url, "_blank")}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl text-xs"
                        title="View Flights"
                      >
                        ✈️
                      </button>
                      <button
                        onClick={() => window.open(trip.enhanced_hotels_url, "_blank")}
                        className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl text-xs"
                        title="View Hotels"
                      >
                        🏨
                      </button>
                      <button
                        onClick={() => window.open(buildExediaUrl('cars', trip.destination || trip.name), "_blank")}
                        className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl text-xs"
                        title="View Cars"
                      >
                        🚗
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Explore Destinations */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.slice(0, 6).map((dest, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-blue-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/30 transition duration-300"
                >
                  <SmartImage
                    destination={dest.name}
                    description={dest.description}
                    tags={dest.tags}
                    className="h-48 w-full object-cover"
                    alt={dest.name}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {dest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handlePlanAI(dest.name)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl shadow-md transition"
                      >
                        Plan with AI
                      </button>
                      <button
                        onClick={() => window.open(buildExediaUrl('hotels', dest.name), "_blank")}
                        className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-xl shadow-md transition"
                      >
                        Book on Expedia
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Religious Destinations Test */}
          <SimpleReligiousCards />

          {/* AI Travel Assistant */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Try our AI Travel Assistant
            </h2>
            <SimpleChatInput
              onSendMessage={(msg) => {
                setLastQuery(msg);
                alert(`(Mock) Chat: ${msg}`);
              }}
              placeholder="Ask me to plan a weekend getaway..."
            />
            {lastQuery && (
              <div className="mt-4 text-center text-slate-400 text-sm">
                Last query: "{lastQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreAiTravel;