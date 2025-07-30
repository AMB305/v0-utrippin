import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudRain, Sun, Snowflake, Wind, Thermometer } from 'lucide-react';

interface FiltersSidebarProps {
  onFiltersChange: (filters: any) => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ onFiltersChange }) => {
  const [budgetRange, setBudgetRange] = useState([0, 10000]);
  const [travelTime, setTravelTime] = useState([0, 100]);
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);
  const [selectedPollution, setSelectedPollution] = useState<string[]>([]);
  const [selectedTemperature, setSelectedTemperature] = useState<string[]>([]);

  const budgetLabels = ['$0', '$1K', '$5K', '$10K', '$20K', '$50K', '$1L+'];
  
  const weatherOptions = [
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'no-rain', label: 'No Rain', icon: Sun },
    { id: 'snow', label: 'Snow', icon: Snowflake },
  ];

  const pollutionOptions = [
    { id: 'pollution-free', label: 'Pollution Free', icon: Wind },
    { id: 'colder', label: 'Colder', icon: Snowflake },
  ];

  const temperatureOptions = [
    { id: 'warmer', label: 'Warmer', icon: Thermometer },
  ];

  const handleWeatherToggle = (weatherId: string) => {
    setSelectedWeather(prev => 
      prev.includes(weatherId) 
        ? prev.filter(id => id !== weatherId)
        : [...prev, weatherId]
    );
  };

  const handlePollutionToggle = (pollutionId: string) => {
    setSelectedPollution(prev => 
      prev.includes(pollutionId) 
        ? prev.filter(id => id !== pollutionId)
        : [...prev, pollutionId]
    );
  };

  const handleTemperatureToggle = (tempId: string) => {
    setSelectedTemperature(prev => 
      prev.includes(tempId) 
        ? prev.filter(id => id !== tempId)
        : [...prev, tempId]
    );
  };

  const clearAllFilters = () => {
    setBudgetRange([0, 10000]);
    setTravelTime([0, 100]);
    setSelectedWeather([]);
    setSelectedPollution([]);
    setSelectedTemperature([]);
    onFiltersChange({
      budget: [0, 10000],
      travelTime: [0, 100],
      weather: [],
      pollution: [],
      temperature: []
    });
  };

  return (
    <div className="w-80 bg-background border-r border-border p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllFilters}
          className="text-primary hover:text-primary/80"
        >
          Clear All
        </Button>
      </div>

      {/* Budget Section */}
      <div className="mb-8">
        <Label className="text-base font-medium mb-4 block">Budget</Label>
        <div className="px-2">
          <Slider
            value={budgetRange}
            onValueChange={setBudgetRange}
            max={10000}
            min={0}
            step={100}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {budgetLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Time Section */}
      <div className="mb-8">
        <Label className="text-base font-medium mb-4 block">Travel time</Label>
        <div className="px-2">
          <Slider
            value={travelTime}
            onValueChange={setTravelTime}
            max={100}
            min={0}
            step={1}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>10hr+</span>
          </div>
        </div>
      </div>

      {/* Weather & AQI Section */}
      <div className="mb-6">
        <Label className="text-base font-medium mb-4 block">Weather & AQI</Label>
        
        {/* Weather Options */}
        <div className="flex flex-wrap gap-2 mb-4">
          {weatherOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedWeather.includes(option.id);
            return (
              <Badge
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-2 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => handleWeatherToggle(option.id)}
              >
                <IconComponent className="w-4 h-4" />
                {option.label}
              </Badge>
            );
          })}
        </div>

        {/* Pollution Options */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pollutionOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedPollution.includes(option.id);
            return (
              <Badge
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-2 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => handlePollutionToggle(option.id)}
              >
                <IconComponent className="w-4 h-4" />
                {option.label}
              </Badge>
            );
          })}
        </div>

        {/* Temperature Options */}
        <div className="flex flex-wrap gap-2">
          {temperatureOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedTemperature.includes(option.id);
            return (
              <Badge
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-2 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => handleTemperatureToggle(option.id)}
              >
                <IconComponent className="w-4 h-4" />
                {option.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Feedback Button */}
      <Button 
        variant="outline" 
        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        📝 Feedback
      </Button>
    </div>
  );
};