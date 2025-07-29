import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PursuitOfFeeling = () => {
  const navigate = useNavigate();
  return (
    <section className="pursuit-section-set py-10 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="/lovable-uploads/97268738-d558-43bb-85f7-04978567137d.png"
              alt="Two joyful women celebrating their journey"
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              THE MELANIN COMPASS
            </h2>
            
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                For us, travel is more than a destination; it's about the joy and power of 
                exploring the world in our melanin skin. The Melanin Compass is dedicated to 
                this experience, helping our community connect with the world by sharing 
                enriching knowledge and smart budgeting tips.
              </p>
              <p>
                We're guided by a simple philosophy:
              </p>
              <p className="font-medium italic">
                It's not just where you want to go; it's the empowerment you find on the journey.
              </p>
            </div>

            <Button 
              onClick={() => navigate('/melanin')}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase"
            >
              FIND OUT MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PursuitOfFeeling;