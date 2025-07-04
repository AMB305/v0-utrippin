import React from "react";

export default function FlightsPage() {
  return (
    <>
      {/* Inline fallback styles just in case */}
      <style>{`
        .rounded-3xl { border-radius: 1.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
        .text-blue-600 { color: #2563EB; }
        .bg-blue-600 { background-color: #2563EB; }
        .bg-[#FF6200] { background-color: #FF6200; }
        .text-[#002974] { color: #002974; }
        .bg-lime-200 { background-color: #D9F99D; }
        .text-green-700 { color: #15803D; }
        .bg-green-700 { background-color: #15803D; }
        .border-slate-300 { border-color: #cbd5e1; }
      `}</style>

      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533460004985-ee4c9275bb2b?auto=format&fit=crop&w=1950&q=80')" }}>
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="bg-white shadow-lg rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1 w-full">
              <h1 className="text-3xl font-bold text-[#002974] mb-6">Find your next flight deal</h1>
              <div className="flex space-x-4 mb-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full">Round-trip</button>
                <button className="text-[#002974] border border-[#002974] px-4 py-2 rounded-full hover:bg-[#002974] hover:text-white">One-way</button>
                <button className="text-[#002974] border border-[#002974] px-4 py-2 rounded-full hover:bg-[#002974] hover:text-white">Multi-destination</button>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                <input type="text" placeholder="Departing from?" className="flex-1 border-2 border-slate-300 rounded-xl p-3 mb-4 md:mb-0" />
                <input type="text" placeholder="Going to?" className="flex-1 border-2 border-slate-300 rounded-xl p-3" />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                <input type="text" placeholder="Departing - Returning" className="flex-1 border-2 border-slate-300 rounded-xl p-3 mb-4 md:mb-0" />
                <select className="flex-1 border-2 border-slate-300 rounded-xl p-3 mb-4 md:mb-0">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                </select>
                <select className="flex-1 border-2 border-slate-300 rounded-xl p-3">
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </div>

              <div className="bg-lime-200 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-700 font-bold">💰 Bundle + Save</span>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" /> Add hotel
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" /> Add car
                </label>
              </div>

              <button className="bg-blue-600 hover:bg-[#002974] text-white font-bold w-full py-4 rounded-xl">
                Find Your Flight
              </button>
            </div>

            <div className="hidden md:block w-72">
              <div className="bg-[#FF6200] text-white rounded-3xl p-6 flex flex-col justify-center items-center h-full">
                <span className="bg-white text-[#FF6200] px-3 py-1 rounded-full text-xs font-bold mb-2">Limited Time</span>
                <h3 className="text-xl font-bold mb-1">✈️ Flight Deal Alert</h3>
                <p className="mb-2">NYC to Miami</p>
                <p className="text-2xl font-bold mb-4">$89</p>
                <button className="bg-white text-[#FF6200] font-bold px-4 py-2 rounded-xl">View Deal</button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-[#002974] mt-6 bg-white rounded-xl py-4 shadow-lg">
            Looking for international flight deals? Call us at <span className="text-[#FF6200] font-semibold">(833) 203-5879</span>
          </p>
        </div>
      </div>
    </>
  );
}
