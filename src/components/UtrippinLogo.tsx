
import React from 'react';

const UtrippinLogo = () => {
  const gradientColors = [
    '#1f2937', // gray-800
    '#374151', // gray-700
    '#4b5563', // gray-600
    '#6b7280', // gray-500
    '#9ca3af', // gray-400
    '#d1d5db', // gray-300
    '#e5e7eb', // gray-200
    '#f3f4f6'  // gray-100
  ];

  const letters = ['U','T','R','I','P','P','I','N'];

  return (
    <div className="flex justify-center space-x-1">
      {letters.map((char, i) => (
        <span
          key={i}
          className={`
            block w-6 h-6 md:w-8 md:h-8 
            text-white font-bold text-center text-sm md:text-base
            leading-6 md:leading-8 
            animate-fade-in 
            transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:brightness-125 hover:shadow-lg
            rounded-md
          `}
          style={{
            backgroundColor: gradientColors[i],
            animationDelay: `${i * 100}ms`
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default UtrippinLogo;
