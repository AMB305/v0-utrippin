import React from 'react';

const SwipeToTravelHero: React.FC = () => {
  return (
    <section className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Swipe to Travel
          </h1>
          <p className="text-lg mb-6">
            Discover amazing deals on mobile
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default SwipeToTravelHero;