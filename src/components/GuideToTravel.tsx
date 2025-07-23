import React from 'react';

const GuideToTravel: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-4 text-gray-900">OUR GUIDE TO<br/>BUDGET TRAVEL</h2>
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wide">THE SMART TRAVEL DEAL EXPERTS</p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Budget travel is personal. It means something different for each and every one of us. For some, budget travel is finding peaceful solitude through a remote corner of the world, while for others it's the thrill of discovering hidden gems in bustling cities.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team of travel deal specialists are connoisseurs of value, curating unparalleled experiences, tailor made itineraries and bespoke adventures. Whether you seek the opulence of a luxury resort at budget prices or the thrill of an exclusive adventure that won't break the bank, we'll craft a journey that exceeds your expectations.
            </p>
            <button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors">
              CONTINUE READING
            </button>
          </div>
          <div className="relative">
            <div 
              className="h-96 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('/lovable-uploads/c7daa2f6-794c-4b40-b73c-3d3e65d2266d.png')`
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideToTravel;