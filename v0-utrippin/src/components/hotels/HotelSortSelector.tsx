import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface HotelSortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  className?: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating_high', label: 'Rating: High to Low' },
  { value: 'rating_low', label: 'Rating: Low to High' },
  { value: 'distance', label: 'Distance from Center' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

export function HotelSortSelector({ value, onChange, resultCount, className }: HotelSortSelectorProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-muted-foreground">
        {resultCount !== undefined && (
          <span>{resultCount} hotel{resultCount !== 1 ? 's' : ''} found</span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
