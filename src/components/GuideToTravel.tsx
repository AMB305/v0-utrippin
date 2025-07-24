import React from 'react';
import { Button } from '@/components/ui/button';
import guideImage from '@/assets/guide-image.jpg';

const GuideToTravel = () => {
  return (
    <section className="guide-to-travel-section py-6 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="/lovable-uploads/1e144bc6-1e6e-44e3-8706-44a264517b6f.png"
              alt="Happy family with luggage in hotel room"
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              OUR GUIDE TO BUDGET TRAVEL
            </h2>
            <p className="text-xs text-gray-600 font-medium tracking-wide uppercase">
              THE SMART TRAVEL DEAL EXPERTS
            </p>
            
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
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
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase"
            >
              CONTINUE READING
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideToTravel;