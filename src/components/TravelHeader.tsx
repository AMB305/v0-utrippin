import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import UtrippinLogo from '@/components/UtrippinLogo';

interface TravelHeaderProps {
  onCreateTripWithAI: () => void;
}

export const TravelHeader: React.FC<TravelHeaderProps> = ({ onCreateTripWithAI }) => {
  const [fromLocation, setFromLocation] = useState('San Juan');
  const [travelMonth, setTravelMonth] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState('');

  const popularLocations = [
    'San Juan', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Location and Date */}
        <div className="flex items-center gap-4">
          {/* Travel Type Selector */}
          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              onClick={() => console.log('Staycation selected')}
            >
              Staycation
            </button>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              onClick={() => console.log('Vacation selected')}
            >
              Vacation
            </button>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Right side - Create Trip Button */}
        <Button 
          onClick={onCreateTripWithAI}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full shadow-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create trip with AI
        </Button>
      </div>
    </div>
  );
};
