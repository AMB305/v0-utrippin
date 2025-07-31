import { useState } from 'react';

export interface TravelTypeSelectorProps {
  onSelect: (type: 'staycation' | 'vacation') => void;
}

export const TravelTypeSelector: React.FC<TravelTypeSelectorProps> = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState<'staycation' | 'vacation' | null>(null);

  const handleSelection = (type: 'staycation' | 'vacation') => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleSelection('staycation')}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          selectedType === 'staycation'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
        }`}
      >
        Staycation
      </button>
      <button
        onClick={() => handleSelection('vacation')}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          selectedType === 'vacation'
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-green-100'
        }`}
      >
        Vacation
      </button>
    </div>
  );
};