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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}