import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCar, FaSuitcaseRolling, FaRobot } from "react-icons/fa";
import { GiBoatFishing } from "react-icons/gi";
import { MdFlight, MdHotel } from "react-icons/md";
import { Calendar, CalendarDays, Users, MapPin } from "lucide-react";
import DuffelAirportAutocomplete from "@/components/DuffelAirportAutocomplete";
import HereLocationAutocomplete from "@/components/HereLocationAutocomplete";

interface BookingTab {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface UnifiedBookingWidgetProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

// Use the exact types from the components
type DuffelAirport = {
  id: string;
  name: string;
  iata_code: string;
  city: { name: string };
  country: { name: string };
};

type HereLocation = {
  id: string;
  address: {
    label: string;
    city?: string;
    state?: string;
    country?: string;
  };
  position?: {
    lat: number;
    lng: number;
  };
};

export const UnifiedBookingWidget = ({ activeTab, onTabChange, className = "" }: UnifiedBookingWidgetProps) => {
  const [origin, setOrigin] = useState<DuffelAirport | null>(null);
  const [destination, setDestination] = useState<DuffelAirport | null>(null);
  const [hotelLocation, setHotelLocation] = useState<HereLocation | null>(null);
  const [carLocation, setCarLocation] = useState<HereLocation | null>(null);
  const [packageLocation, setPackageLocation] = useState<HereLocation | null>(null);
  const [cruisePort, setCruisePort] = useState<HereLocation | null>(null);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const tabs: BookingTab[] = [
    { key: "flights", label: "Flights", icon: <MdFlight className="w-4 h-4" /> },
    { key: "hotels", label: "Hotels", icon: <MdHotel className="w-4 h-4" /> },
    { key: "cars", label: "Cars", icon: <FaCar className="w-4 h-4" /> },
    { key: "packages", label: "Packages", icon: <FaSuitcaseRolling className="w-4 h-4" /> },
    { key: "cruises", label: "Cruises", icon: <GiBoatFishing className="w-4 h-4" /> },
    { key: "ai", label: "AI Buddy", icon: <FaRobot className="w-4 h-4" /> }
  ];

  const buildExpediaFlightUrl = () => {
    if (!origin || !destination || !departDate) return "";
    
    const baseUrl = "https://www.expedia.com/Flights-Search";
    const params = new URLSearchParams({
      trip: returnDate ? "roundtrip" : "oneway",
      leg1: `from:${origin.iata_code},to:${destination.iata_code},departure:${departDate}`,
      passengers: `adults:${passengers}`,
      mode: "search",
      camref: "1101l5dQSW"
    });

    if (returnDate) {
      params.set("leg2", `from:${destination.iata_code},to:${origin.iata_code},departure:${returnDate}`);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const buildExpediaHotelUrl = () => {
    if (!hotelLocation || !checkIn || !checkOut) return "";
    
    const baseUrl = "https://www.expedia.com/Hotel-Search";
    const params = new URLSearchParams({
      destination: hotelLocation.address.label,
      startDate: checkIn,
      endDate: checkOut,
      rooms: rooms.toString(),
      adults: guests.toString(),
      camref: "1101l5dQSW"
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const buildExpediaCarUrl = () => {
    if (!carLocation || !pickupDate || !dropoffDate) return "";
    
    const baseUrl = "https://www.expedia.com/Cars";
    const params = new URLSearchParams({
      locn: carLocation.address.label,
      date1: pickupDate,
      date2: dropoffDate,
      camref: "1101l5dQSW"
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const buildExpediaPackageUrl = () => {
    if (!packageLocation || !departDate || !returnDate) return "";
    
    const baseUrl = "https://www.expedia.com/Packages";
    const params = new URLSearchParams({
      flight_origin: "nearby",
      flight_destination: packageLocation.address.label,
      hotel_destination: packageLocation.address.label,
      departure_date: departDate,
      return_date: returnDate,
      travelers: passengers.toString(),
      camref: "1101l5dQSW"
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const buildExpediaCruiseUrl = () => {
    if (!cruisePort || !departDate) return "";
    
    const baseUrl = "https://www.expedia.com/Cruises";
    const params = new URLSearchParams({
      destination: cruisePort.address.label,
      startDate: departDate,
      length: "7",
      camref: "1101l5dQSW"
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const handleSearch = () => {
    let url = "";
    
    switch (activeTab) {
      case "flights":
        url = buildExpediaFlightUrl();
        break;
      case "hotels":
        url = buildExpediaHotelUrl();
        break;
      case "cars":
        url = buildExpediaCarUrl();
        break;
      case "packages":
        url = buildExpediaPackageUrl();
        break;
      case "cruises":
        url = buildExpediaCruiseUrl();
        break;
      case "ai":
        // Navigate to AI travel page
        window.open("/ai-travel", "_blank");
        return;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "flights":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">From</Label>
                <DuffelAirportAutocomplete
                  label=""
                  placeholder="Departure airport"
                  onSelect={(airport) => setOrigin(airport)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="destination">To</Label>
                <DuffelAirportAutocomplete
                  label=""
                  placeholder="Arrival airport"
                  onSelect={(airport) => setDestination(airport)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="departDate">Departure</Label>
                <Input
                  id="departDate"
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="returnDate">Return (optional)</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="passengers">Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case "hotels":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hotelLocation">Destination</Label>
              <HereLocationAutocomplete
                label=""
                placeholder="Enter city or hotel name"
                onSelect={(location) => setHotelLocation(location)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="rooms">Rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    min="1"
                    max="8"
                    value={rooms}
                    onChange={(e) => setRooms(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="guests">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="16"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "cars":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="carLocation">Pick-up Location</Label>
              <HereLocationAutocomplete
                label=""
                placeholder="Enter pick-up location"
                onSelect={setCarLocation}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pick-up Date & Time</Label>
                <Input
                  id="pickupDate"
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dropoffDate">Drop-off Date & Time</Label>
                <Input
                  id="dropoffDate"
                  type="datetime-local"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case "packages":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="packageLocation">Destination</Label>
              <HereLocationAutocomplete
                label=""
                placeholder="Enter destination"
                onSelect={setPackageLocation}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="departDate">Departure</Label>
                <Input
                  id="departDate"
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="returnDate">Return</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="travelers">Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case "cruises":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cruisePort">Departure Port</Label>
              <HereLocationAutocomplete
                label=""
                placeholder="Enter departure port"
                onSelect={setCruisePort}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sailDate">Sail Date</Label>
                <Input
                  id="sailDate"
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cruiseLength">Length</Label>
                <select 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="7"
                >
                  <option value="3">3 nights</option>
                  <option value="7">7 nights</option>
                  <option value="10">10 nights</option>
                  <option value="14">14 nights</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-4 text-center">
            <div className="py-8">
              <FaRobot className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Travel Assistant</h3>
              <p className="text-gray-600 mb-6">
                Let our AI help you plan the perfect trip based on your preferences and budget.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-1 mb-6 bg-gray-50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="mb-6">
        {renderForm()}
      </div>

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
        size="lg"
      >
        {activeTab === "ai" ? "Start AI Planning" : `Search ${tabs.find(t => t.key === activeTab)?.label}`}
      </Button>

      {/* Expedia Attribution */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by Expedia TAAP • Book with confidence
      </div>
    </div>
  );
};

export default UnifiedBookingWidget;
