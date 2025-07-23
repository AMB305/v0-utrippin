import React from 'react';

const LuxuryNav: React.FC = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-1">
              {['U', 'T', 'R', 'I', 'P', 'P', 'I', 'N'].map((letter, index) => (
                <div key={index} className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {letter}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">Flights</a>
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">Hotels</a>
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">Cars</a>
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">Packages</a>
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">Cruises</a>
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">AI Travel Buddy</a>
              <a href="#" className="text-white hover:text-blue-200 px-3 py-2 font-medium">Melanin & Trippin</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LuxuryNav;