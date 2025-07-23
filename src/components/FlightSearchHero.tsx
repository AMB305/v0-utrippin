import React from 'react';

const FlightSearchHero: React.FC = () => {
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">
            Find Your Perfect Flight
          </h2>
          <p className="text-xl mb-8">
            Search and compare flights from hundreds of airlines
          </p>
          <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input 
                  type="text" 
                  placeholder="Departure city"
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input 
                  type="text" 
                  placeholder="Destination city"
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                Search Flights
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightSearchHero;