import React, { useState } from "react";
import { BudgetSlider } from "@/components/BudgetSlider";

import { SmartImage } from "@/components/SmartImage";
import { SEOHead } from "@/components/SEOHead";
import { fallbackTrips } from "@/data/fallbackTrips";
import destinations from "@/data/destinations";
import { affiliateConfig } from "@/config/affiliateConfig";
import keilaLogo from "@/assets/Keila_logo.png";

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

          {/* Keila Hero Section */}
          <div className="mb-12 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 rounded-3xl p-12 text-center">
            <div className="flex justify-center items-center mb-6">
              <img src={keilaLogo} alt="Keila" className="h-16 w-16 mr-4" />
              <h2 className="text-5xl font-bold text-slate-900">Keila</h2>
            </div>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              Your most comprehensive and free AI Trip Planner by <span className="text-blue-600 font-semibold">Trip.com</span>
            </p>
            
            <div className="flex items-center justify-center bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="bg-slate-900 p-4 rounded-xl mr-6">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-slate-900 rounded-sm"></div>
                    ))}
                  </div>
                  <div className="absolute bg-blue-600 text-white text-xs px-2 py-1 rounded mt-8 ml-8">
                    Trip
                  </div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Experience AI travel magic now on the Trip.com app
                </h3>
                <p className="text-slate-600 text-sm">
                  Scan the QR code using your phone's camera.
                </p>
              </div>
            </div>
            
            <p className="text-slate-600 mt-6 text-sm">
              🔍 Find out more
            </p>
          </div>

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

        </div>
      </div>
    </>
  );
};

export default ExploreAiTravel;