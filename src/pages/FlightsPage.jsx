import React from "react";

export default function FlightsPage() {
  return (
    <div className="w-full min-h-screen bg-[url('https://images.unsplash.com/photo-1533460004985-ee4c9275bb2b?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
      {/* Container */}
      <div className="max-w-7xl mx-auto pt-12 px-4 lg:flex lg:space-x-8">
        
        {/* LEFT - Search box */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex-1">
          <h1 className="text-3xl font-bold text-[#002974] mb-6">Find your next flight deal</h1>
          
          {/* Radio Tabs */}
          <div className="flex space-x-6 mb-6 text-sm text-gray-600 font-medium">
            <label className="flex items-center space-x-2">
              <input type="radio" name="trip" defaultChecked className="accent-blue-600" />
              <span>Round-trip</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="trip" className="accent-blue-600" />
              <span>One-way</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="trip" className="accent-blue-600" />
              <span>Multi-destination</span>
            </label>
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-4">
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
              <input
                type="text"
                placeholder="Departing from?"
                className="flex-1 border border-gray-300 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <input
                type="text"
                placeholder="Going to?"
                className="flex-1 border border-gray-300 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
              <input
                type="text"
                placeholder="Departing - Returning"
                className="flex-1 border border-gray-300 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <select className="flex-1 border border-gray-300 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-600 outline-none">
                <option>1 Adult</option>
                <option>2 Adults</option>
              </select>
              <select className="flex-1 border border-gray-300 rounded-xl py-4 px-4 focus:ring-2 focus:ring-blue-600 outline-none">
                <option>Economy</option>
                <option>Business</option>
              </select>
            </div>
          </div>

          {/* Bundle + Save */}
          <div className="bg-green-100 rounded-xl p-4 flex flex-wrap items-center space-x-6 mb-6">
            <span className="text-green-900 font-semibold flex items-center space-x-1">
              <span>💰</span>
              <span>Bundle + Save</span>
            </span>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-600" />
              <span>Add hotel</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-600" />
              <span>Add car</span>
            </label>
          </div>

          {/* CTA */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-4 rounded-xl text-lg transition">
            Find Your Flight
          </button>

          {/* Call line */}
          <p className="text-center text-sm text-gray-700 mt-6">
            Looking for international flight deals? Call us at <span className="text-[#FF6200] font-bold">(833) 203-5879</span>
          </p>
        </div>

        {/* RIGHT - Promo card */}
        <div className="hidden lg:flex items-center justify-center mt-8 lg:mt-0">
          <div className="bg-[#FF6200] text-white rounded-3xl p-8 w-72 flex flex-col items-center space-y-4">
            <span className="bg-white text-[#FF6200] text-xs font-bold px-3 py-1 rounded-full">Limited Time</span>
            <h3 className="text-xl font-bold text-center">✈️ Flight Deal Alert</h3>
            <p className="text-center">NYC to Miami</p>
            <p className="text-3xl font-bold">$89</p>
            <button className="bg-white text-[#FF6200] font-bold px-6 py-3 rounded-xl">View Deal</button>
          </div>
        </div>
      </div>

      {/* Footer style banner (optional mimic of Priceline) */}
      <div className="bg-white text-center mt-12 py-6">
        <p className="text-gray-700">
          More exclusive deals available on Utrippin. Start exploring your next adventure today!
        </p>
      </div>
    </div>
  );
}
