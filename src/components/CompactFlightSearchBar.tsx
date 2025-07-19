import { useState, useEffect } from "react";
import { Search, ArrowLeftRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SimpleAirportAutocomplete from "./SimpleAirportAutocomplete";
import DateSelectionModal from "./DateSelectionModal";
import PassengerModal from "./PassengerModal";
import { DuffelAirport } from "@/lib/duffel";

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface SearchFormData {
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  origin: DuffelAirport | null;
  destination: DuffelAirport | null;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: PassengerCount;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

interface CompactFlightSearchBarProps {
  onSearch: (searchData: SearchFormData) => void;
  loading?: boolean;
}

const CompactFlightSearchBar = ({ onSearch, loading = false }: CompactFlightSearchBarProps) => {
  const [searchData, setSearchData] = useState<SearchFormData>({
    tripType: 'round-trip',
    origin: null,
    destination: null,
    departureDate: undefined,
    returnDate: undefined,
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'economy'
  });

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);

  const handleSwapAirports = () => {
    setSearchData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleDateSelection = (dates: { departureDate: Date | undefined; returnDate: Date | undefined }) => {
    setSearchData(prev => ({
      ...prev,
      departureDate: dates.departureDate,
      returnDate: dates.returnDate,
      tripType: dates.returnDate ? 'round-trip' : 'one-way'
    }));
  };

  const handlePassengerSelection = (passengers: PassengerCount, cabinClass: string) => {
    setSearchData(prev => ({
      ...prev,
      passengers,
      cabinClass: cabinClass as 'economy' | 'premium_economy' | 'business' | 'first'
    }));
  };

  const handleFlightSearch = () => {
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to search for flights.",
        variant: "destructive",
      });
      return;
    }

    onSearch(searchData);
  };

  const formatDateRange = () => {
    if (!searchData.departureDate) return "Select dates";
    
    const departure = searchData.departureDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    
    if (searchData.tripType === "one-way" || !searchData.returnDate) {
      return departure;
    }
    
    const returnDate = searchData.returnDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    
    return `${departure} - ${returnDate}`;
  };

  const formatPassengers = () => {
    const total = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;
    const cabinClass = searchData.cabinClass === "economy" ? "Economy" : 
                      searchData.cabinClass === "premium_economy" ? "Premium Economy" :
                      searchData.cabinClass === "business" ? "Business" : "First";
    
    return `${total} ${total === 1 ? 'Adult' : 'Passenger'}${total > 1 ? 's' : ''}, ${cabinClass}`;
  };

  return (
    <>
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-full shadow-large py-5 px-8 flex items-center gap-8 relative">
              {/* Origin */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground mb-1">Where from?</div>
                <SimpleAirportAutocomplete
                  placeholder="Origin"
                  value={searchData.origin}
                  onChange={(airport) => setSearchData(prev => ({ ...prev, origin: airport }))}
                  className="border-none p-0 text-lg font-semibold text-primary bg-transparent focus:ring-0"
                />
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapAirports}
                className="flex-shrink-0 w-12 h-12 border-2 border-primary hover:border-primary-hover rounded-full flex items-center justify-center transition-colors bg-transparent"
              >
                <ArrowLeftRight className="w-5 h-5 text-primary" />
              </button>

              {/* Destination */}
              <div className="flex-1 min-w-0 border-l border-gray-300 pl-8">
                <div className="text-xs font-medium text-muted-foreground mb-1">Where to?</div>
                <SimpleAirportAutocomplete
                  placeholder="Destination"
                  value={searchData.destination}
                  onChange={(airport) => setSearchData(prev => ({ ...prev, destination: airport }))}
                  className="border-none p-0 text-lg font-semibold text-primary bg-transparent focus:ring-0"
                />
              </div>

              {/* Dates */}
              <div 
                className="flex-1 min-w-0 border-l border-gray-300 pl-8 cursor-pointer"
                onClick={() => setIsDateModalOpen(true)}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">Dates</div>
                <div className="text-lg font-semibold text-primary">
                  {formatDateRange()}
                </div>
              </div>

              {/* Passengers */}
              <div 
                className="flex-1 min-w-0 border-l border-gray-300 pl-8 cursor-pointer"
                onClick={() => setIsPassengerModalOpen(true)}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">Passengers</div>
                <div className="text-lg font-semibold text-primary">
                  {formatPassengers()}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleFlightSearch}
                disabled={loading}
                className="flex-shrink-0 w-14 h-14 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
              >
                <Search className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection Modal */}
      <DateSelectionModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSelect={handleDateSelection}
        departureDate={searchData.departureDate}
        returnDate={searchData.returnDate}
        tripType={searchData.tripType === "round-trip" ? "round-trip" : "one-way"}
      />

      {/* Passenger Modal */}
      <PassengerModal
        isOpen={isPassengerModalOpen}
        onClose={() => setIsPassengerModalOpen(false)}
        onSelect={handlePassengerSelection}
        initialPassengers={searchData.passengers}
        initialCabinClass={searchData.cabinClass}
      />
    </>
  );
};

export default CompactFlightSearchBar;