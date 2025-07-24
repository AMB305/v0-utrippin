import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const SmartTravelExperts = () => {
  const testimonials = [
    {
      text: "UTRIPPIN PLANNED OUR ENTIRE TRIP — DOWN TO THE RESTAURANT RESERVATIONS",
      author: "Zoe, Barbados"
    },
    {
      text: "THE MELANIN COMPASS GAVE US A WHOLE ITINERARY OF BLACK-OWNED SPOTS — INVALUABLE!",
      author: "Andre, Atlanta"
    },
    {
      text: "USED THE AI TRAVEL TOOL FOR A GIRLS TRIP — CAME BACK WITH MEMORIES AND DEALS",
      author: "Imani, South Africa"
    },
    {
      text: "FAMILY-FRIENDLY ITINERARY, CULTURAL EVENTS, HIDDEN GEMS — ALL FROM ONE AI CHAT",
      author: "Jordan, Toronto"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
          THE SMART TRAVEL DEAL EXPERTS
        </h2>
        
        {/* Description */}
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The world is vast, full of wonders. But information engulfs us. See this, do that, don't miss this. It seems the more choice there is, the more 
            overwhelmed we feel. What's more, you're never asked <em className="italic">how you want to feel</em>. In fact, you're rarely asked anything. That's not us. We are 
            people. People who value human connection and thrive on connecting you to our vast world. A company of people renowned for planning 
            remarkable and budget-friendly travel experiences.
          </p>
          
          <p className="text-lg text-gray-600 mb-8">
            So let's begin. Let's do something remarkable.
          </p>
          
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium tracking-wider">
            GET IN TOUCH
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-teal-500 text-6xl mb-4 font-serif">"</div>
              <p className="text-sm font-bold text-gray-900 uppercase leading-tight mb-4">
                {testimonial.text}
              </p>
              <p className="text-sm text-teal-600 italic">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* Trustpilot Rating */}
        <div className="flex justify-center items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-600 flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            ))}
          </div>
          <span className="text-gray-600 ml-2">★ Trustpilot</span>
        </div>
      </div>
    </section>
  );
};

export default SmartTravelExperts;