import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SmartDestinationImage } from "@/components/SmartDestinationImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TravelCategories from "@/components/TravelCategories";
import RecommendedDestinations from "@/components/RecommendedDestinations";
import VirtualTravelSection from "@/components/VirtualTravelSection";
import TravelBuddySection from "@/components/TravelBuddySection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import AITripPlanner from "@/components/AITripPlanner";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTracking } from "@/components/ScrollTracking";
import MelaninTrippin from "@/components/MelaninTrippin";
import { usePerformanceTracking } from "@/hooks/usePerformanceTracking";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { organizationSchema, websiteSchema, createLocalBusinessSchema } from "@/utils/structuredData";
import { BackToTop } from '@/components/BackToTop';
import MobileDestinationSlider from "@/components/MobileDestinationSlider";
import { buildHotelUrl, buildCarUrl, buildPackageUrl, buildCruiseUrl, buildFlightUrl } from '@/utils/buildAffiliateUrl';
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory';
import { format } from 'date-fns';
import {
  BuildingOfficeIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  TruckIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon as CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  XMarkIcon,
  MapPinIcon,
  ChevronLeftIcon,
  PlusIcon,
  MinusIcon,
  SparklesIcon,
  ChevronRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Plane, Hotel, Package, Car, Ship, MessageCircle } from "lucide-react";
import SimpleAirportAutocomplete from "@/components/SimpleAirportAutocomplete";
import HereLocationAutocomplete from "@/components/HereLocationAutocomplete";
import { AITravelSelectorMobile } from "@/components/AITravelSelectorMobile";

const tabs = [
  { name: 'Hotels', icon: BuildingOfficeIcon, id: 'hotels' },
  { name: 'Flights', icon: PaperAirplaneIcon, id: 'flights' },
  { name: 'Packages', icon: ArchiveBoxIcon, id: 'packages' },
  { name: 'Cars', icon: TruckIcon, id: 'cars' },
  { name: 'Cruises', icon: HomeIcon, id: 'cruises' },
  { name: 'AI Travel', icon: SparklesIcon, id: 'ai-travel' },
];

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { searchHistory, addSearch, getMostRecentSearch, getRecentSearchesByType } = useSearchHistory();
  
  const localBusinessSchema = createLocalBusinessSchema();
  
  // Track performance metrics for homepage
  usePerformanceTracking({ 
    pageName: 'homepage',
    trackCoreWebVitals: true 
  });

  // State for booking interface copied from PlaneTest.tsx
  const [activeTab, setActiveTab] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [destination, setDestination] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [travelers, setTravelers] = useState(2);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromIataCode, setFromIataCode] = useState('');
  const [toIataCode, setToIataCode] = useState('');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Package-specific states
  const [packageType, setPackageType] = useState('flight-hotel');
  const [packageDestination, setPackageDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Car-specific states
  const [carLocation, setCarLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [dropoffTime, setDropoffTime] = useState('10:00 AM');
  const [driverAge, setDriverAge] = useState(25);

  // Cruise-specific states
  const [cruisePort, setCruisePort] = useState('');
  const [sailDate, setSailDate] = useState('');
  const [cruiseDuration, setCruiseDuration] = useState('7');
  const [cabinType, setCabinType] = useState('interior');

  // Dynamic location suggestions using HERE API
  const [citySuggestions, setCitySuggestions] = useState<Array<{name: string; state: string}>>([]);

  // Filter options
  const filterOptions = [
    'Free Breakfast',
    '3+ Star Rating', 
    '8+ Guest Rating'
  ];

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && !loading) {
        // Check if user has completed profile setup
        const { data: userData } = await supabase
          .from('users')
          .select('age, location, bio, travel_style')
          .eq('id', user.id)
          .single();

        // If user doesn't have basic profile info, redirect to setup
        if (userData && (!userData.age || !userData.location || !userData.bio || !userData.travel_style)) {
          navigate('/profile-setup');
        }
      }
    };

    checkUserProfile();
  }, [user, loading, navigate]);

  // Load most recent search on mount or restore from navigation state
  useEffect(() => {
    // Check if we're restoring a specific search from navigation state
    const stateSearch = routerLocation.state?.restoreSearch;
    if (stateSearch) {
      loadPreviousSearch(stateSearch);
      // Clear the navigation state to prevent re-loading on refresh
      navigate(routerLocation.pathname, { replace: true, state: {} });
      return;
    }

    // Otherwise, load the most recent search
    const recentSearch = getMostRecentSearch();
    if (recentSearch) {
      setDestination(recentSearch.destination);
      if (recentSearch.checkInDate) setCheckIn(recentSearch.checkInDate);
      if (recentSearch.checkOutDate) setCheckOut(recentSearch.checkOutDate);
      if (recentSearch.pickupDate) setPickupDate(recentSearch.pickupDate);
      if (recentSearch.dropoffDate) setDropoffDate(recentSearch.dropoffDate);
      if (recentSearch.guests) setGuests(recentSearch.guests);
      if (recentSearch.rooms) setRooms(recentSearch.rooms);
      if (recentSearch.travelers) setTravelers(recentSearch.travelers);
    }
  }, [routerLocation.state]);

  // Test APIs on page load
  useEffect(() => {
    const runTests = async () => {
      try {
        console.log("🧪 Testing Duffel and HERE APIs...");
        
        // Test Duffel Airport Search
        console.log("🔍 Testing Duffel airport search...");
        const { data: duffelData, error: duffelError } = await supabase.functions.invoke('duffel-search-airports', {
          body: { query: "miami" }
        });

        if (duffelError) {
          console.error("❌ Duffel Error:", duffelError);
        } else {
          console.log("✅ Duffel Success:", duffelData);
        }

        // Test HERE Location Search
        console.log("🔍 Testing HERE location search...");
        const { data: hereData, error: hereError } = await supabase.functions.invoke('here-locations', {
          body: { query: "orlando" }
        });

        if (hereError) {
          console.error("❌ HERE Error:", hereError);
        } else {
          console.log("✅ HERE Success:", hereData);
        }
      } catch (error) {
        console.error("💥 API Test Error:", error);
      }
    };
    
    runTests();
  }, []);

  // Fetch HERE locations for city suggestions
  const fetchHereLocations = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('here-locations', {
        body: { query }
      });

      if (error) {
        console.error('HERE API error:', error);
        setCitySuggestions([]);
      } else {
        const suggestions = data.results?.map((location: any) => ({
          name: location.address.city || location.address.label.split(',')[0],
          state: `${location.address.state || ''}, ${location.address.country || ''}`.replace(/^, /, '')
        })) || [];
        setCitySuggestions(suggestions);
      }
    } catch (error) {
      console.error('HERE API fetch error:', error);
      setCitySuggestions([]);
    }
  };

  // Get filtered city suggestions
  const getFilteredSuggestions = () => {
    return citySuggestions;
  };

  // Handle location selection
  const handleLocationSelect = (city: { name: string; state: string }) => {
    setDestination(`${city.name}, ${city.state.split(',')[0]}`);
    setLocationInput(`${city.name}, ${city.state.split(',')[0]}`);
  };

  // Toggle filter selection
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Handle proceeding to search parameters
  const proceedToSearch = () => {
    if (!destination) return;
    setShowLocationModal(false);
    setShowSearchModal(true);
  };


  // Enhanced flight search with proper Expedia affiliate redirect - WORKING VERSION FROM /FLIGHTS
  const handleFlightSearch = async () => {
    if (!fromIataCode || !toIataCode || !checkIn) return;
    if (tripType === 'roundtrip' && !checkOut) return;

    // Save search to history
    const searchData = {
      searchType: 'flights' as any,
      destination: `${fromLocation} to ${toLocation}`,
      checkInDate: checkIn,
      checkOutDate: tripType === 'roundtrip' ? checkOut : undefined,
      travelers: travelers,
    };

    await addSearch(searchData);

    // Build proper Expedia TAAP link
    const expediaUrl = new URL("https://www.expedia.com/Flights-Search");
    expediaUrl.searchParams.append("trip", tripType);
    expediaUrl.searchParams.append("leg1", `from:${fromIataCode},to:${toIataCode},departure:${checkIn}`);
    
    // Only add return leg for roundtrip
    if (tripType === 'roundtrip' && checkOut) {
      expediaUrl.searchParams.append("leg2", `from:${toIataCode},to:${fromIataCode},departure:${checkOut}`);
    }
    
    expediaUrl.searchParams.append("passengers", `adults:${travelers}`);
    expediaUrl.searchParams.append("mode", "search");
    expediaUrl.searchParams.append("camref", "1101l5dQSW");
    
    console.log('🚀 Opening Expedia with URL:', expediaUrl.toString());
    window.open(expediaUrl.toString(), "_blank");
  };

  // Handle final hotel search
  const handleHotelSearch = async () => {
    if (!destination || !checkIn || !checkOut) return;

    // Save search to history
    const searchData = {
      searchType: 'hotels' as any,
      destination: destination,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: adults + children,
      rooms: rooms,
    };

    await addSearch(searchData);

    // Build Expedia affiliate URL with all parameters
    const hotelUrl = buildHotelUrl({
      destination: destination,
      startDate: checkIn,
      endDate: checkOut,
      rooms: rooms,
      adults: adults
    });
    
    window.open(hotelUrl, '_blank');
    setShowSearchModal(false);
  };

  // Handle package search
  const handlePackageSearch = async () => {
    if (!packageDestination || !departDate || !returnDate) return;

    const searchData = {
      searchType: 'packages' as any,
      destination: packageDestination,
      checkInDate: departDate,
      checkOutDate: returnDate,
      travelers: travelers,
    };

    await addSearch(searchData);

    const packageUrl = buildPackageUrl({
      destination: packageDestination,
      departDate: departDate,
      returnDate: returnDate,
      travelers: travelers,
      packageType: packageType
    });
    
    window.open(packageUrl, '_blank');
  };

  // Handle car search
  const handleCarSearch = async () => {
    if (!carLocation || !pickupDate || !dropoffDate) return;

    const searchData = {
      searchType: 'cars' as any,
      destination: carLocation,
      pickupDate: pickupDate,
      dropoffDate: dropoffDate,
    };

    await addSearch(searchData);

    const carUrl = buildCarUrl({
      location: carLocation,
      pickupDate: pickupDate,
      dropoffDate: dropoffDate
    });
    
    window.open(carUrl, '_blank');
  };

  // Handle cruise search
  const handleCruiseSearch = async () => {
    if (!cruisePort || !sailDate) return;

    const searchData = {
      searchType: 'cruises' as any,
      destination: cruisePort,
      checkInDate: sailDate,
      guests: guests,
    };

    await addSearch(searchData);

    const cruiseUrl = buildCruiseUrl({
      departurePort: cruisePort,
      sailDate: sailDate,
      duration: cruiseDuration,
      guests: guests,
      cabinType: cabinType
    });
    
    window.open(cruiseUrl, '_blank');
  };

  // Handle other tab searches (legacy)
  const handleLegacySearch = async () => {
    switch (activeTab) {
      case 'flights':
        handleFlightSearch();
        break;
      case 'packages':
        handlePackageSearch();
        break;
      case 'cars':
        handleCarSearch();
        break;
      case 'cruises':
        handleCruiseSearch();
        break;
      case 'ai-travel':
        navigate('/ai-travel-buddy');
        break;
    }
  };

  // Get default check-in date (tomorrow)
  const getDefaultCheckIn = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get default check-out date (day after check-in)
  const getDefaultCheckOut = () => {
    const checkInDate = checkIn || getDefaultCheckIn();
    const dayAfter = new Date(checkInDate);
    dayAfter.setDate(dayAfter.getDate() + 1);
    return dayAfter.toISOString().split('T')[0];
  };

  // Set default dates if not set
  useEffect(() => {
    if (!checkIn) setCheckIn(getDefaultCheckIn());
    if (!checkOut) setCheckOut(getDefaultCheckOut());
  }, []);

  const loadPreviousSearch = (search: SearchHistoryItem) => {
    let affiliateUrl = '';
    
    // Build appropriate affiliate URL based on search type
    switch (search.searchType) {
      case 'hotels':
        affiliateUrl = buildHotelUrl({
          destination: search.destination,
          startDate: search.checkInDate,
          endDate: search.checkOutDate,
          rooms: search.rooms || 1,
          adults: search.guests || 1,
          children: 0
        });
        break;
      case 'cars':
        affiliateUrl = buildCarUrl({
          location: search.destination,
          pickupDate: search.pickupDate,
          dropoffDate: search.dropoffDate
        });
        break;
      case 'packages':
        affiliateUrl = buildPackageUrl({
          destination: search.destination,
          departDate: search.checkInDate,
          returnDate: search.checkOutDate,
          travelers: search.travelers || 1
        });
        break;
      case 'cruises':
        affiliateUrl = buildCruiseUrl({
          departurePort: search.destination,
          sailDate: search.checkInDate,
          guests: search.guests || 1
        });
        break;
      default:
        // For flights or unknown types, fall back to hotels
        affiliateUrl = buildHotelUrl({
          destination: search.destination,
          startDate: search.checkInDate,
          endDate: search.checkOutDate,
          rooms: search.rooms || 1,
          adults: search.guests || 1,
          children: 0
        });
    }
    
    // Open affiliate URL in new tab
    window.open(affiliateUrl, '_blank');
  };

  const getTabSpecificRecents = () => {
    return getRecentSearchesByType(activeTab, 1);
  };

  const formatSearchDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead 
        title="AI Travel Booking - Flights, Hotels & More | Utrippin.ai"
        description="Book cheap flights, hotels, cars & more with AI. Discover destinations, plan trips, and find travel buddies on Utrippin.ai - your ultimate travel companion."
        canonical="https://utrippin.ai"
        keywords="AI travel booking, cheap flights, hotels, cars, travel packages, AI trip planner, travel buddies"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            organizationSchema,
            websiteSchema,
            localBusinessSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/#webpage",
              "url": "https://utrippin.ai",
              "name": "AI Travel Booking - Flights, Hotels & More | Utrippin.ai",
              "isPartOf": {
                "@id": "https://utrippin.ai/#website"
              },
              "description": "Book cheap flights, hotels, cars & more with AI. Discover destinations, plan trips, and find travel buddies on Utrippin.ai - your ultimate travel companion.",
              "breadcrumb": {
                "@id": "https://utrippin.ai/#breadcrumb"
              },
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <ScrollTracking pageName="homepage">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">
          {/* Mobile booking interface - matches PlaneTest.tsx exactly */}
          <div className="block md:hidden">
            <div className="relative w-full bg-gray-50 overflow-x-hidden font-sans"
                 style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              <div className="bg-gray-50 pb-4">
                {/* Top Navigation - Icons */}
                <div className="flex justify-around items-center pt-1 pb-1 bg-white border-b border-gray-100 min-h-[55px]">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center cursor-pointer min-w-[45px] relative ${
                        activeTab === tab.id
                          ? 'text-blue-600'
                          : 'text-gray-400 hover:text-blue-600'
                      }`}
                    >
                      <tab.icon className={`h-5 w-5 flex-shrink-0 ${tab.name === 'Flights' ? 'rotate-45' : ''}`} />
                      <span className={`text-xs font-medium mt-0.5 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`}>{tab.name}</span>
                      {activeTab === tab.id && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-px bg-blue-600" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Hotels Tab - Priceline Style */}
                {activeTab === 'hotels' && (
                  <div className="px-6 pt-2 pb-2 space-y-2">
                    {/* Where to? Search Input */}
                    <button 
                      onClick={() => setShowLocationModal(true)}
                      className="w-full text-left flex items-center bg-white rounded-xl py-3.5 px-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5 text-blue-500 mr-4 flex-shrink-0" />
                      <span className={`text-base ${destination ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                        {destination || "Where to?"}
                      </span>
                    </button>

                    {/* Find Your Hotel Button */}
                    <button 
                      onClick={() => destination ? setShowSearchModal(true) : setShowLocationModal(true)}
                      className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Find Your Hotel
                    </button>
                  </div>
                )}

                {/* AI Travel Tab - Special Mobile Component */}
                {activeTab === 'ai-travel' && (
                  <AITravelSelectorMobile />
                )}

                {/* Other Tabs - Form Interface */}
                {activeTab !== 'hotels' && activeTab !== 'ai-travel' && (
                  <div className="p-4 space-y-4">
                     {/* From Airport Input for Flights */}
                    {activeTab === 'flights' && (
                      <div className="relative flex items-center bg-gray-100 rounded-lg py-3 px-4 shadow-sm border-2 border-blue-500">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <SimpleAirportAutocomplete
                          placeholder="From city or airport"
                          value={fromIataCode ? {
                            id: fromIataCode,
                            iata_code: fromIataCode,
                            name: fromLocation.split('(')[0]?.trim() || fromLocation,
                            city_name: fromLocation.split('(')[0]?.trim() || fromLocation,
                            country_name: '',
                            latitude: 0,
                            longitude: 0
                          } : null}
                          onChange={(airport) => {
                            if (airport) {
                              setFromLocation(`${airport.city_name} (${airport.iata_code})`);
                              setFromIataCode(airport.iata_code);
                            } else {
                              setFromLocation('');
                              setFromIataCode('');
                            }
                          }}
                          className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        />
                      </div>
                    )}

                    {/* Location Input for Packages */}
                    {activeTab === 'packages' && (
                      <div className="relative bg-gray-100 rounded-lg py-1 px-1 shadow-sm border-2 border-blue-500">
                        <HereLocationAutocomplete
                          label=""
                          placeholder="Package destination"
                          onSelect={(location) => {
                            setPackageDestination(location.address.label);
                          }}
                          className="bg-transparent border-none focus:ring-0"
                        />
                      </div>
                    )}

                    {/* Location Input for Cars */}
                    {activeTab === 'cars' && (
                      <div className="relative bg-gray-100 rounded-lg py-1 px-1 shadow-sm border-2 border-blue-500">
                        <HereLocationAutocomplete
                          label=""
                          placeholder="Pickup location"
                          onSelect={(location) => {
                            setCarLocation(location.address.label);
                          }}
                          className="bg-transparent border-none focus:ring-0"
                        />
                      </div>
                    )}

                    {/* Port Input for Cruises */}
                    {activeTab === 'cruises' && (
                      <div className="relative bg-gray-100 rounded-lg py-1 px-1 shadow-sm border-2 border-blue-500">
                        <HereLocationAutocomplete
                          label=""
                          placeholder="Departure port"
                          onSelect={(location) => {
                            setCruisePort(location.address.label);
                          }}
                          className="bg-transparent border-none focus:ring-0"
                        />
                      </div>
                    )}

                    {/* Flight-specific form fields */}
                    {activeTab === 'flights' && (
                      <div className="space-y-4">
                        {/* To Airport - Working Version */}
                        <div className="relative flex items-center bg-gray-100 rounded-lg py-3 px-4 shadow-sm">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
                          <SimpleAirportAutocomplete
                            placeholder="To city or airport"
                            value={toIataCode ? {
                              id: toIataCode,
                              iata_code: toIataCode,
                              name: toLocation.split('(')[0]?.trim() || toLocation,
                              city_name: toLocation.split('(')[0]?.trim() || toLocation,
                              country_name: '',
                              latitude: 0,
                              longitude: 0
                            } : null}
                            onChange={(airport) => {
                              if (airport) {
                                setToLocation(`${airport.city_name} (${airport.iata_code})`);
                                setToIataCode(airport.iata_code);
                              } else {
                                setToLocation('');
                                setToIataCode('');
                              }
                            }}
                            className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
                          />
                        </div>

                        {/* Trip Type Selector */}
                        <div className="relative">
                          <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => setTripType('roundtrip')}
                              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                tripType === 'roundtrip' 
                                  ? 'bg-white text-blue-600 shadow-sm' 
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              Round Trip
                            </button>
                            <button
                              type="button"
                              onClick={() => setTripType('oneway')}
                              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                tripType === 'oneway' 
                                  ? 'bg-white text-blue-600 shadow-sm' 
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              One Way
                            </button>
                          </div>
                        </div>

                        {/* Departure and Return Dates */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <input
                              type="date"
                              value={checkIn}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setCheckIn(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                              placeholder="Departure"
                              required
                            />
                          </div>
                          {tripType === 'roundtrip' && (
                            <div className="relative">
                              <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                              <input
                                type="date"
                                value={checkOut}
                                min={checkIn || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                                placeholder="Return"
                                required
                              />
                            </div>
                          )}
                        </div>

                        {/* Travelers */}
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                          <select
                            value={travelers}
                            onChange={(e) => setTravelers(Number(e.target.value))}
                            className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            {Array.from({ length: 8 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} Traveler{i > 0 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                     {/* Packages Form Fields */}
                    {activeTab === 'packages' && (
                      <div className="space-y-4">
                        {/* Package Type Selector */}
                        <div className="relative">
                          <Package className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                          <select
                            value={packageType}
                            onChange={(e) => setPackageType(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            <option value="flight-hotel">Flight + Hotel</option>
                            <option value="flight-car">Flight + Car</option>
                            <option value="all-inclusive">All Inclusive</option>
                          </select>
                        </div>

                        {/* Departure and Return Dates */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <input
                              type="date"
                              value={departDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setDepartDate(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                              placeholder="Departure"
                              required
                            />
                          </div>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <input
                              type="date"
                              value={returnDate}
                              min={departDate || new Date().toISOString().split('T')[0]}
                              onChange={(e) => setReturnDate(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                              placeholder="Return"
                              required
                            />
                          </div>
                        </div>

                        {/* Travelers */}
                        <div className="relative">
                          <UserGroupIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10 pointer-events-none" />
                          <select
                            value={travelers}
                            onChange={(e) => setTravelers(Number(e.target.value))}
                            className="w-full pl-12 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            {Array.from({ length: 8 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} Traveler{i > 0 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Cars Form Fields */}
                    {activeTab === 'cars' && (
                      <div className="space-y-4">
                        {/* Pickup and Dropoff Dates */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <input
                              type="date"
                              value={pickupDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setPickupDate(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                              placeholder="Pickup date"
                              required
                            />
                          </div>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <input
                              type="date"
                              value={dropoffDate}
                              min={pickupDate || new Date().toISOString().split('T')[0]}
                              onChange={(e) => setDropoffDate(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                              placeholder="Dropoff date"
                              required
                            />
                          </div>
                        </div>

                        {/* Pickup and Dropoff Times */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <select
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                            >
                              {[
                                '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
                                '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
                                '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
                                '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
                              ].map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="relative">
                            <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                            <select
                              value={dropoffTime}
                              onChange={(e) => setDropoffTime(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                            >
                              {[
                                '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
                                '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
                                '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
                                '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
                              ].map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Driver Age */}
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                          <select
                            value={driverAge}
                            onChange={(e) => setDriverAge(Number(e.target.value))}
                            className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            <option value={25}>25+ years old</option>
                            <option value={21}>21-24 years old</option>
                            <option value={18}>18-20 years old</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Cruises Form Fields */}
                    {activeTab === 'cruises' && (
                      <div className="space-y-4">
                        {/* Sail Date */}
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                          <input
                            type="date"
                            value={sailDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSailDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                            placeholder="Sail date"
                            required
                          />
                        </div>

                        {/* Duration */}
                        <div className="relative">
                          <Ship className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                          <select
                            value={cruiseDuration}
                            onChange={(e) => setCruiseDuration(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            <option value="3">3 nights</option>
                            <option value="7">7 nights</option>
                            <option value="10">10 nights</option>
                            <option value="14">14 nights</option>
                          </select>
                        </div>

                        {/* Guests */}
                        <div className="relative">
                          <UserGroupIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10 pointer-events-none" />
                          <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full pl-12 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            {Array.from({ length: 8 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} Guest{i > 0 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Cabin Type */}
                        <div className="relative">
                          <HomeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                          <select
                            value={cabinType}
                            onChange={(e) => setCabinType(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800"
                          >
                            <option value="interior">Interior</option>
                            <option value="ocean-view">Ocean View</option>
                            <option value="balcony">Balcony</option>
                            <option value="suite">Suite</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Search Button for Other Tabs */}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (activeTab === 'flights') {
                          handleFlightSearch();
                        } else {
                          handleLegacySearch();
                        }
                      }}
                      disabled={
                        activeTab === 'flights' 
                          ? !fromIataCode || !toIataCode || !checkIn || (tripType === 'roundtrip' && !checkOut)
                          : activeTab === 'packages'
                          ? !packageDestination || !departDate || !returnDate
                          : activeTab === 'cars'
                          ? !carLocation || !pickupDate || !dropoffDate
                          : activeTab === 'cruises'
                          ? !cruisePort || !sailDate
                          : activeTab === 'ai-travel'
                          ? false
                          : true
                      }
                      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
                    >
                      {activeTab === 'ai-travel' ? 'Plan My Trip' : 
                       `Find Your ${activeTab === 'flights' ? 'Flight' : activeTab === 'cars' ? 'Car' : activeTab === 'packages' ? 'Package' : 'Cruise'}`}
                    </button>

                    {/* Expedia Attribution for flights */}
                    {activeTab === 'flights' && (
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Powered by Expedia — Official Utrippin Affiliate Partner
                      </p>
                    )}
                  </div>
                )}

                {/* Pick up where you left off section */}
                <div className="mt-4 bg-blue-50 rounded-xl py-4 px-3 mx-6">
                  <h2 className="text-xl font-bold text-blue-800 mb-3 px-1">Pick up where you left off</h2>

                  {/* Show recent search for current tab or most recent overall */}
                  {(() => {
                    const tabRecents = getTabSpecificRecents();
                    const recentSearch = tabRecents.length > 0 ? tabRecents[0] : getMostRecentSearch();
                    
                    if (!recentSearch) {
                      return (
                        <div className="text-center py-4 mb-3">
                          <p className="text-base text-gray-600 mb-1 font-medium">No recent searches yet</p>
                          <p className="text-sm text-gray-500">Your search history will appear here</p>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          onClick={() => loadPreviousSearch(recentSearch)}
                          className="bg-white rounded-2xl shadow-sm py-5 px-6 flex items-center justify-between border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 flex-1"
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-50 rounded-lg p-2.5 mr-4">
                              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-normal mb-0.5 capitalize">{recentSearch.searchType}</p>
                              <p className="text-lg font-bold text-gray-900 mb-1">{recentSearch.destination}</p>
                              <div className="flex items-center">
                                <p className="text-sm text-blue-400 font-medium">
                                  {recentSearch.checkInDate && recentSearch.checkOutDate 
                                    ? `${formatSearchDate(recentSearch.checkInDate)} - ${formatSearchDate(recentSearch.checkOutDate)}`
                                    : recentSearch.checkInDate 
                                      ? formatSearchDate(recentSearch.checkInDate)
                                      : 'Tap to restore'
                                  }
                                </p>
                                <ChevronRightIcon className="h-4 w-4 text-blue-400 ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                          <PaperAirplaneIcon className="h-6 w-6 text-blue-600 rotate-45" />
                        </div>
                      </div>
                    );
                  })()}

                  {/* View All Recent Activity Button */}
                  <div className="mt-2 px-1">
                    <button 
                      onClick={() => navigate('/search-history')}
                      className="w-full text-blue-500 font-bold py-3 text-base text-center border border-blue-400 rounded-xl hover:bg-blue-50 transition-all duration-200"
                    >
                      View All Recent Activity ({searchHistory.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* Hero Card - Mobile only */}
            <div className="relative rounded-xl overflow-hidden mb-6 h-64">
              <img 
                src="/images/caribbean-beach-paradise.jpg"
                alt="Caribbean Summer Escapes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl font-bold mb-2 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)' }}>Caribbean Summer Escapes</h2>
                <p className="text-sm mb-3 text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0px 0px 6px rgba(0,0,0,0.6)' }}>Tropical breezes and endless sunshine ☀️🏖️</p>
                <Button 
                  variant="outline" 
                  className="bg-white text-black border-white hover:bg-white/90 hover:text-black text-sm px-4 py-2 font-medium"
                >
                  Learn More →
                </Button>
              </div>
            </div>

            {/* Recommended Destinations - Mobile only */}
            <div className="mb-6">
              <MobileDestinationSlider />
            </div>

            {/* Melanin Trippin Section - Mobile only */}
            <div className="mb-6">
              <div className="relative min-h-[300px] rounded-xl overflow-hidden">
                <img 
                  src="/images/african-american-travel-culture.jpg"
                  alt="Melanin & Trippin Travel Community"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xl font-bold text-white mb-2 leading-tight">
                    <div>MELANIN</div>
                    <div>&</div>
                    <div>TRIPPIN</div>
                  </div>
                  <Link 
                    to="/melanin"
                    className="inline-block bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
                  >
                    LEARN MORE
                  </Link>
                </div>
              </div>
            </div>

            {/* Find your Joy - Mobile Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Find your Joy</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/category/beaches-islands" className="relative h-24 rounded-xl overflow-hidden">
                    <img 
                      src="/images/maldives-beach.jpg"
                      alt="Beach & Islands"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Beach & Islands</span>
                    </div>
                  </Link>
                  <Link to="/category/arts-culture" className="relative h-24 rounded-xl overflow-hidden">
                    <img 
                      src="/images/kyoto-art-gallery.jpg"
                      alt="Arts & Culture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Arts & Culture</span>
                    </div>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/category/family-friendly" className="relative h-24 rounded-xl overflow-hidden">
                    <img 
                      src="/images/orlando-disney.jpg"
                      alt="Family Friendly"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Family Friendly</span>
                    </div>
                  </Link>
                  <Link to="/category/wellness-spa" className="relative h-24 rounded-xl overflow-hidden">
                    <img 
                      src="/images/tulum-spa.jpg"
                      alt="Wellness & Spa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Wellness & Spa</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Latest Blog Posts - Mobile */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Latest Travel Tips</h3>
              <div className="space-y-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/images/tropical-beach-resort.jpg"
                      alt="Beach destinations"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Ultimate Beach Destinations</h4>
                      <p className="text-gray-600 text-xs mb-2">Discover stunning beaches worldwide.</p>
                      <Link to="/blog/ultimate-beach-island-destinations-2025" className="text-blue-600 text-xs">
                        Read More →
                      </Link>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/images/backpacker-travel.jpg"
                      alt="Budget travel"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Budget Travel Guide</h4>
                      <p className="text-gray-600 text-xs mb-2">Travel more for less money.</p>
                      <Link to="/blog/budget-travel-mastery-world-for-less" className="text-blue-600 text-xs">
                        Read More →
                      </Link>
                    </div>
                  </div>
              </div>
              <div className="text-center mt-4">
                <Link to="/blog">
                  <Button variant="outline" size="sm">
                    View All Articles
                  </Button>
                </Link>
              </div>
            </div>

            {/* Travel Buddy Section - Mobile */}
            <div className="mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Find Travel Buddies</h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Connect with like-minded travelers and explore the world together.
                </p>
                <Link to="/travel-buddies">
                  <Button className="w-full">
                    Find Your Buddy
                  </Button>
                </Link>
              </div>
            </div>

            {/* Newsletter - Mobile */}
            <div className="mb-6">
              <div className="bg-travel-navy rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Get Exclusive Deals</h3>
                <p className="text-white/80 text-sm mb-4">
                  Subscribe for special offers and travel tips.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-lg text-sm"
                  />
                  <Button className="w-full bg-travel-gold hover:bg-travel-gold/90 text-travel-navy font-semibold">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop/Tablet Content - Hidden on mobile */}
          <div className="hidden md:block bg-white">
            <HeroSection />
            <div className="container mx-auto px-4 py-8">
              {/* Booking widget will be added after import fix */}
            </div>
            <AITripPlanner />
            <RecommendedDestinations />
            <MelaninTrippin />
            
            {/* Find your Joy Section */}
            <section className="py-12 sm:py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-800">Find your Joy</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover the perfect travel experience that matches your style and interests.
                  </p>
                </div>
              </div>
              <TravelCategories />
            </section>
            
            {/* Latest Blog Posts Section */}
            <section className="py-12 sm:py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-800">Latest Travel Tips & Guides</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Stay updated with the latest travel tips, booking hacks, and destination guides from our experts.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover-scale">
                    <img 
                      src="/images/palenque-colombia.jpg"
                      alt="Rhythms of Resilience: Exploring Afro‑Colombian Culture in Palenque"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Rhythms of Resilience: Exploring Afro‑Colombian Culture in Palenque</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                        Discover the rich Afro-Colombian heritage and vibrant cultural traditions in the historic town of Palenque.
                      </p>
                      <Link to="/blog/rhythms-resilience-afro-colombian-culture-palenque" className="text-blue-600 hover:underline text-sm sm:text-base">
                        Read More →
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover-scale">
                    <SmartDestinationImage 
                      destination="Coachella Valley California desert music festival"
                      description="desert music festival with colorful art installations and performances"
                      tags={['california', 'coachella', 'music festival', 'desert', 'culture', 'art', 'music']}
                      category="event"
                      alt="Desert Harmony: The Cultural Power of Coachella Music Festival, California"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Desert Harmony: The Cultural Power of Coachella Music Festival</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                        Explore how Coachella has become a cultural phenomenon in the California desert, blending music, art, and fashion.
                      </p>
                      <Link to="/blog/desert-harmony-coachella-music-festival-california" className="text-blue-600 hover:underline text-sm sm:text-base">
                        Read More →
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover-scale">
                    <img 
                      src="/images/rajasthan-festival.jpg"
                      alt="Desert Dreams: Celebrating an Ancient Ethnic Festival in Rajasthan"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Desert Dreams: Celebrating an Ancient Ethnic Festival in Rajasthan</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                        Experience the magic of ancient ethnic festivals in Rajasthan's golden desert, where tradition comes alive.
                      </p>
                      <Link to="/blog/desert-dreams-ancient-ethnic-festival-rajasthan" className="text-blue-600 hover:underline text-sm sm:text-base">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link to="/blog">
                    <Button variant="outline" size="lg">
                      View All Articles
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
              
            <VirtualTravelSection />
            <TravelBuddySection />
            <NewsletterSubscription />
          </div>
        </main>
        <Footer />
        <BackToTop />
        
        {/* Floating Assistant Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/ai-travel')}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>

        {/* Location Search Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
               <div className="flex items-center justify-between p-4 border-b">
                <button 
                  onClick={() => setShowLocationModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg touch-target-44"
                  aria-label="Close location search"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <span className="text-gray-500 text-sm font-medium">Where to?</span>
                <div className="w-10"></div>
              </div>

              <div className="p-4">
                {/* Search Input */}
                <div className="relative mb-4">
                  <div className="flex items-center bg-blue-50 border-2 border-blue-500 rounded-2xl py-3 px-4">
                    <MagnifyingGlassIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <input
                      type="text"
                      placeholder="Enter city or destination"
                      value={locationInput}
                      onChange={(e) => {
                        setLocationInput(e.target.value);
                        fetchHereLocations(e.target.value);
                      }}
                      className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Filter Bubbles */}
                {locationInput && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {filterOptions.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                          selectedFilters.includes(filter)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}

                {/* Use Current Location */}
                <button className="w-full flex items-center p-4 hover:bg-gray-50 rounded-lg mb-4">
                  <div className="bg-blue-500 p-2 rounded-full mr-3">
                    <MapPinIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">Use Current Location</span>
                </button>

                {/* City Suggestions */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getFilteredSuggestions().map((city, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleLocationSelect(city);
                        proceedToSearch();
                      }}
                      className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left"
                    >
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.state}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Parameters Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
               <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold text-blue-600">Search Hotels</h2>
                <button 
                  onClick={() => setShowSearchModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg touch-target-44"
                  aria-label="Close search parameters"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Selected Destination */}
                <div className="flex items-center bg-gray-50 rounded-lg py-3 px-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-800">{destination}</span>
                </div>

                {/* Dates */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600 font-medium">Check-in - Check-out</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {checkIn && checkOut 
                      ? `${format(new Date(checkIn), 'MM/dd/yyyy')} – ${format(new Date(checkOut), 'MM/dd/yyyy')}`
                      : 'Select dates'
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="relative">
                      <input
                        type="date"
                        value={checkIn}
                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          // If check-out is before new check-in, update check-out
                          if (checkOut && e.target.value > checkOut) {
                            const nextDay = new Date(e.target.value);
                            nextDay.setDate(nextDay.getDate() + 1);
                            setCheckOut(nextDay.toISOString().split('T')[0]);
                          }
                        }}
                        className="w-full p-3 bg-white rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500 text-gray-800 font-medium"
                        placeholder="Check-in"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn ? (() => {
                          const nextDay = new Date(checkIn);
                          nextDay.setDate(nextDay.getDate() + 1);
                          return nextDay.toISOString().split('T')[0];
                        })() : new Date().toISOString().split('T')[0]} // Minimum is day after check-in
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full p-3 bg-white rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500 text-gray-800 font-medium"
                        placeholder="Check-out"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-600 font-medium">{adults + children} Adults, {rooms} Room</span>
                    </div>
                  </div>
                  
                  {/* Adults Counter */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700">Adults</span>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 px-1 py-1">
                      <button 
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 bg-gray-50"
                      >
                        <MinusIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className="mx-4 text-xl font-bold text-gray-800 min-w-[2rem] text-center">{adults}</span>
                      <button 
                        onClick={() => setAdults(adults + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 bg-gray-50"
                      >
                        <PlusIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700">Children</span>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 px-1 py-1">
                      <button 
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 bg-gray-50"
                      >
                        <MinusIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className="mx-4 text-xl font-bold text-gray-800 min-w-[2rem] text-center">{children}</span>
                      <button 
                        onClick={() => setChildren(children + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 bg-gray-50"
                      >
                        <PlusIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Rooms Counter */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Rooms</span>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 px-1 py-1">
                      <button 
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 bg-gray-50"
                      >
                        <MinusIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className="mx-4 text-xl font-bold text-gray-800 min-w-[2rem] text-center">{rooms}</span>
                      <button 
                        onClick={() => setRooms(rooms + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 bg-gray-50"
                      >
                        <PlusIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bundle Options */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-green-700 font-semibold text-lg mr-2">💰</span>
                    <span className="text-green-700 font-semibold">Bundle + Save</span>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-green-700">Add a car</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-green-700">Add a flight</span>
                    </label>
                  </div>
                </div>

                {/* Find Your Hotel Button */}
                <button 
                  onClick={handleHotelSearch}
                  disabled={!destination || !checkIn || !checkOut}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
                >
                  Find Your Hotel
                </button>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  Hotel prices now shown with fees included.
                </p>
              </div>
            </div>
          </div>
        )}
      </ScrollTracking>
    </div>
  );
};

export default Index;
