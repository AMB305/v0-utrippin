import React from 'react';

const EnhancedHeroSection: React.FC = () => {
  return (
    <section className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Put the World in Your Hands
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Find extraordinary deals for every budget. Travel more, spend less, experience everything with AI-powered travel planning.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;