import React from 'react';

const DealsEngineHero = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="text-gray-400 text-sm tracking-[0.3em] font-light">MEET</span>
        </div>
        <h2 className="text-7xl md:text-8xl font-bold mb-12 tracking-[0.1em]">KEILA</h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
          YOUR PERSONAL AI TRAVEL ASSISTANT.<br/>
          KEILA FINDS THE BEST DEALS AND BUILDS<br/>
          PERFECT ITINERARIES IN SECONDS
        </p>
        
        <button className="bg-transparent border-2 border-white text-white px-10 py-4 text-sm font-medium tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 mb-20 rounded-none">
          CHAT WITH KEILA NOW
        </button>

        <div className="flex justify-center">
          <div className="relative">
            {/* Phone Frame */}
            <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-black rounded-[2rem] overflow-hidden" style={{ width: '280px', height: '580px' }}>
                {/* Phone Screen Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-8 text-white text-xs">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-6 h-2 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-4 overflow-hidden">
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 text-sm max-w-[200px]">
                        I want luxury on a budget
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white rounded-2xl px-4 py-3 text-sm max-w-[200px]">
                        Hi! I'm Keila 👋 I found amazing deals on 5-star resorts in Bali starting at $89/night!
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 text-sm max-w-[200px]">
                        Perfect! Show me the itinerary
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white rounded-2xl px-4 py-3 text-sm max-w-[200px]">
                        Here's your 7-day Bali adventure with spa treatments, private tours & luxury dining ✨
                      </div>
                    </div>
                  </div>
                  
                  {/* Input Area */}
                  <div className="mt-4 flex items-center bg-gray-800 rounded-full px-4 py-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
                      disabled
                    />
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsEngineHero;
