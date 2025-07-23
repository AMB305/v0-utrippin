import React, { useEffect, useRef } from 'react';

const UtrippinLogo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  // Gradient colors from bright blue to dark blue/near-black
  const gradientColors = [
    '#3B82F6', // Bright blue
    '#2563EB', // Medium-bright blue
    '#1D4ED8', // Medium blue
    '#1E40AF', // Medium-dark blue
    '#1E3A8A', // Dark blue
    '#1E3A8A', // Dark blue (repeat for P)
    '#172554', // Very dark blue
    '#0F172A', // Near-black blue
  ];

  useEffect(() => {
    // Add animation class to trigger the animation on mount
    if (logoRef.current) {
      logoRef.current.classList.add('animate-on-load');
    }
  }, []);

  return (
    <>
      <div ref={logoRef} className="flex items-center logo-container">
        {['U', 'T', 'R', 'I', 'P', 'P', 'I', 'N'].map((letter, index) => (
          <div 
            key={index} 
            className="logo-letter w-8 h-8 text-white flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: gradientColors[index],
              animationDelay: `${index * 150}ms`,
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes letter-lift {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .animate-on-load .logo-letter {
          animation: letter-lift 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </>
  );
};

export default UtrippinLogo;