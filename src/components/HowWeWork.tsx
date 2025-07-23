import React from 'react';

const HowWeWork: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-12">How We Work</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Tell Us Your Dreams</h3>
            <p className="text-gray-600">Share your travel preferences and budget with our AI assistant</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Personalized Deals</h3>
            <p className="text-gray-600">Receive curated recommendations tailored to your needs</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Book & Travel</h3>
            <p className="text-gray-600">Secure your trip and embark on your adventure</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;