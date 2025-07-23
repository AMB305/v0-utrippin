import React from 'react';

const PursuitOfFeeling: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div 
              className="h-96 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('/lovable-uploads/c7daa2f6-794c-4b40-b73c-3d3e65d2266d.png')`
              }}
            ></div>
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-8 text-gray-900">THE MELANIN<br/>COMPASS</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              For us, travel is more than a destination; it's about the joy and power of exploring the world in our melanin. The Melanin Compass is dedicated to this experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PursuitOfFeeling;