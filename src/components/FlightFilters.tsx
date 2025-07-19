import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { DuffelOffer } from "@/lib/duffel";
import { FilterCriteria, getFilterOptions } from "@/utils/groupOffersByFlight";

interface FlightFiltersProps {
  offers: DuffelOffer[];
  onFiltersChange: (filters: FilterCriteria) => void;
}

const FlightFilters = ({ offers, onFiltersChange }: FlightFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedCabinTypes, setSelectedCabinTypes] = useState<string[]>([]);
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState<string[]>([]);
  const [selectedArrivalTimes, setSelectedArrivalTimes] = useState<string[]>([]);
  const [maxDuration, setMaxDuration] = useState(24);

  // Get dynamic filter options from current offers
  const filterOptions = getFilterOptions(offers);

  // Initialize filter ranges based on actual offer data
  useEffect(() => {
    setPriceRange(filterOptions.priceRange);
    setMaxDuration(filterOptions.maxDuration);
  }, [offers]);

  // Emit filter changes
  useEffect(() => {
    const filters: FilterCriteria = {
      priceRange,
      airlines: selectedAirlines,
      stops: selectedStops,
      cabinTypes: selectedCabinTypes,
      departureTimeRanges: selectedDepartureTimes,
      arrivalTimeRanges: selectedArrivalTimes,
      maxDuration
    };
    onFiltersChange(filters);
  }, [priceRange, selectedAirlines, selectedStops, selectedCabinTypes, selectedDepartureTimes, selectedArrivalTimes, maxDuration]);

  const stops = ["Non-stop", "1 stop", "2+ stops"];
  const cabinTypes = filterOptions.cabinTypes;
  const timeRanges = ["Morning (5-12)", "Afternoon (12-6)", "Evening (6-12)"];

  const toggleAirline = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline) 
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };

  const toggleStops = (stop: string) => {
    setSelectedStops(prev => 
      prev.includes(stop) 
        ? prev.filter(s => s !== stop)
        : [...prev, stop]
    );
  };

  const toggleCabinType = (cabin: string) => {
    setSelectedCabinTypes(prev => 
      prev.includes(cabin) 
        ? prev.filter(c => c !== cabin)
        : [...prev, cabin]
    );
  };

  const toggleDepartureTime = (time: string) => {
    setSelectedDepartureTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const toggleArrivalTime = (time: string) => {
    setSelectedArrivalTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const clearFilters = () => {
    setPriceRange(filterOptions.priceRange);
    setSelectedAirlines([]);
    setSelectedStops([]);
    setSelectedCabinTypes([]);
    setSelectedDepartureTimes([]);
    setSelectedArrivalTimes([]);
    setMaxDuration(filterOptions.maxDuration);
  };

  return (
    <Card className="p-6 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={filterOptions.priceRange[1]}
              min={filterOptions.priceRange[0]}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Airlines */}
        <div>
          <h4 className="font-medium mb-3">Airlines</h4>
          <div className="space-y-3">
            {filterOptions.airlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={airline}
                  checked={selectedAirlines.includes(airline)}
                  onCheckedChange={() => toggleAirline(airline)}
                />
                <label
                  htmlFor={airline}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {airline}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Stops */}
        <div>
          <h4 className="font-medium mb-3">Stops</h4>
          <div className="space-y-3">
            {stops.map((stop) => (
              <div key={stop} className="flex items-center space-x-2">
                <Checkbox
                  id={stop}
                  checked={selectedStops.includes(stop)}
                  onCheckedChange={() => toggleStops(stop)}
                />
                <label
                  htmlFor={stop}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {stop}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Cabin Types */}
        <div>
          <h4 className="font-medium mb-3">Cabin Class</h4>
          <div className="space-y-3">
            {cabinTypes.map((cabin) => (
              <div key={cabin} className="flex items-center space-x-2">
                <Checkbox
                  id={cabin}
                  checked={selectedCabinTypes.includes(cabin)}
                  onCheckedChange={() => toggleCabinType(cabin)}
                />
                <label
                  htmlFor={cabin}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {cabin}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Max Duration */}
        <div>
          <h4 className="font-medium mb-3">Max Duration</h4>
          <div className="px-2">
            <Slider
              value={[maxDuration]}
              onValueChange={(value) => setMaxDuration(value[0])}
              max={filterOptions.maxDuration}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>1h</span>
              <span>{maxDuration}h</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Departure Times */}
        <div>
          <h4 className="font-medium mb-3">Departure Times</h4>
          <div className="space-y-3">
            {timeRanges.map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <Checkbox
                  id={`dep-${time}`}
                  checked={selectedDepartureTimes.includes(time)}
                  onCheckedChange={() => toggleDepartureTime(time)}
                />
                <label
                  htmlFor={`dep-${time}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {time}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Arrival Times */}
        <div>
          <h4 className="font-medium mb-3">Arrival Times</h4>
          <div className="space-y-3">
            {timeRanges.map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <Checkbox
                  id={`arr-${time}`}
                  checked={selectedArrivalTimes.includes(time)}
                  onCheckedChange={() => toggleArrivalTime(time)}
                />
                <label
                  htmlFor={`arr-${time}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {time}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlightFilters;