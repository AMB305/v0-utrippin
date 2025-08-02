import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TravelSearchBarProps {
  onSearch?: (query: string) => void;
}

export const TravelSearchBar: React.FC<TravelSearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-mobile-text-primary mb-1">Where to?</h1>
        <p className="text-mobile-text-secondary text-sm">Discover amazing places</p>
      </div>
      
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mobile-text-secondary w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="London"
            className="pl-10 pr-4 py-3 bg-mobile-card-bg border-mobile-border-color text-mobile-text-primary placeholder:text-mobile-text-secondary rounded-xl text-base h-12"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-travel-blue hover:bg-travel-blue-dark text-white px-4 py-3 rounded-xl h-12 min-w-12"
          size="lg"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
