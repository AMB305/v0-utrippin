import React from 'react';

const TestimonialsSection: React.FC = () => {
  const handleGetInTouchClick = () => {
    // Scroll to footer and focus email field
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
      // Use a timeout to ensure the scroll completes before focusing
      setTimeout(() => {
        const emailInput = footer.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 500);
    }
  };
  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">THE SMART TRAVEL DEAL EXPERTS</h2>
        <p className="text-sm text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
          The world is vast, full of wonders. But information engulfs us. See this, do that, don't miss this. It seems the more choice there is, the more overwhelmed we feel. What's more, you're never asked <em>how you want to feel</em>. In fact, you're rarely asked anything. That's not us. We are people. People who value human connection and thrive on connecting you to our vast world. A company of people renowned for planning remarkable and budget-friendly travel experiences.
        </p>
        <p className="text-sm text-gray-600 mb-8">
          So let's begin. Let's do something remarkable.
        </p>
        <button 
          onClick={handleGetInTouchClick}
          className="bg-black text-white px-6 py-2 text-xs font-medium tracking-wider hover:bg-gray-800 transition-colors"
        >
          GET IN TOUCH
        </button>
        
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          <div className="text-center">
            <div className="text-teal-500 text-xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">UTRIPPIN PLANNED OUR ENTIRE TRIP — DOWN TO THE RESTAURANT RESERVATIONS</h3>
            <p className="text-teal-500 italic text-sm">Zoe, Barbados</p>
          </div>
          <div className="text-center">
            <div className="text-teal-500 text-xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">THE MELANIN COMPASS GAVE US A WHOLE ITINERARY OF BLACK-OWNED SPOTS — INVALUABLE!</h3>
            <p className="text-teal-500 italic text-sm">Andre, Atlanta</p>
          </div>
          <div className="text-center">
            <div className="text-teal-500 text-xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">USED THE AI TRAVEL TOOL FOR A GIRLS TRIP — CAME BACK WITH MEMORIES AND DEALS</h3>
            <p className="text-teal-500 italic text-sm">Imani, South Africa</p>
          </div>
          <div className="text-center">
            <div className="text-teal-500 text-xl mb-2">"</div>
            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">FAMILY-FRIENDLY ITINERARY, CULTURAL EVENTS, HIDDEN GEMS — ALL FROM ONE AI CHAT</h3>
            <p className="text-teal-500 italic text-sm">Jordan, Toronto</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-6 h-6 bg-gray-600 text-white flex items-center justify-center text-sm">
                ★
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">★ Trustpilot</p>
      </div>
    </section>
  );
};

export default TestimonialsSection;