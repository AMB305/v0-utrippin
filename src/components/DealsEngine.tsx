import React from 'react';
import { Button } from '@/components/ui/button';

const DealsEngine = () => {
  return (
    <section className="deal-engine-section py-32 px-4 bg-black text-white relative overflow-hidden min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto text-center w-full">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 text-gray-300">
          THE
        </h2>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-16 text-white">
          DEALS ENGINE
        </h2>
        
        <p className="text-xl md:text-2xl mb-16 font-light opacity-90 max-w-4xl mx-auto leading-relaxed">
          FIND THE BEST DEALS WITH OUR AI-ENHANCED TOOL THAT SCOURS THE INTERNET 
          FOR UNBEATABLE PRICES AND HIDDEN GEMS
        </p>

        <Button 
          className="border border-white text-white bg-transparent hover:bg-white hover:text-black px-12 py-4 text-base font-medium tracking-wide uppercase mb-20 transition-all duration-300"
        >
          TRY THE DEALS ENGINE
        </Button>

        {/* Enhanced Mock Interface with Multiple Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-left">
            <div className="mb-6">
              <div className="text-white font-light text-xl mb-3">I want to feel adventurous</div>
            </div>
            <div className="text-gray-300 font-light text-sm leading-relaxed">
              When you need to break free from routine and find 
              your way back to excitement, I'm drawn to 
              recommend a journey that combines 
              discovery, natural beauty, and the kind of 
              perspective that only comes from standing at...
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-left">
            <div className="mb-6">
              <div className="text-white font-light text-xl mb-3">I want luxury on a budget</div>
            </div>
            <div className="text-gray-300 font-light text-sm leading-relaxed">
              Experience five-star amenities without the 
              premium price tag. I've found exclusive deals 
              on boutique hotels and luxury resorts that offer 
              exceptional value during off-peak seasons...
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-left md:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <div className="text-white font-light text-xl mb-3">Family-friendly adventures</div>
            </div>
            <div className="text-gray-300 font-light text-sm leading-relaxed">
              Create memories that will last a lifetime with 
              destinations and activities perfect for all ages. 
              From theme parks to cultural experiences, 
              I'll help you find the perfect family getaway...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsEngine; 