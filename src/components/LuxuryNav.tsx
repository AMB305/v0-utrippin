import React from 'react';

const LuxuryNav: React.FC = () => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-primary">Utrippin.ai</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2">Home</a>
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2">Explore</a>
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2">My Trips</a>
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LuxuryNav;