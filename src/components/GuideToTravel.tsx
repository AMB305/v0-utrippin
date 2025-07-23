import React from 'react';

const GuideToTravel: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Your Guide to Travel</h2>
            <p className="text-lg text-gray-600 mb-6">
              From planning to booking, we're your complete travel companion. Get personalized recommendations and insider tips for every destination.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Learn More
            </button>
          </div>
          <div className="bg-green-100 h-64 rounded-lg flex items-center justify-center">
            <span className="text-green-600">Guide to Travel Image</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideToTravel;