import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Building2, Church, Globe, Trees, Waves, Mountain, ShoppingBag, Utensils, Music, Sparkles, Castle, Trophy, Heart, MoonStar, Tent, Wine, Gem, Compass, Leaf, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'all', name: 'All', icon: Globe },
  { id: 'religious', name: 'Religious', icon: Church },
  { id: 'cultural', name: 'Cultural', icon: Castle },
  { id: 'nature', name: 'Nature', icon: Trees },
  { id: 'food', name: 'Food', icon: Utensils },
  { id: 'festivals', name: 'Festivals', icon: Music },
  { id: 'historical', name: 'Historical', icon: Building2 },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
  { id: 'beaches', name: 'Beaches', icon: Waves },
  { id: 'mountains', name: 'Mountains', icon: Mountain },
  { id: 'outdoors', name: 'Outdoors', icon: Tent },
  { id: 'nightlife', name: 'Nightlife', icon: Wine },
  { id: 'luxury', name: 'Luxury', icon: Gem },
  { id: 'romance', name: 'Romance', icon: Heart },
  { id: 'nightskies', name: 'NightSkies', icon: MoonStar },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'wellness', name: 'Wellness', icon: Leaf },
  { id: 'family', name: 'Family & Kids', icon: Users },
  { id: 'offbeat', name: 'Offbeat', icon: Compass },
  { id: 'melanin-compass', name: 'Melanin Compass', icon: Compass },
];

interface CategoryCarouselProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
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
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // Initial check

      const resizeObserver = new ResizeObserver(checkScrollButtons);
      resizeObserver.observe(scrollContainer);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className="relative bg-background border-b border-border">
      <div className="flex items-center px-6 py-4">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            className="absolute left-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-md hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Categories container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`flex flex-col items-center min-w-[75px] px-3 py-3 rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium whitespace-nowrap">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            className="absolute right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-md hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};