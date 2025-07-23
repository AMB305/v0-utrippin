import React from 'react';

const UtrippinLogo = () => {
  return (
    <div className="flex items-center space-x-1">
      {['U', 'T', 'R', 'I', 'P', 'P', 'I', 'N'].map((letter, index) => (
        <div 
          key={index} 
          className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center text-sm font-bold"
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default UtrippinLogo;