import React from 'react';
import { Button } from '@/components/ui/button';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "UTRIPPIN WILL CHANGE THE WAY YOU TRAVEL",
      author: "Micah, Egypt"
    },
    {
      quote: "GLAMPING, HIKING, ICEBERGS, GOURMET FOOD. NOT SURE HOW MY TRIP COULD HAVE BEEN ANY BETTER",
      author: "Jimmy, Greenland"
    },
    {
      quote: "A DREAM COME TRUE - FROM SMALL RIADS TO A MOUNTAIN FORTRESS AND A DESERT OASIS. UTRIPPIN DELIVERED",
      author: "Kim, Morocco"
    },
    {
      quote: "HIGHLY RECOMMEND UTRIPPIN'S HELP IN PLANNING AN ADVENTUROUS FAMILY-FRIENDLY HOLIDAY",
      author: "Susan, Sweden"
    }
  ];

  return (
    <section className="smart-travel-section py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light mb-12 text-gray-900 tracking-wide">
            THE SMART TRAVEL DEAL EXPERTS
          </h2>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-gray-700 font-light leading-relaxed mb-6">
              The world is vast, full of wonders. But information engulfs us. See this, do that, don't miss this. It seems the more 
              choice there is, the more overwhelmed we feel. What's more, you're never asked <em>how you want to feel</em>. In fact, you're 
              rarely asked anything. That's not us. We are people. People who value human connection and thrive on connecting 
              you to our vast world. A company of people renowned for planning remarkable and budget-friendly travel experiences.
            </p>
            <p className="text-gray-700 font-light leading-relaxed mb-8">
              So let's begin. Let's do something remarkable.
            </p>
            
            <Button 
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase mb-12"
            >
              GET IN TOUCH
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-center">
              <div className="text-teal-500 text-6xl mb-4">"</div>
              <p className="text-sm text-gray-700 font-medium mb-4 leading-relaxed uppercase">
                {testimonial.quote}
              </p>
              <p className="text-sm text-teal-600 font-light italic">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* Trustpilot Rating */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-black text-lg">★</span>
              ))}
            </div>
            <span className="text-sm text-gray-600">★ Trustpilot</span>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8 gap-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 