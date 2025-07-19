import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Plane } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { DuffelAirport, duffelClient, DuffelOfferRequest } from "@/lib/duffel";
import SimpleAirportAutocomplete from './SimpleAirportAutocomplete';
import DateSelectionModal from './DateSelectionModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface SearchData {
  origin: DuffelAirport | null;
  destination: DuffelAirport | null;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: PassengerCount;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

interface ModernFlightSearchBarProps {
  defaultOrigin?: DuffelAirport | null;
  defaultDestination?: DuffelAirport | null;
  defaultDepartureDate?: Date;
  defaultReturnDate?: Date;
}

export default function ModernFlightSearchBar({ 
  defaultOrigin,
  defaultDestination,
  defaultDepartureDate,
  defaultReturnDate
}: ModernFlightSearchBarProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    origin: null,
    destination: null,
    departureDate: undefined,
    returnDate: undefined,
    passengers: { adults: 1, children: 0, infants: 0 },
    tripType: 'round-trip',
    cabinClass: 'economy'
  });

  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showPassengerSelector, setShowPassengerSelector] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultOrigin) {
      setSearchData(prev => ({ ...prev, origin: defaultOrigin }));
    }
    if (defaultDestination) {
      setSearchData(prev => ({ ...prev, destination: defaultDestination }));
    }
    if (defaultDepartureDate) {
      setSearchData(prev => ({ ...prev, departureDate: defaultDepartureDate }));
    }
    if (defaultReturnDate) {
      setSearchData(prev => ({ ...prev, returnDate: defaultReturnDate }));
    }
  }, [defaultOrigin, defaultDestination, defaultDepartureDate, defaultReturnDate]);

  const handleFlightSearch = async () => {
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    
    try {
      const offerRequest: DuffelOfferRequest = {
        slices: [
          {
            origin: searchData.origin.iata_code,
            destination: searchData.destination.iata_code,
            departure_date: format(searchData.departureDate, 'yyyy-MM-dd'),
          }
        ],
        passengers: Array.from({ length: searchData.passengers.adults }, () => ({ type: 'adult' as const })),
        cabin_class: searchData.cabinClass as any,
      };

      // Add return slice for round trip
      if (searchData.tripType === 'round-trip' && searchData.returnDate) {
        offerRequest.slices.push({
          origin: searchData.destination.iata_code,
          destination: searchData.origin.iata_code,
          departure_date: format(searchData.returnDate, 'yyyy-MM-dd'),
        });
      }

      console.log('Searching flights with:', offerRequest);
      
      const result = await duffelClient.createOfferRequest(offerRequest);
      
      if (result.data && result.data.length > 0) {
        // Navigate to results page with search params
        const searchParams = new URLSearchParams({
          origin: searchData.origin.iata_code,
          destination: searchData.destination.iata_code,
          departure: format(searchData.departureDate, 'yyyy-MM-dd'),
          ...(searchData.returnDate && { return: format(searchData.returnDate, 'yyyy-MM-dd') }),
          adults: searchData.passengers.adults.toString(),
          cabin: searchData.cabinClass,
          type: searchData.tripType,
        });
        
        navigate(`/flight-results?${searchParams.toString()}`);
        toast.success(`Found ${result.data.length} flights!`);
      } else {
        toast.error('No flights found for your search criteria');
      }
    } catch (error) {
      console.error('Flight search error:', error);
      toast.error('Failed to search flights. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatDateRange = () => {
    if (!searchData.departureDate) return "Select dates";
    
    const depDate = format(searchData.departureDate, 'EEE, d MMM');
    if (searchData.tripType === 'round-trip' && searchData.returnDate) {
      const retDate = format(searchData.returnDate, 'EEE, d MMM');
      return `${depDate} - ${retDate}`;
    }
    return depDate;
  };

  const formatPassengers = () => {
    const parts = [];
    if (searchData.passengers.adults > 0) {
      parts.push(`${searchData.passengers.adults} Adult${searchData.passengers.adults > 1 ? 's' : ''}`);
    }
    if (searchData.passengers.children > 0) {
      parts.push(`${searchData.passengers.children} Child${searchData.passengers.children > 1 ? 'ren' : ''}`);
    }
    if (searchData.passengers.infants > 0) {
      parts.push(`${searchData.passengers.infants} Infant${searchData.passengers.infants > 1 ? 's' : ''}`);
    }
    
    const passengerText = parts.join(', ');
    const classText = searchData.cabinClass.charAt(0).toUpperCase() + searchData.cabinClass.slice(1).replace('_', ' ');
    
    return `${passengerText}, ${classText}`;
  };

  const updatePassengers = (type: keyof PassengerCount, value: number) => {
    setSearchData(prev => ({
      ...prev,
      passengers: { ...prev.passengers, [type]: Math.max(0, value) }
    }));
  };

  return (
    <div className="w-full">
      {/* Clean Rounded Search Container */}
      <div className="bg-white rounded-3xl shadow-lg p-2 flex flex-col md:flex-row items-stretch gap-0 w-full max-w-none overflow-hidden">
        {/* From Field */}
        <div className="flex-1 px-4 py-4 flex flex-col justify-center min-h-[80px] border-r border-gray-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Where from?</div>
          <SimpleAirportAutocomplete
            placeholder="Origin"
            value={searchData.origin}
            onChange={(airport) => setSearchData(prev => ({ ...prev, origin: airport }))}
            className="border-none shadow-none bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-0 p-0 h-auto"
          />
        </div>

        {/* Swap Button */}
        <div className="hidden md:flex items-center justify-center px-2">
          <button 
            onClick={() => setSearchData(prev => ({ 
              ...prev, 
              origin: prev.destination, 
              destination: prev.origin 
            }))}
            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* To Field */}
        <div className="flex-1 px-4 py-4 flex flex-col justify-center min-h-[80px] border-r border-gray-200">
          <div className="text-sm text-gray-500 font-medium mb-1">Where to?</div>
          <SimpleAirportAutocomplete
            placeholder="Destination"
            value={searchData.destination}
            onChange={(airport) => setSearchData(prev => ({ ...prev, destination: airport }))}
            className="border-none shadow-none bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-0 p-0 h-auto"
          />
        </div>

        {/* Dates Field */}
        <div 
          className="flex-1 px-4 py-4 flex flex-col justify-center min-h-[80px] border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowDepartureCalendar(true)}
        >
          <div className="text-sm text-gray-500 font-medium mb-1">Dates</div>
          <div className="text-base text-gray-900">{formatDateRange()}</div>
        </div>

        {/* Passengers Field */}
        <Popover open={showPassengerSelector} onOpenChange={setShowPassengerSelector}>
          <PopoverTrigger asChild>
            <div className="flex-1 px-4 py-4 flex flex-col justify-center min-h-[80px] border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="text-sm text-gray-500 font-medium mb-1">Passengers</div>
              <div className="text-base text-gray-900">{formatPassengers()}</div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white border shadow-lg z-50" align="start">
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-muted-foreground">Age 18+</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengers('adults', searchData.passengers.adults - 1)}
                    disabled={searchData.passengers.adults <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{searchData.passengers.adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengers('adults', searchData.passengers.adults + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-muted-foreground">Age 2-17</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengers('children', searchData.passengers.children - 1)}
                    disabled={searchData.passengers.children <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{searchData.passengers.children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengers('children', searchData.passengers.children + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-sm text-muted-foreground">Under 2</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengers('infants', searchData.passengers.infants - 1)}
                    disabled={searchData.passengers.infants <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{searchData.passengers.infants}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePassengers('infants', searchData.passengers.infants + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cabin Class</label>
                <Select 
                  value={searchData.cabinClass}
                  onValueChange={(value: any) => setSearchData(prev => ({ ...prev, cabinClass: value }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium_economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <div className="px-3 py-2 flex items-center">
          <Button 
            onClick={handleFlightSearch}
            disabled={isSearching || !searchData.origin || !searchData.destination || !searchData.departureDate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-base font-semibold disabled:opacity-50 rounded-full min-w-[60px] h-[60px] flex items-center justify-center"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Date Selection Modal */}
      <DateSelectionModal
        isOpen={showDepartureCalendar}
        onClose={() => setShowDepartureCalendar(false)}
        onSelect={(dates) => {
          setSearchData(prev => ({
            ...prev,
            departureDate: dates.departureDate,
            returnDate: dates.returnDate
          }));
        }}
        departureDate={searchData.departureDate}
        returnDate={searchData.returnDate}
        tripType={searchData.tripType}
        title="Departure"
      />
    </div>
  );
}