import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">THE SMART TRAVEL DEAL EXPERTS</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-5xl mx-auto leading-relaxed">
          The world is vast, full of wonders. But information engulfs us. See this, do that, don't miss this. It seems the more choice there is, the more overwhelmed we feel. What's more, you're never asked <em>how you want to feel</em>. In fact, you're rarely asked anything. That's not us. We are people. People who value human connection and thrive on connecting you to our vast world. A company of people renowned for planning remarkable and budget-friendly travel experiences.
        </p>
        <p className="text-lg text-gray-600 mb-12">
          So let's begin. Let's do something remarkable.
        </p>
        <button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors">
          GET IN TOUCH
        </button>
        
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-teal-500 text-2xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-sm">UTRIPPIN PLANNED OUR ENTIRE TRIP — DOWN TO THE RESTAURANT RESERVATIONS</h3>
            <p className="text-teal-500 italic">Zoe, Barbados</p>
          </div>
          <div className="text-center">
            <div className="text-teal-500 text-2xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-sm">THE MELANIN COMPASS GAVE US A WHOLE ITINERARY OF BLACK-OWNED SPOTS — INVALUABLE!</h3>
            <p className="text-teal-500 italic">Andre, Atlanta</p>
          </div>
          <div className="text-center">
            <div className="text-teal-500 text-2xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-sm">USED THE AI TRAVEL TOOL FOR A GIRLS TRIP — CAME BACK WITH MEMORIES AND DEALS</h3>
            <p className="text-teal-500 italic">Imani, South Africa</p>
          </div>
          <div className="text-center">
            <div className="text-teal-500 text-2xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-sm">FAMILY-FRIENDLY ITINERARY, CULTURAL EVENTS, HIDDEN GEMS — ALL FROM ONE AI CHAT</h3>
            <p className="text-teal-500 italic">Jordan, Toronto</p>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-8 h-8 bg-gray-600 text-white flex items-center justify-center">
                ★
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">★ Trustpilot</p>
      </div>
    </section>
  );
};

export default TestimonialsSection;