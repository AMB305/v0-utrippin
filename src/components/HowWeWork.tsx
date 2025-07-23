import React from 'react';

const HowWeWork: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">HOW WE WORK</h2>
        <p className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto">
          Three simple steps to unlock extraordinary travel experiences without breaking the bank.
        </p>
        
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-blue-600 text-2xl font-bold">$</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Tell us your budget</h3>
            <p className="text-gray-600 leading-relaxed">
              Share your travel dreams and budget constraints. We work with any amount.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-blue-600 text-2xl font-bold">🔍</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">We find the deals</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI scours millions of options to find the perfect deals that match your preferences.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-blue-600 text-2xl font-bold">✈️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">You travel more for less</h3>
            <p className="text-gray-600 leading-relaxed">
              Book with confidence knowing you're getting the best value for your money.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;