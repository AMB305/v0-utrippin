import React from 'react';

const ExploreOurTrips: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Our Trips</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-200 h-48 flex items-center justify-center">
              <span className="text-blue-600">Trip Image 1</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">European Adventure</h3>
              <p className="text-gray-600 mb-4">Discover the charm of Europe with our curated packages</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">$1,299</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Explore
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-200 h-48 flex items-center justify-center">
              <span className="text-green-600">Trip Image 2</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Asian Getaway</h3>
              <p className="text-gray-600 mb-4">Experience the wonders of Asia on a budget</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">$899</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Explore
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-200 h-48 flex items-center justify-center">
              <span className="text-purple-600">Trip Image 3</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Beach Paradise</h3>
              <p className="text-gray-600 mb-4">Relax on pristine beaches around the world</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">$699</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Explore
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