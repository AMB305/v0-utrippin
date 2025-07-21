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
    ? 'top-20' 
    : ''; // Remove positioning classes, use inline styles instead

  const hideClass = position === 'bottom' && !isVisible 
    ? 'opacity-0' 
    : 'opacity-100';

  return (
    <>
      {/* Floating Button - Only visible on mobile */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className={`floating-flight-button fixed ${positionClasses} z-40 md:hidden text-white py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out ${hideClass} flex items-center justify-center hover:opacity-90`}
        style={{
          backgroundColor: '#0068ef',
          bottom: position === 'bottom' ? '120px' : 'auto',
          top: position === 'top' ? '20px' : 'auto',
          left: '50%',
          marginLeft: '-35vw',
          transform: position === 'bottom' && !isVisible ? 'translateY(80px)' : 'translateY(0)',
          width: '70vw',
          boxShadow: '0 4px 20px rgba(0, 104, 239, 0.4)'
        }}
      >
        <Plane className="w-5 h-5 mr-3" />
        <span className="font-semibold text-lg">Book Flight</span>
      </button>

      {/* Mobile Flight Popup */}
      <MobileFlightPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
} 