import React, { useEffect, useState } from 'react';

const UtrippinLogo = () => {
  const [animatedLetters, setAnimatedLetters] = useState<boolean[]>(new Array(8).fill(false));

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
          className={`w-8 h-8 bg-blue-600 text-white flex items-center justify-center text-sm font-bold transition-transform duration-300 ease-out ${
            animatedLetters[index] ? 'animate-letter-lift' : ''
          }`}
          style={{
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