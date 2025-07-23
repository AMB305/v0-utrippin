import React from 'react';

const ExploreOurTrips: React.FC = () => {
  return (
    <section className="py-16 bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6">EXPLORE<br/>OUR TRIPS</h2>
            <p className="text-xl text-gray-300 mb-8">
              Remarkable experiences to inspire the mind
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <div className="bg-gray-600 h-48 flex items-center justify-center">
                  <span className="text-gray-400">Wild Waterways of the Amazon</span>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">9 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Wild Waterways of the Amazon</h3>
                <p className="text-gray-300 mb-4">Jungle canopies, pink dolphins & riverboat sunsets</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <div className="bg-gray-600 h-48 flex items-center justify-center">
                  <span className="text-gray-400">Art Deco Days & Neon Nights</span>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">5 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Art Deco Days & Neon Nights</h3>
                <p className="text-gray-300 mb-4">Beach mornings, Wynwood murals & Cuban cafecitos</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreOurTrips;