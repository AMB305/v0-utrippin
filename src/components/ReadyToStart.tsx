import React from 'react';

const ReadyToStart: React.FC = () => {
  return (
    <section className="py-20 bg-orange-500 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-6xl font-bold mb-12 text-black">SO, READY TO START?</h2>
        <button className="bg-black text-white px-8 py-4 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors">
          GET IN TOUCH
        </button>
      </div>
    </section>
  );
};

export default ReadyToStart;