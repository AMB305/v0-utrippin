import React from "react";

export default function PackagesPage() {
  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center py-24">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#0055A5] mb-4 flex items-center">
          🌎 Find your next travel package
        </h1>
        <form className="space-y-3">
          <input type="text" placeholder="Destination" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0055A5]" />
          <div className="flex flex-col md:flex-row gap-3">
            <input type="date" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
            <input type="date" className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#0055A5]" />
          </div>
          <button className="bg-[#0055A5] hover:bg-[#003d7a] text-white font-bold px-6 py-3 rounded-lg w-full flex justify-center items-center">
            🌎 Search Packages
          </button>
        </form>
      </div>
    </div>
  );
}
