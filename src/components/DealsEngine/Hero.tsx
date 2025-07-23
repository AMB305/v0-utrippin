import React from 'react';

const DealsEngineHero = () => {
  return (
    <section className="py-10 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <span className="text-gray-400 text-sm tracking-widest">MEET</span>
        </div>
        <h2 className="text-6xl font-bold mb-8 tracking-wider">KEILA</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          YOUR PERSONAL AI TRAVEL ASSISTANT.<br/>
          KEILA FINDS THE BEST DEALS AND BUILDS<br/>
          PERFECT ITINERARIES IN SECONDS
        </p>
        
        <button className="bg-transparent border-2 border-white text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 mb-16" style={{ backgroundColor: 'transparent', borderColor: 'white', color: 'white' }}>
          CHAT WITH KEILA NOW
        </button>

        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-sm">
            <div className="space-y-4">
              <div className="bg-blue-600 text-white rounded-full px-6 py-3 text-sm">
                I want luxury on a budget
              </div>
              <div className="bg-gray-600 text-white rounded-2xl px-6 py-4 text-sm">
                Hi! I'm Keila 👋 I found amazing deals on 5-star resorts in Bali starting at $89/night!
              </div>
              <div className="bg-blue-600 text-white rounded-full px-6 py-3 text-sm">
                Perfect! Show me the itinerary
              </div>
              <div className="bg-gray-600 text-white rounded-2xl px-6 py-4 text-sm">
                Here's your 7-day Bali adventure with spa treatments, private tours & luxury dining ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsEngineHero;