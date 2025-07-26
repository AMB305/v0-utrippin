import React from 'react';
import { Button } from './ui/button';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  'All',
  'Religious',
  'Cultural', 
  'Nature',
  'Food',
  'Festivals',
  'Historical',
  'Shopping',
  'Beaches',
  'Mountains',
  'Outdoors',
  'Nightlife',
  'Luxury',
  'Wellness',
  'Romance',
  'NightSkies',
  'Sports',
  'Offbeat'
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category)}
            className="text-sm font-medium"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};