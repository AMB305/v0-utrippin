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
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Header */}
        <h2 className="text-4xl font-bold text-black mb-8 tracking-tight">
          THE SMART TRAVEL DEAL EXPERTS
        </h2>
        
        {/* Description */}
        <div className="max-w-4xl mx-auto mb-8 text-gray-700 leading-relaxed space-y-4">
          <p>
            The world is vast, full of wonders. But information engulfs us. See this, do that, don't miss this. It seems the more choice there is, the more 
            overwhelmed we feel. What's more, you're never asked <em className="italic">how you want to feel</em>. In fact, you're rarely asked anything. That's not us. We are 
            people. People who value human connection and thrive on connecting you to our vast world. A company of people renowned for planning 
            remarkable and budget-friendly travel experiences.
          </p>
          
          <p className="text-gray-600">
            So let's begin. Let's do something remarkable.
          </p>
        </div>
        
        <div className="mb-12">
          <Button className="bg-black hover:bg-gray-900 text-white px-8 py-3 text-sm font-medium tracking-wider">
            GET IN TOUCH
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-left">
              <div className="text-teal-500 text-5xl mb-3 font-serif leading-none">"</div>
              <p className="text-sm font-bold text-black uppercase leading-tight mb-3">
                {testimonial.text}
              </p>
              <p className="text-sm text-teal-500 italic">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* Trustpilot Rating */}
        <div className="flex justify-center items-center">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-gray-600 flex items-center justify-center">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            ))}
          </div>
        </div>
        <div className="text-gray-600 text-sm">
          ★ Trustpilot
        </div>
      </div>
    </section>
  );
};

export default SmartTravelExperts;