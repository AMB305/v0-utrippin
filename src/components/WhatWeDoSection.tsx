import React from 'react';

const WhatWeDoSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <p className="text-lg text-gray-600 mb-6">
              We help travelers find the best deals and experiences around the world through AI-powered recommendations and curated travel packages.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-powered travel planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Best price guarantees</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-100 h-64 rounded-lg flex items-center justify-center">
            <span className="text-blue-600">What We Do Image</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;