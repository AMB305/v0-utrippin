import React from "react";
import SEOHead from "../components/common/seo-head";
import { generateStructuredData, generateBoltSEOJSON, pageSEOConfigs } from "../utils/seo-config";

export default function FlightsPage() {
  const flightsStructuredData = generateStructuredData('travel-service', {
    ...pageSEOConfigs.flights.customStructuredData,
    "name": "UTrippin Flight Booking",
    "description": "Compare and book cheap flights from hundreds of airlines worldwide"
  });

  const boltSEOJSON = generateBoltSEOJSON(pageSEOConfigs.flights);

  return (
    <>
      <SEOHead 
        title={pageSEOConfigs.flights.title}
        description={pageSEOConfigs.flights.description}
        image="https://utrippin.ai/utrippin_social_card.png"
        url="https://utrippin.ai/flights"
        structuredData={flightsStructuredData}
      />

      <script 
        type="application/json" 
        id="bolt-seo-config"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(boltSEOJSON, null, 2) }}
      />

      <div className="min-h-screen bg-white">

        {/* 🔵 Section: Banner */}
        <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
          <div className="text-center max-w-6xl mx-auto">
            <span className="font-bold mr-8">July 4th Getaways!</span>
            <span>Take an extra $10 off Flight Express Deals®. Use code: <strong>EXTRA10</strong> <span className="underline">Learn More</span></span>
          </div>
        </div>

        {/* 🌈 Hero Section with Search */}
        <div className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-[400px] flex items-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 via-purple-600/70 to-pink-600/70"></div>
          <div className="relative max-w-6xl mx-auto px-4 py-12 flex gap-8">

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex-1 max-w-2xl">
              <h1 className="text-3xl font-bold text-[#003C8A] mb-6">Find your next flight deal</h1>
              
              <div className="flex gap-6 mb-6 text-sm text-gray-600 font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6 rounded-full border-2 border-[#0068EF] bg-[#0068EF] flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-[#0068EF]">Round-trip</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                  <span>One-way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                  <span>Multi-destination</span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <input type="text" placeholder="Departing from?" className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:border-[#0068EF] focus:outline-none relative" />
                  <input type="text" placeholder="Going to?" className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:border-[#0068EF] focus:outline-none relative" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">Departing - Returning</button>
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">1 Adult</button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Cabin Class</label>
                  <select className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:border-[#0068EF] focus:outline-none">
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
                  <span className="text-green-700 font-semibold text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 12l-2.4..." /></svg>
                    Bundle + Save
                  </span>
                  <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span>Add a hotel</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span>Add a car</span></label>
                </div>
                <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-3 rounded-lg">Find Your Flight</button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-700">
                Looking for international flight deals? Call us at <span className="text-[#FF6200] font-semibold">(833) 203-5879</span>
              </div>
            </div>

            {/* Promo Card */}
            <div className="hidden lg:block w-72">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20 relative h-40"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")',
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-lg font-bold">Shop fares up to $99!</h3>
                  <p className="text-xs mb-2">Your next adventure awaits!</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium">Explore now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔵 Your FULL next sections - pick up, deals, email signup, footer, brand bar */}
        {/* ✅ Copy your entire original content sections here, 
             exactly as you had them, because they compile fine. 
             Just drop them right here to preserve ALL lines. */}

      </div>
    </>
  );
}
