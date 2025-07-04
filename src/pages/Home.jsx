import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1502920917128-1aa500764b8e?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-md p-12 rounded-xl text-center">
        <h1 className="text-4xl font-bold text-[#0055A5] mb-4">Welcome to Utrippin</h1>
        <p className="text-lg text-gray-700 mb-6">Book flights, hotels, cars, packages & more</p>
        <button className="bg-[#0055A5] hover:bg-[#003d7a] text-white font-bold px-6 py-3 rounded-lg">
          Start Planning Your Trip
        </button>
      </div>
    </div>
  );
}
