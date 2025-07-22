import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TravelCarouselProps {
  images: string[];
  className?: string;
}

const TravelCarousel: React.FC<TravelCarouselProps> = ({ images, className = '' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      const handleScroll = () => checkScrollButtons();
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  return (
    <div className={`relative group ${className}`}>
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 transition-all duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } group-hover:opacity-100`}
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </Button>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 transition-all duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } group-hover:opacity-100`}
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </Button>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative rounded-2xl overflow-hidden shadow-lg"
            style={{ width: '425px', height: '740px' }}
          >
            <img
              src={image}
              alt={`Travel destination ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelCarousel; 