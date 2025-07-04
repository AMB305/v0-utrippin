import React, { useState } from "react";

export default function MultiSearch() {
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: '✈️' },
    { id: 'hotels', label: 'Hotels', icon: '🏨' },
    { id: 'cars', label: 'Cars', icon: '🚗' },
    { id: 'packages', label: 'Packages', icon: '🌎' },
    { id: 'cruises', label: 'Cruises', icon: '🚢' },
    { id: 'experiences', label: 'Experiences', icon: '🎯' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 text-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0068EF] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="space-y-4">
        {activeTab === 'flights' && <FlightSearch />}
        {activeTab === 'hotels' && <HotelSearch />}
        {activeTab === 'cars' && <CarSearch />}
        {activeTab === 'packages' && <PackageSearch />}
        {activeTab === 'cruises' && <CruiseSearch />}
        {activeTab === 'experiences' && <ExperienceSearch />}
      </div>
    </div>
  );
}

function FlightSearch() {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Departing from?" 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Going to?" 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="date" 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none">
            <option>1 Adult</option>
            <option>2 Adults</option>
            <option>3 Adults</option>
          </select>
        </div>
      </div>
      <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
        Find Your Flight
      </button>
    </>
  );
}

function HotelSearch() {
  return (
    <>
      <input 
        type="text" 
        placeholder="Where to?" 
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
      />
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Check-in"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Check-out"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
      </div>
      <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
        🏨 Search Hotels
      </button>
    </>
  );
}

function CarSearch() {
  return (
    <>
      <input 
        type="text" 
        placeholder="Pick-up location" 
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
      />
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Pick-up date"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Drop-off date"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
      </div>
      <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
        🚗 Search Cars
      </button>
    </>
  );
}

function PackageSearch() {
  return (
    <>
      <input 
        type="text" 
        placeholder="Destination" 
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
      />
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Departure date"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Return date"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
      </div>
      <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
        🌎 Search Packages
      </button>
    </>
  );
}

function CruiseSearch() {
  return (
    <>
      <input 
        type="text" 
        placeholder="Destination or cruise line" 
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
      />
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="Departure date"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none">
            <option>Any duration</option>
            <option>3-5 days</option>
            <option>6-8 days</option>
            <option>9-14 days</option>
          </select>
        </div>
      </div>
      <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
        🚢 Search Cruises
      </button>
    </>
  );
}

function ExperienceSearch() {
  return (
    <>
      <input 
        type="text" 
        placeholder="Where do you want to explore?" 
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
      />
      <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
        <div className="flex-1">
          <input 
            type="date" 
            placeholder="When?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none">
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>
        </div>
      </div>
      <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
        🎯 Search Experiences
      </button>
    </>
  );
}