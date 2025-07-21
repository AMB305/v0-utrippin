import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import MobileFlightPopup from './MobileFlightPopup';

interface FloatingFlightButtonProps {
  position?: 'top' | 'bottom';
}

export default function FloatingFlightButton({ position = 'bottom' }: FloatingFlightButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction for bottom position
      if (position === 'bottom') {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false); // Hide when scrolling down
        } else {
          setIsVisible(true); // Show when scrolling up
        }
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position]);

  const positionClasses = position === 'top' 
    ? 'top-20 right-4' 
    : 'bottom-20 right-4'; // Moved up to avoid conflict with other floating elements

  const hideClass = position === 'bottom' && !isVisible 
    ? 'translate-y-20 opacity-0' 
    : 'translate-y-0 opacity-100';

  return (
    <>
      {/* Floating Button - Only visible on mobile */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className={`floating-flight-button fixed ${positionClasses} z-40 md:hidden text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out ${hideClass} flex items-center space-x-2 min-w-[140px] justify-center hover:opacity-90`}
        style={{
          backgroundColor: '#0068ef',
          boxShadow: '0 4px 20px rgba(0, 104, 239, 0.4)'
        }}
      >
        <Plane className="w-5 h-5" />
        <span className="font-semibold text-sm">Book Flight</span>
      </button>

      {/* Mobile Flight Popup */}
      <MobileFlightPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
} 