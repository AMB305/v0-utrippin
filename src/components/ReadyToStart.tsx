import React from 'react';
import { Button } from '@/components/ui/button';

const ReadyToStart = () => {
  return (
    <section className="ready-to-start-section py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 tracking-wide">
          SO, READY TO START?
        </h2>
        
        <Button 
          className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300"
        >
          GET IN TOUCH
        </Button>
      </div>
    </section>
  );
};

export default ReadyToStart; 