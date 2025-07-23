import React from 'react';

const PursuitOfFeeling: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-purple-100 h-64 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">Pursuit of Feeling Image</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">The Pursuit of Feeling</h2>
            <p className="text-lg text-gray-600 mb-6">
              Travel is about more than destinations—it's about the emotions and memories you create. We help you find experiences that move you.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Explore Feelings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PursuitOfFeeling;