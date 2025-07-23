import React from 'react';

const DealsEngine: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Powered by Our Deals Engine</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Our AI scans millions of deals in real-time to find you the best prices on flights, hotels, and packages.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">1M+</h3>
            <p>Deals Scanned Daily</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">85%</h3>
            <p>Average Savings</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">24/7</h3>
            <p>Live Monitoring</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsEngine;