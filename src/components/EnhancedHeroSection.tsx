import React from 'react';

const EnhancedHeroSection: React.FC = () => {
  return (
    <section className="hidden md:block relative h-screen bg-cover bg-center" style={{
      backgroundImage: `url('/lovable-uploads/573e9712-ddbd-4bf1-98ab-349f34c3539c.png')`
    }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8 tracking-wide">
            YOUR WORLD<br/>
            WITHIN REACH
          </h1>
          <button className="border-2 border-white text-white px-8 py-4 text-lg font-medium tracking-wider hover:bg-white hover:text-black transition-colors">
            BOOK FLIGHT NOW
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;