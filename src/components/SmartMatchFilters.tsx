import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { MatchFilters } from '@/hooks/useSmartMatching';

interface SmartMatchFiltersProps {
  filters: MatchFilters;
  onFiltersChange: (filters: MatchFilters) => void;
  onApply: () => void;
  onReset: () => void;
  loading?: boolean;
  resultsCount?: number;
}

const POPULAR_DESTINATIONS = [
  'Japan', 'Thailand', 'Italy', 'France', 'Spain', 'Greece', 'Morocco',
  'Peru', 'New Zealand', 'Iceland', 'Croatia', 'Portugal', 'Turkey',
  'Bali', 'Vietnam', 'Norway', 'Egypt', 'India', 'Mexico', 'Australia'
];

export const SmartMatchFilters: React.FC<SmartMatchFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  loading = false,
  resultsCount
}) => {
  const updateFilter = (key: keyof MatchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleAgeRangeChange = (value: number[]) => {
    updateFilter('maxAgeDiff', value[0]);
  };

  const handleMinScoreChange = (value: number[]) => {
    updateFilter('minScore', value[0] / 100);
  };

  const isFilterActive = () => {
    return !!(
      filters.destination || 
      (filters.maxAgeDiff && filters.maxAgeDiff !== 15) ||
      (filters.minScore && filters.minScore !== 0.3) ||
      (filters.limit && filters.limit !== 20)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5" />
          Smart Matching Filters
          {isFilterActive() && (
            <Badge variant="secondary" className="ml-auto">
              Active
            </Badge>
          )}
        </CardTitle>
        {resultsCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            {resultsCount} potential travel buddies found
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Destination Filter */}
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Select
            value={filters.destination || ''}
            onValueChange={(value) => updateFilter('destination', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any destination</SelectItem>
              {POPULAR_DESTINATIONS.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age Difference */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Maximum Age Difference</Label>
            <span className="text-sm text-muted-foreground">
              ±{filters.maxAgeDiff || 15} years
            </span>
          </div>
          <Slider
            value={[filters.maxAgeDiff || 15]}
            onValueChange={handleAgeRangeChange}
            max={25}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>25 years</span>
          </div>
        </div>

        {/* Minimum Match Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Minimum Compatibility</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round((filters.minScore || 0.3) * 100)}%
            </span>
          </div>
          <Slider
            value={[Math.round((filters.minScore || 0.3) * 100)]}
            onValueChange={handleMinScoreChange}
            max={90}
            min={10}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>90%</span>
          </div>
        </div>

        {/* Results Limit */}
        <div className="space-y-2">
          <Label htmlFor="limit">Number of Results</Label>
          <Select
            value={String(filters.limit || 20)}
            onValueChange={(value) => updateFilter('limit', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 matches</SelectItem>
              <SelectItem value="20">20 matches</SelectItem>
              <SelectItem value="50">50 matches</SelectItem>
              <SelectItem value="100">100 matches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            onClick={onApply} 
            disabled={loading}
            className="flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Finding Matches...' : 'Apply Filters'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={loading}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Active Filters Summary */}
        {isFilterActive() && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-1">
              {filters.destination && (
                <Badge variant="secondary" className="text-xs">
                  📍 {filters.destination}
                </Badge>
              )}
              {filters.maxAgeDiff && filters.maxAgeDiff !== 15 && (
                <Badge variant="secondary" className="text-xs">
                  👥 ±{filters.maxAgeDiff} years
                </Badge>
              )}
              {filters.minScore && filters.minScore !== 0.3 && (
                <Badge variant="secondary" className="text-xs">
                  ⭐ {Math.round(filters.minScore * 100)}%+ match
                </Badge>
              )}
              {filters.limit && filters.limit !== 20 && (
                <Badge variant="secondary" className="text-xs">
                  📊 {filters.limit} results
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
