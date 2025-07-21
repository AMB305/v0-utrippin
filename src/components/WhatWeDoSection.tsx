import React from 'react';
import { Button } from '@/components/ui/button';

const WhatWeDoSection = () => {
  return (
    <section className="what-we-do-section py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              WHAT WE DO AND WHY WE DO IT
            </h2>
            <p className="text-sm text-gray-600 font-medium tracking-wide uppercase">
              EMPOWERING ACCESSIBLE TRAVEL FOR ALL
            </p>
            
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                At Utrippin, we believe that travel should be accessible to everyone, 
                regardless of their budget or background. We built this platform 
                specifically for the underserved community, breaking down barriers 
                that have traditionally kept people from exploring the world.
              </p>
              <p>
                Our mission is simple yet powerful: to show everyone that they can 
                travel, no matter their financial situation. Through innovative 
                AI-powered deal discovery, community support, and expert guidance, 
                we're democratizing travel one trip at a time.
              </p>
              <p>
                We understand that travel isn't just about luxury - it's about 
                connection, growth, and the transformative power of experiencing 
                different cultures and perspectives. That's why we're committed to 
                making these experiences accessible to all.
              </p>
            </div>

            <Button 
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase"
            >
              LEARN MORE ABOUT US
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
              alt="Diverse group of travelers exploring together"
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection; 