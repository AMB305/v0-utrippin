import React from "react";

export default function DestinationsPage() {
  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center py-24">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-[#0055A5] mb-4">
          📍 Explore top destinations
        </h1>
        <p className="text-gray-700 mb-6">Discover your next adventure.</p>
        <button className="bg-[#0055A5] hover:bg-[#003d7a] text-white font-bold px-6 py-3 rounded-lg">
          📍 Browse Destinations
        </button>
      </div>
    </div>
  );
}
