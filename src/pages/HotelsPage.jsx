import React from "react";

export default function HotelsPage() {
  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center py-24">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#0055A5] mb-4 flex items-center">
            🏨 Find your next hotel deal
          </h1>
          <div className="flex space-x-4 mb-4">
            <button className="bg-[#0055A5] text-white font-bold px-4 py-2 rounded-lg">Hotels</button>
            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">Resorts</button>
            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">Boutiques</button>
          </div>
          <form className="space-y-3">
            <input type="text" placeholder="Where to?" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0055A5]" />
            <div className="flex flex-col md:flex-row gap-3">
              <input type="date" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
              <input type="date" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
            </div>
            <select className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0055A5]">
              <option>2 Guests, 1 Room</option>
              <option>4 Guests, 2 Rooms</option>
            </select>
            <button className="bg-[#0055A5] hover:bg-[#003d7a] text-white font-bold px-6 py-3 rounded-lg w-full flex justify-center items-center">
              🏨 Search Hotels
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
