import React from "react";

export default function FlightsPage() {
  return (
    <div className="font-['Roboto']">
      {/* HERO WITH BACKGROUND */}
      <div className="bg-[url('https://images.unsplash.com/photo-1533460004985-ee4c9275bb2b?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center py-24">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#0055A5] mb-4 flex items-center">
              ✈️ Find your next flight deal
            </h1>
            <div className="flex space-x-4 mb-4">
              <button className="bg-[#0055A5] text-white font-bold px-4 py-2 rounded-lg">Round-trip</button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">One-way</button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">Multi-destination</button>
            </div>
            <div className="bg-green-100 p-4 rounded-lg flex justify-between items-center mb-4">
              <div className="font-bold text-green-800 flex items-center">
                💰 Bundle + Save
                <label className="ml-4"><input type="checkbox" className="accent-[#0055A5] mr-1" />Add hotel</label>
                <label className="ml-4"><input type="checkbox" className="accent-[#0055A5] mr-1" />Add car</label>
              </div>
              <span className="text-green-800 font-semibold">Save up to $625</span>
            </div>
            <form className="space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <input type="text" placeholder="From" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
                <input type="text" placeholder="To" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input type="date" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
                <input type="date" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
                <select className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]">
                  <option>1 Adult, Economy</option>
                  <option>2 Adults, Business</option>
                </select>
              </div>
              <button className="bg-[#0055A5] hover:bg-[#003d7a] text-white font-bold px-6 py-3 rounded-lg w-full flex justify-center items-center">
                🔍 Search Flights
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Looking for international deals? Call us at <span className="text-[#FF6200] font-semibold">(833) 203-5879</span>
            </p>
          </div>
          <div className="hidden md:flex w-64 bg-[#FF6200] text-white rounded-2xl p-6 flex-col justify-center items-center">
            <span className="bg-white text-[#FF6200] px-3 py-1 rounded-full text-xs font-bold mb-2">Limited Time</span>
            <h3 className="text-xl font-bold mb-1">✈️ Flight Deal Alert</h3>
            <p className="mb-2">NYC to Miami</p>
            <p className="text-2xl font-bold mb-4">$89</p>
            <button className="bg-white text-[#FF6200] font-bold px-4 py-2 rounded-lg">View Deal</button>
          </div>
        </div>
      </div>

      {/* PICK UP SECTION */}
      <div className="bg-blue-50 py-10 mt-12 rounded-xl">
        <div className="max-w-5xl mx-auto space-y-4 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#0055A5]">Pick up where you left off</h2>
            <button className="bg-white text-[#0055A5] border border-[#0055A5] font-bold px-4 py-2 rounded-full hover:bg-[#0055A5] hover:text-white">
              View All Recent Activity
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-[#E6F0FA] p-3 rounded-full">
                ✈️
              </div>
              <div>
                <h3 className="font-bold text-[#001B38]">Fort Lauderdale, FL (FLL) - Christiansted, VQ (STX)</h3>
                <p className="text-gray-600 text-sm">Round trip flight</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <div className="text-xs text-gray-500 font-bold">DEPART</div>
                <div className="text-sm font-bold text-[#001B38]">Thu, Jul 17, 2025</div>
                <div className="text-xs">FLL → STX</div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <div className="text-xs text-gray-500 font-bold">RETURN</div>
                <div className="text-sm font-bold text-[#001B38]">Fri, Aug 22, 2025</div>
                <div className="text-xs">STX → FLL</div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <div className="text-sm font-bold text-[#001B38]">1 Adult</div>
                <div className="text-xs text-gray-600">Economy</div>
              </div>
            </div>
            <button className="bg-[#0055A5] hover:bg-[#003d7a] text-white font-bold px-6 py-3 rounded-lg">
              Continue Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
