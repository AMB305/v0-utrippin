import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import FilterLayout from "@/components/FilterLayout";
import CarSearchBar from "@/components/CarSearchBar";
import CarFilters from "@/components/CarFilters";
import CarResultCard from "@/components/CarResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for car results
const mockCarResults = [
  {
    id: "1",
    name: "Toyota Corolla",
    category: "Economy",
    image: "/placeholder.svg",
    company: "Hertz",
    rating: 4.2,
    reviewCount: 156,
    features: ["AC", "Bluetooth", "USB"],
    passengers: 5,
    bags: 2,
    transmission: "automatic" as const,
    fuelType: "gasoline" as const,
    pricePerDay: 35,
    totalPrice: 210,
    currency: "$",
    location: "LAX Airport",
    freeChanges: true,
    freeCancellation: true,
    payAtCounter: false
  },
  {
    id: "2",
    name: "Honda Civic",
    category: "Compact",
    image: "/placeholder.svg",
    company: "Avis",
    rating: 4.4,
    reviewCount: 203,
    features: ["AC", "GPS", "Bluetooth", "Backup Camera"],
    passengers: 5,
    bags: 2,
    transmission: "automatic" as const,
    fuelType: "gasoline" as const,
    pricePerDay: 42,
    totalPrice: 252,
    currency: "$",
    location: "LAX Airport",
    freeChanges: true,
    freeCancellation: true,
    payAtCounter: true
  },
  {
    id: "3",
    name: "Ford Explorer",
    category: "SUV",
    image: "/placeholder.svg",
    company: "Enterprise",
    rating: 4.6,
    reviewCount: 89,
    features: ["AC", "GPS", "Bluetooth", "7 Seats"],
    passengers: 7,
    bags: 4,
    transmission: "automatic" as const,
    fuelType: "gasoline" as const,
    pricePerDay: 68,
    totalPrice: 408,
    currency: "$",
    location: "LAX Airport",
    freeChanges: false,
    freeCancellation: true,
    payAtCounter: false
  },
  {
    id: "4",
    name: "Tesla Model 3",
    category: "Electric",
    image: "/placeholder.svg",
    company: "Hertz",
    rating: 4.8,
    reviewCount: 234,
    features: ["Autopilot", "Supercharging", "Premium Audio"],
    passengers: 5,
    bags: 2,
    transmission: "automatic" as const,
    fuelType: "electric" as const,
    pricePerDay: 85,
    totalPrice: 510,
    currency: "$",
    location: "LAX Airport",
    freeChanges: true,
    freeCancellation: true,
    payAtCounter: false
  },
  {
    id: "5",
    name: "BMW 3 Series",
    category: "Luxury",
    image: "/placeholder.svg",
    company: "Budget",
    rating: 4.7,
    reviewCount: 167,
    features: ["Premium Interior", "Navigation", "Heated Seats"],
    passengers: 5,
    bags: 3,
    transmission: "automatic" as const,
    fuelType: "gasoline" as const,
    pricePerDay: 95,
    totalPrice: 570,
    currency: "$",
    location: "LAX Airport",
    freeChanges: true,
    freeCancellation: false,
    payAtCounter: true
  }
];

const CarResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState<typeof mockCarResults>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<typeof mockCarResults[0] | undefined>();

  // Parse search parameters
  const searchData = {
    pickupLocation: searchParams.get('pickupLocation') || '',
    dropoffLocation: searchParams.get('dropoffLocation') || '',
    pickupDate: searchParams.get('pickupDate') ? new Date(searchParams.get('pickupDate')!) : null,
    dropoffDate: searchParams.get('dropoffDate') ? new Date(searchParams.get('dropoffDate')!) : null,
    pickupTime: searchParams.get('pickupTime') || '10:00',
    dropoffTime: searchParams.get('dropoffTime') || '10:00',
    driverAge: searchParams.get('driverAge') || '25-69'
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCars(mockCarResults);
      setLoading(false);
    }, 1500);
  }, []);

  const handleCarSelect = (car: typeof mockCarResults[0]) => {
    setSelectedCar(car);
    // Navigate to booking page
    const bookingParams = new URLSearchParams({
      carId: car.id,
      ...Object.fromEntries(searchParams.entries())
    });
    navigate(`/cars/booking?${bookingParams.toString()}`);
  };

  const handleNewSearch = (newSearchData: any) => {
    const newSearchParams = new URLSearchParams({
      pickupLocation: newSearchData.pickupLocation,
      dropoffLocation: newSearchData.dropoffLocation || newSearchData.pickupLocation,
      pickupDate: newSearchData.pickupDate.toISOString(),
      dropoffDate: newSearchData.dropoffDate.toISOString(),
      pickupTime: newSearchData.pickupTime,
      dropoffTime: newSearchData.dropoffTime,
      driverAge: newSearchData.driverAge
    });
    
    navigate(`/cars/results?${newSearchParams.toString()}`);
    window.location.reload();
  };

  const getRouteDescription = () => {
    const pickup = searchData.pickupLocation;
    const dropoff = searchData.dropoffLocation || pickup;
    return pickup === dropoff ? pickup : `${pickup} → ${dropoff}`;
  };

  const getDurationInDays = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return 1;
    const diffTime = searchData.dropoffDate.getTime() - searchData.pickupDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const breadcrumbs = [
    { label: "Cars", href: "/cars" },
    { label: "Search Results", isActive: true }
  ];

  const resultsHeader = {
    title: `Car Rentals: ${getRouteDescription()}`,
    subtitle: `${searchData.pickupDate?.toLocaleDateString()} - ${searchData.dropoffDate?.toLocaleDateString()} • ${getDurationInDays()} day${getDurationInDays() > 1 ? 's' : ''}`,
    count: cars.length,
    sortInfo: "Sorted by best value"
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-24 h-16 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (cars.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No cars found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
          <Button onClick={() => navigate('/cars')}>New Search</Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {cars.map((car) => (
          <CarResultCard
            key={car.id}
            car={car}
            onSelect={handleCarSelect}
            selected={selectedCar?.id === car.id}
          />
        ))}
      </div>
    );
  };

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <FilterLayout
        searchBar={
          <CarSearchBar 
            onSearch={handleNewSearch} 
            loading={loading}
            initialData={searchData}
            compact={true}
          />
        }
        filters={<CarFilters />}
        results={renderResults()}
        resultsHeader={resultsHeader}
      />
    </ProductLayout>
  );
};

export default CarResults;
