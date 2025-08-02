import React from 'react';

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
    <div className="flex items-center gap-6 mb-8 overflow-x-auto px-4">
      {categories.map((category) => (
        <div
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`flex flex-col items-center text-sm cursor-pointer px-2 py-1 whitespace-nowrap ${
            selectedCategory === category 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-600 hover:text-black transition-colors"
          }`}
        >
          <div className="w-6 h-6 bg-gray-200 rounded-full mb-1" />
          {category}
        </div>
      ))}
    </div>
  );
};
