import React from 'react';

const UtrippinLogo = () => {
  const gradientColors = [
    '#0070f3',
    '#0066e0',
    '#005ccc',
    '#0052b8',
    '#0048a4',
    '#003e90',
    '#00347c',
    '#002a68'
  ];

  const letters = ['U','T','R','I','P','P','I','N'];

  return (
    <div className="flex justify-center space-x-0.5">
      {letters.map((char, i) => (
        <span
          key={i}
          className={`
            block w-5 h-5 md:w-7 md:h-7 
            text-white font-bold text-center text-xs md:text-sm
            leading-[1.25rem] md:leading-[1.75rem] 
            animate-fade-in 
            transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:brightness-125 hover:shadow-lg
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