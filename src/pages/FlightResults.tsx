import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompactFlightSearchBar from "@/components/CompactFlightSearchBar";
import FlightFilters from "@/components/FlightFilters";
import GroupedFlightOffers from "@/components/GroupedFlightOffers";
import TripComFlightResults from "@/components/TripComFlightResults";
import FilterChips, { ActiveFilter } from "@/components/FilterChips";
import { DuffelOffer } from "@/lib/duffel";
import { FilterCriteria, filterOffers, groupOffersByFlight } from "@/utils/groupOffersByFlight";
import { supabase } from "@/integrations/supabase/client";
import { useTripComFlights } from "@/hooks/useTripComFlights";
import { Plane, Clock, Star, Users, MessageCircle } from "lucide-react";

const FlightResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [allOffers, setAllOffers] = useState<DuffelOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<DuffelOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedOffer, setSelectedOffer] = useState<DuffelOffer | undefined>();
  const [currentFilters, setCurrentFilters] = useState<FilterCriteria>({
    priceRange: [0, 2000],
    airlines: [],
    stops: [],
    cabinTypes: [],
    departureTimeRanges: [],
    arrivalTimeRanges: [],
    maxDuration: 24
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  // Parse clean URL parameters for production
  const searchData = {
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    departureDate: searchParams.get('departure') ? new Date(searchParams.get('departure')!) : null,
    returnDate: searchParams.get('return') ? new Date(searchParams.get('return')!) : null,
    passengers: {
      adults: parseInt(searchParams.get('adults') || '1'),
      children: parseInt(searchParams.get('children') || '0'),
      infants: parseInt(searchParams.get('infants') || '0')
    },
    tripType: searchParams.get('tripType') || 'round-trip',
    cabinClass: searchParams.get('cabinClass') || 'economy',
    directOnly: searchParams.get('directOnly') === 'true'
  };

  // Use the custom hook for Trip.com flights
  const { tripComFlights, loading: tripComLoading } = useTripComFlights(
    searchData.origin,
    searchData.destination,
    searchData.departureDate?.toISOString().split('T')[0] || '',
    searchData.returnDate?.toISOString().split('T')[0] || '',
    (searchData.passengers.adults + searchData.passengers.children).toString()
  );

  useEffect(() => {
    // Validate required parameters before searching
    if (!searchData.origin || !searchData.destination) {
      setError('Missing origin or destination airport code. Please search again.');
      setLoading(false);
      return;
    }
    
    if (!searchData.departureDate || isNaN(searchData.departureDate.getTime())) {
      setError('Invalid departure date. Please search again.');
      setLoading(false);
      return;
    }
    
    if (searchData.tripType === 'round-trip' && (!searchData.returnDate || isNaN(searchData.returnDate.getTime()))) {
      setError('Invalid return date for round-trip. Please search again.');
      setLoading(false);
      return;
    }
    
    searchFlights();
  }, [searchParams]);

  const searchFlights = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Build simplified payload for the new edge function
      const payload: any = {
        origin: searchData.origin,
        destination: searchData.destination,
        departure_date: searchData.departureDate!.toISOString().split('T')[0],
        passengers: { adults: searchData.passengers.adults },
        cabin_class: searchData.cabinClass
      };

      // Add return date for round-trip
      if (searchData.tripType === 'round-trip' && searchData.returnDate) {
        payload.return_date = searchData.returnDate.toISOString().split('T')[0];
      }

      console.log('🛫 Simplified Flight Search Payload:', payload);

      // Call Duffel API via Supabase edge function with JSON.stringify
      const { data, error } = await supabase.functions.invoke('duffel-search-flights', {
        body: JSON.stringify(payload)
      });

      if (error) {
        throw new Error(error.message || 'Failed to search flights');
      }

      setAllOffers(data.data || []);
      setFilteredOffers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching for flights');
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleOfferSelect = (offer: DuffelOffer) => {
    setSelectedOffer(offer);
    // Navigate to booking page with selected offer
    const bookingParams = new URLSearchParams({
      offerId: offer.id,
      ...Object.fromEntries(searchParams.entries())
    });
    navigate(`/flights/booking?${bookingParams.toString()}`);
  };

  const handleNewSearch = async (newSearchData: any) => {
    // Update URL with clean parameter structure
    // CompactFlightSearchBar passes airport objects directly, not in arrays
    const params = new URLSearchParams({
      origin: newSearchData.origin?.iata_code || '',
      destination: newSearchData.destination?.iata_code || '',
      departure: newSearchData.departureDate?.toISOString().split('T')[0] || '',
      return: newSearchData.returnDate?.toISOString().split('T')[0] || '',
      adults: newSearchData.passengers.adults.toString(),
      children: newSearchData.passengers.children.toString(),
      infants: newSearchData.passengers.infants.toString(),
      cabinClass: newSearchData.cabinClass,
      tripType: newSearchData.tripType,
      directOnly: 'false'
    });
    
    console.log('🔍 New search params:', params.toString());
    navigate(`/flights/results?${params.toString()}`);
  };

  // Handle filter changes
  const handleFiltersChange = (filters: FilterCriteria) => {
    setCurrentFilters(filters);
    const filtered = filterOffers(allOffers, filters);
    setFilteredOffers(filtered);
    
    // Update active filter chips
    const activeFiltersList: ActiveFilter[] = [];
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
      activeFiltersList.push({
        type: 'price',
        label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
        value: filters.priceRange
      });
    }
    
    filters.airlines.forEach(airline => {
      activeFiltersList.push({
        type: 'airline',
        label: airline,
        value: airline
      });
    });
    
    filters.stops.forEach(stop => {
      activeFiltersList.push({
        type: 'stops',
        label: stop,
        value: stop
      });
    });
    
    filters.cabinTypes.forEach(cabin => {
      activeFiltersList.push({
        type: 'cabin',
        label: cabin,
        value: cabin
      });
    });
    
    filters.departureTimeRanges.forEach(time => {
      activeFiltersList.push({
        type: 'departure',
        label: `Departure: ${time}`,
        value: time
      });
    });
    
    filters.arrivalTimeRanges.forEach(time => {
      activeFiltersList.push({
        type: 'arrival',
        label: `Arrival: ${time}`,
        value: time
      });
    });
    
    if (filters.maxDuration < 24) {
      activeFiltersList.push({
        type: 'duration',
        label: `Max ${filters.maxDuration}h`,
        value: filters.maxDuration
      });
    }
    
    setActiveFilters(activeFiltersList);
  };

  // Remove specific filter
  const handleRemoveFilter = (filterToRemove: ActiveFilter) => {
    const newFilters = { ...currentFilters };
    
    switch (filterToRemove.type) {
      case 'price':
        newFilters.priceRange = [0, 2000];
        break;
      case 'airline':
        newFilters.airlines = newFilters.airlines.filter(a => a !== filterToRemove.value);
        break;
      case 'stops':
        newFilters.stops = newFilters.stops.filter(s => s !== filterToRemove.value);
        break;
      case 'cabin':
        newFilters.cabinTypes = newFilters.cabinTypes.filter(c => c !== filterToRemove.value);
        break;
      case 'departure':
        newFilters.departureTimeRanges = newFilters.departureTimeRanges.filter(t => t !== filterToRemove.value);
        break;
      case 'arrival':
        newFilters.arrivalTimeRanges = newFilters.arrivalTimeRanges.filter(t => t !== filterToRemove.value);
        break;
      case 'duration':
        newFilters.maxDuration = 24;
        break;
    }
    
    handleFiltersChange(newFilters);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    const defaultFilters: FilterCriteria = {
      priceRange: [0, 2000],
      airlines: [],
      stops: [],
      cabinTypes: [],
      departureTimeRanges: [],
      arrivalTimeRanges: [],
      maxDuration: 24
    };
    handleFiltersChange(defaultFilters);
  };

  // Group filtered offers
  const groupedFlights = groupOffersByFlight(filteredOffers);

  const getRouteDescription = () => {
    if (!searchData.origin || !searchData.destination) return '';
    return `${searchData.origin} → ${searchData.destination}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b bg-travel-light py-4">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/flights">Flights</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Search Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Search Bar */}
      <CompactFlightSearchBar onSearch={handleNewSearch} loading={loading} />
      
      {/* Results Header */}
      <div className="bg-gradient-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Flight Results: {getRouteDescription()}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{searchData.departureDate?.toLocaleDateString()}</span>
                {searchData.returnDate && (
                  <>
                    <span>•</span>
                    <span>{searchData.returnDate.toLocaleDateString()}</span>
                  </>
                )}
                <span>•</span>
                <span>{searchData.passengers.adults + searchData.passengers.children} passenger{searchData.passengers.adults + searchData.passengers.children > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {filteredOffers.length} flights found
              </Badge>
              <p className="text-sm text-muted-foreground">
                Sorted by best value
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FlightFilters 
              offers={allOffers}
              onFiltersChange={handleFiltersChange}
            />
            
            {/* Why Book With Us */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-travel-gold" />
                  Why Book With Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Best Price Guarantee</p>
                    <p className="text-xs text-muted-foreground">We'll match any lower price</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">24/7 Support</p>
                    <p className="text-xs text-muted-foreground">Help whenever you need it</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Secure Booking</p>
                    <p className="text-xs text-muted-foreground">Your data is protected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Filter Chips */}
            <FilterChips 
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
            
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Searching flights...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                {error}
              </div>
            ) : (
              <>
                <GroupedFlightOffers 
                  groupedFlights={groupedFlights}
                  onOfferSelect={handleOfferSelect}
                />
                
                {/* Trip.com Flights Section */}
                {tripComFlights.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      More Flight Options
                    </h3>
                    <TripComFlightResults tripComFlights={tripComFlights} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-travel-gold text-travel-gold" />
                ))}
              </div>
              <span className="text-muted-foreground">4.8/5 from 12,000+ reviews</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Jennifer Kim",
                route: "NYC → LAX",
                rating: 5,
                comment: "Saved $200 compared to airline direct booking. Super easy process!"
              },
              {
                name: "Robert Martinez", 
                route: "Miami → London",
                rating: 5,
                comment: "Found a great flight with perfect timing. Customer service was excellent."
              },
              {
                name: "Lisa Chen",
                route: "Seattle → Tokyo",
                rating: 5,
                comment: "The booking process was seamless and I got confirmation instantly."
              }
            ].map((review, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-travel-gold text-travel-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic text-sm">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{review.name}</p>
                      <p className="text-muted-foreground text-xs">{review.route}</p>
                    </div>
                    <MessageCircle className="w-4 h-4 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Booking Questions?</h2>
            
            <div className="space-y-4">
              {[
                {
                  question: "Can I change my flight after booking?",
                  answer: "Yes, most airlines allow changes for a fee. Check the fare conditions before booking."
                },
                {
                  question: "When will I receive my tickets?",
                  answer: "E-tickets are sent immediately after payment confirmation to your email."
                },
                {
                  question: "What if my flight is cancelled?",
                  answer: "We'll help you rebook or get a full refund according to airline policies."
                }
              ].map((faq, index) => (
                <Card key={index} className="hover:shadow-soft transition-shadow duration-300">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FlightResults;