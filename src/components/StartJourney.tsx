import React from 'react';
import { Button } from '@/components/ui/button';

// Import new journey type images
import familyJourney from '/lovable-uploads/b3fe176a-dff1-42f4-b457-687e831d4d18.png';
import couplesJourney from '@/assets/couples-journey.jpg';
import groupsJourney from '@/assets/groups-journey.jpg';
import honeymoonJourney from '@/assets/honeymoon-journey.jpg';
import soloJourney from '/lovable-uploads/04a72318-8b71-4ff4-a2d6-7e5e55a289d7.png';

const StartJourney = () => {
  const journeyTypes = [
    {
      title: "FAMILY",
      image: familyJourney
    },
    {
      title: "COUPLES", 
      image: couplesJourney
    },
    {
      title: "GROUPS",
      image: groupsJourney
    },
    {
      title: "HONEYMOON",
      image: honeymoonJourney
    },
    {
      title: "SOLO",
      image: soloJourney
    }
  ];

  return (
    <section className="start-journey-section py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-12 text-gray-900">
            START YOUR JOURNEY
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-8 mb-12 text-sm font-medium">
            <span className="text-pink-500 border-b-2 border-pink-500 pb-2">BY TRAVELLER</span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">MOST POPULAR</span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">BY MONTH</span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">IN THE SPOTLIGHT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {journeyTypes.map((type, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4">
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <h3 className="text-white text-lg font-medium">
                    {type.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase"
          >
            VIEW MORE
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StartJourney; 