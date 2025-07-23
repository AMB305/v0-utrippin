import React from 'react';

const ReadyToStart: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Next Adventure?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Don't wait any longer. Start planning your dream trip today with our AI-powered travel assistant.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Planning Now
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-8 text-sm opacity-80">
          <p>Join over 100,000 satisfied travelers worldwide</p>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStart;