import React from 'react';

const DealsEngineHero = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <span className="text-gray-400 text-sm tracking-widest">THE</span>
        </div>
        <h2 className="text-6xl font-bold mb-8 tracking-wider">DEALS ENGINE</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          FIND THE BEST DEALS WITH OUR AI-ENHANCED<br/>
          TOOL THAT SCOURS THE INTERNET FOR<br/>
          UNBEATABLE PRICES AND HIDDEN GEMS
        </p>
        
        <button className="bg-black text-white border border-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-white hover:text-black transition-colors mb-16">
          TRY THE DEALS ENGINE
        </button>

        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-sm">
            <div className="space-y-4">
              <div className="bg-blue-600 text-white rounded-full px-6 py-3 text-sm">
                I want luxury on a budget
              </div>
              <div className="bg-gray-600 text-white rounded-2xl px-6 py-4 text-sm">
                Found amazing deals on 5-star resorts...
              </div>
              <div className="bg-blue-600 text-white rounded-full px-6 py-3 text-sm">
                Save up to 70% on your dream vacation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsEngineHero;