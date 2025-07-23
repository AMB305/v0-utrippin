import React from 'react';

const StartJourney: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">START YOUR JOURNEY</h2>
        
        <div className="flex justify-center mb-12">
          <div className="flex space-x-8 text-sm">
            <button className="text-red-500 border-b-2 border-red-500 pb-2 font-medium">BY TRAVELLER</button>
            <button className="text-gray-500 hover:text-gray-700">MOST POPULAR</button>
            <button className="text-gray-500 hover:text-gray-700">BY MONTH</button>
            <button className="text-gray-500 hover:text-gray-700">IN THE SPOTLIGHT</button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="relative h-96 bg-cover bg-center group cursor-pointer" style={{
            backgroundImage: `url('/lovable-uploads/26e4a5e7-485e-4f4f-94f8-ad79a11f9a2e.png')`
          }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">FAMILY</h3>
            </div>
          </div>
          
          <div className="relative h-96 bg-cover bg-center group cursor-pointer" style={{
            backgroundImage: `url('/lovable-uploads/26e4a5e7-485e-4f4f-94f8-ad79a11f9a2e.png')`
          }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">COUPLES</h3>
            </div>
          </div>
          
          <div className="relative h-96 bg-cover bg-center group cursor-pointer" style={{
            backgroundImage: `url('/lovable-uploads/26e4a5e7-485e-4f4f-94f8-ad79a11f9a2e.png')`
          }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">GROUPS</h3>
            </div>
          </div>
          
          <div className="relative h-96 bg-cover bg-center group cursor-pointer" style={{
            backgroundImage: `url('/lovable-uploads/26e4a5e7-485e-4f4f-94f8-ad79a11f9a2e.png')`
          }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">HONEYMOON</h3>
            </div>
          </div>
          
          <div className="relative h-96 bg-cover bg-center group cursor-pointer" style={{
            backgroundImage: `url('/lovable-uploads/26e4a5e7-485e-4f4f-94f8-ad79a11f9a2e.png')`
          }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">SOLO</h3>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors">
            VIEW MORE
          </button>
        </div>
      </div>
    </section>
  );
};

export default StartJourney;