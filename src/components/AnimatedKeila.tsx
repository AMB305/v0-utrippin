// src/components/AnimatedKeila.tsx

import React from 'react';

export const AnimatedKeila = () => {
  return (
    <div className="relative w-40 h-40">
      <img 
        src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
        alt="Keila AI Travel Assistant" 
        className="w-full h-full animate-float" 
      />
      {/* Blinking Animation Overlay */}
      <div className="absolute top-1/3 left-0 w-full h-1/3 overflow-hidden">
        <div className="w-full h-full bg-transparent animate-blink" style={{ boxShadow: '0 0 10px 5px rgba(0,0,0,0.5) inset' }} />
      </div>
    </div>
  );
};