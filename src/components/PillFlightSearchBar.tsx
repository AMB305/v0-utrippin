import { useState, useEffect } from "react";
import { Search, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import SimpleAirportAutocomplete from "./SimpleAirportAutocomplete";
import DateSelectionModal from "./DateSelectionModal";
import PassengerModal from "./PassengerModal";
import { DuffelAirport, duffelClient, DuffelOfferRequest } from "@/lib/duffel";

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface SearchData {
  origin: DuffelAirport | null;
  destination: DuffelAirport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: PassengerCount;
  cabinClass: string;
  tripType: "round_trip" | "one_way";
}

interface PillFlightSearchBarProps {
  defaultOrigin?: DuffelAirport | null;
  defaultDestination?: DuffelAirport | null;
  defaultDates?: {
    departure?: Date;
    return?: Date;
  };
}

export default function PillFlightSearchBar({
  defaultOrigin,
  defaultDestination,
  defaultDates
}: PillFlightSearchBarProps) {
  const navigate = useNavigate();
  
  const [searchData, setSearchData] = useState<SearchData>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: "economy",
    tripType: "round_trip"
  });

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Update with default values
  useEffect(() => {
    if (defaultOrigin || defaultDestination || defaultDates) {
      setSearchData(prev => ({
        ...prev,
        origin: defaultOrigin || prev.origin,
        destination: defaultDestination || prev.destination,
        departureDate: defaultDates?.departure || prev.departureDate,
        returnDate: defaultDates?.return || prev.returnDate
      }));
    }
  }, [defaultOrigin, defaultDestination, defaultDates]);

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
      departureDate: dates.departureDate || null,
      returnDate: dates.returnDate || null,
      tripType: dates.returnDate ? "round_trip" : "one_way"
    }));
  };

  const handlePassengerSelection = (passengers: PassengerCount, cabinClass: string) => {
    setSearchData(prev => ({
      ...prev,
      passengers,
      cabinClass
    }));
  };

  const handleFlightSearch = async () => {
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to search for flights.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const request: DuffelOfferRequest = {
        slices: [
          {
            origin: searchData.origin.iata_code,
            destination: searchData.destination.iata_code,
            departure_date: searchData.departureDate.toISOString().split('T')[0],
          }
        ],
        passengers: [
          ...Array(searchData.passengers.adults).fill({ type: "adult" }),
          ...Array(searchData.passengers.children).fill({ type: "child" }),
          ...Array(searchData.passengers.infants).fill({ type: "infant_without_seat" })
        ],
        cabin_class: searchData.cabinClass as "economy" | "premium_economy" | "business" | "first"
      };

      if (searchData.tripType === "round_trip" && searchData.returnDate) {
        request.slices.push({
          origin: searchData.destination.iata_code,
          destination: searchData.origin.iata_code,
          departure_date: searchData.returnDate.toISOString().split('T')[0],
        });
      }

      const offers = await duffelClient.createOfferRequest(request);

      const params = new URLSearchParams({
        origin: searchData.origin.iata_code,
        destination: searchData.destination.iata_code,
        departure: searchData.departureDate.toISOString().split('T')[0],
        ...(searchData.returnDate && { return: searchData.returnDate.toISOString().split('T')[0] }),
        adults: searchData.passengers.adults.toString(),
        children: searchData.passengers.children.toString(),
        infants: searchData.passengers.infants.toString(),
        cabinClass: searchData.cabinClass,
        tripType: searchData.tripType
      });

      navigate(`/flights/results?${params.toString()}`);
      
      toast({
        title: "Search Complete",
        description: `Found ${offers.data?.length || 0} flight options`,
      });
    } catch (error) {
      console.error("Flight search error:", error);
      toast({
        title: "Search Error",
        description: "Unable to search flights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatDateRange = () => {
    if (!searchData.departureDate) return "Select dates";
    
    const departure = searchData.departureDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    
    if (searchData.tripType === "one_way" || !searchData.returnDate) {
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
            disabled={isSearching}
            className="flex-shrink-0 w-14 h-14 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
          >
            <Search className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Date Selection Modal */}
      <DateSelectionModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSelect={handleDateSelection}
        departureDate={searchData.departureDate || undefined}
        returnDate={searchData.returnDate || undefined}
        tripType={searchData.tripType === "round_trip" ? "round-trip" : "one-way"}
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
}
