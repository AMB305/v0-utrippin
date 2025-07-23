import React from 'react';

const AwardsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognition</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold mb-2">Best Travel App 2024</h3>
            <p className="text-sm text-gray-600">Travel Weekly</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold mb-2">Innovation Award</h3>
            <p className="text-sm text-gray-600">Tech Travel Awards</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">💎</span>
            </div>
            <h3 className="font-semibold mb-2">Top Startup</h3>
            <p className="text-sm text-gray-600">TechCrunch</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold mb-2">Rising Star</h3>
            <p className="text-sm text-gray-600">Forbes 30 Under 30</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;