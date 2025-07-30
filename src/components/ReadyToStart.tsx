import React from 'react';

const ReadyToStart: React.FC = () => {
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
    <section className="py-10 bg-orange-500 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-6xl font-bold mb-12 text-black">SO, READY TO START?</h2>
        <button 
          onClick={handleGetInTouchClick}
          className="bg-black text-white px-8 py-4 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors"
        >
          GET IN TOUCH
        </button>
      </div>
    </section>
  );
};

export default ReadyToStart;