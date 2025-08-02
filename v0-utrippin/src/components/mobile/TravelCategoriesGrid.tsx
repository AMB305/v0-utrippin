import React, { useState } from 'react';
import { 
  Bed, 
  Plane, 
  Building2, 
  Train, 
  Home, 
  Ticket, 
  Car, 
  Zap,
  Globe,
  Camera,
  MapPin,
  Ship,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TravelCategoriesGridProps {
  onCategorySelect?: (category: string) => void;
}

const mainCategories = [
  { icon: Bed, label: 'Hotels', key: 'hotels' },
  { icon: Plane, label: 'Flights', key: 'flights' },
  { icon: Building2, label: 'Flight+Hotel', key: 'packages' },
  { icon: Train, label: 'Trains', key: 'trains' },
  { icon: Home, label: 'Vacation Rentals', key: 'rentals' },
  { icon: Ticket, label: 'Attractions', key: 'attractions' },
  { icon: Car, label: 'Car Rentals', key: 'cars' },
  { icon: Zap, label: 'Airport Transfers', key: 'transfers' },
];

const additionalCategories = [
  { icon: Globe, label: 'Tours', key: 'tours' },
  { icon: Camera, label: 'Experiences', key: 'experiences' },
  { icon: MapPin, label: 'Local Guides', key: 'guides' },
  { icon: Ship, label: 'Cruises', key: 'cruises' },
  { icon: Bed, label: 'Hostels', key: 'hostels' },
  { icon: Building2, label: 'Business Travel', key: 'business' },
];

export const TravelCategoriesGrid: React.FC<TravelCategoriesGridProps> = ({ onCategorySelect }) => {
  const [showMore, setShowMore] = useState(false);

  const handleCategoryClick = (key: string) => {
    onCategorySelect?.(key);
  };

  const CategoryItem = ({ icon: Icon, label, categoryKey }: { icon: any, label: string, categoryKey: string }) => (
    <button
      onClick={() => handleCategoryClick(categoryKey)}
      className="flex flex-col items-center p-3 rounded-xl bg-mobile-card-bg border border-mobile-border-color hover:bg-mobile-dark-grey transition-colors touch-target-44"
    >
      <div className="w-8 h-8 mb-2 text-mobile-primary-teal">
        <Icon className="w-full h-full" />
      </div>
      <span className="text-xs text-mobile-text-primary font-medium text-center leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-mobile-text-primary mb-4">Travel Categories</h2>
      
      {/* Main Categories Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {mainCategories.map((category) => (
          <CategoryItem
            key={category.key}
            icon={category.icon}
            label={category.label}
            categoryKey={category.key}
          />
        ))}
      </div>

      {/* Show More/Less Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-mobile-card-bg border border-mobile-border-color rounded-xl text-mobile-text-secondary text-sm hover:bg-mobile-dark-grey transition-colors"
        >
          <Plus className={`w-4 h-4 transition-transform ${showMore ? 'rotate-45' : ''}`} />
          <span>{showMore ? 'Show Less' : '+6 more'}</span>
          {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Additional Categories (Expandable) */}
      {showMore && (
        <div className="grid grid-cols-4 gap-3 mt-4 animate-fade-in-up">
          {additionalCategories.map((category) => (
            <CategoryItem
              key={category.key}
              icon={category.icon}
              label={category.label}
              categoryKey={category.key}
            />
          ))}
        </div>
      )}
    </div>
  );
};
