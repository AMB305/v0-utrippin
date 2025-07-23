import React from 'react';
import { Button } from '@/components/ui/button';
import guideImage from '@/assets/guide-image.jpg';

const GuideToTravel = () => {
  return (
    <section className="guide-to-travel-section py-6 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-0 items-stretch min-h-[400px]">
          {/* Text Content */}
          <div className="flex flex-col justify-center px-8 lg:px-12 py-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 leading-tight mb-4">
              OUR GUIDE TO BUDGET TRAVEL
            </h2>
            <p className="text-xs text-gray-600 font-medium tracking-wide uppercase mb-6">
              THE SMART TRAVEL DEAL EXPERTS
            </p>
            
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed mb-8">
              <p>
                Budget travel is personal. It means something different for each 
                and every one of us. For some, budget travel is finding peaceful solitude 
                through a remote corner of the world, while for others it's the 
                thrill of discovering hidden gems in bustling cities.
              </p>
              <p>
                Our team of travel deal specialists are connoisseurs of value, curating 
                unparalleled experiences, tailor made itineraries and bespoke adventures. 
                Whether you seek the opulence of a luxury resort at budget prices or 
                the thrill of an exclusive adventure that won't break the bank, we'll craft a 
                journey that exceeds your expectations.
              </p>
            </div>

            <Button 
              className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-xs font-medium tracking-wide uppercase w-fit"
            >
              CONTINUE READING
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={guideImage}
              alt="Mountain landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideToTravel;