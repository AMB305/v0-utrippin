import React from 'react';
import { DollarSign, Search, Plane } from 'lucide-react';

const HowWeWork = () => {
  const steps = [
    {
      icon: DollarSign,
      title: "Tell us your budget",
      description: "Share your travel dreams and budget constraints. We work with any amount."
    },
    {
      icon: Search,
      title: "We find the deals",
      description: "Our AI scours millions of options to find the perfect deals that match your preferences."
    },
    {
      icon: Plane,
      title: "You travel more for less",
      description: "Book with confidence knowing you're getting the best value for your money."
    }
  ];

  return (
    <section className="how-it-work-section py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-gray-900">
            How We Work
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Three simple steps to unlock extraordinary travel experiences without breaking the bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-light mb-4 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork; 