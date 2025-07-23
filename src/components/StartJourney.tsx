import React from 'react';

const StartJourney: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Start Your Journey Today</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of travelers who have discovered amazing deals and unforgettable experiences through Utrippin.ai
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Free
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default StartJourney;