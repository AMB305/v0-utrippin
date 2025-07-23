import React, { useEffect, useState } from 'react';

const UtrippinLogo = () => {
  const [animatedLetters, setAnimatedLetters] = useState<boolean[]>(new Array(8).fill(false));

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
    // Trigger the letter lift animation on component mount
    const letters = ['U', 'T', 'R', 'I', 'P', 'P', 'I', 'N'];
    
    letters.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedLetters(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 100); // 100ms delay between each letter
    });
  }, []);

  return (
    <div className="flex items-center">
      {['U', 'T', 'R', 'I', 'P', 'P', 'I', 'N'].map((letter, index) => (
        <div 
          key={index} 
          className={`w-8 h-8 text-white flex items-center justify-center text-sm font-bold transition-transform duration-300 ease-out ${
            animatedLetters[index] ? 'animate-letter-lift' : ''
          }`}
          style={{
            backgroundColor: gradientColors[index],
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          {letter}
        </div>
      ))}
      
      <style>{`
        @keyframes letter-lift {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .animate-letter-lift {
          animation: letter-lift 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UtrippinLogo;