import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Travelers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Jennifer M.</h4>
                <p className="text-sm text-gray-600">Frequent Traveler</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Utrippin.ai saved me over $800 on my European vacation. The AI recommendations were spot-on!"
            </p>
            <div className="flex text-yellow-400 mt-3">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Michael R.</h4>
                <p className="text-sm text-gray-600">Business Traveler</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Best travel app I've ever used. Found deals I never would have discovered on my own."
            </p>
            <div className="flex text-yellow-400 mt-3">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Sarah L.</h4>
                <p className="text-sm text-gray-600">Adventure Seeker</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "The personalized recommendations helped me discover hidden gems I never knew existed."
            </p>
            <div className="flex text-yellow-400 mt-3">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;