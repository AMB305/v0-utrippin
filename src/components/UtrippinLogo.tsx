
import React from 'react';

const UtrippinLogo = () => {
  const gradientColors = [
    '#1e40af', // blue-800
    '#1d4ed8', // blue-700
    '#2563eb', // blue-600
    '#3b82f6', // blue-500
    '#60a5fa', // blue-400
    '#93c5fd', // blue-300
    '#bfdbfe', // blue-200
    '#dbeafe'  // blue-100
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
