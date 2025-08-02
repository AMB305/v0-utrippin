import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import FilterLayout from "@/components/FilterLayout";
import PackageSearchBar from "@/components/PackageSearchBar";
import PackageFilters from "@/components/PackageFilters";
import PackageResultCard from "@/components/PackageResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for package results
const mockPackageResults = [
  {
    id: "1",
    title: "Tropical Paradise Getaway",
    destination: "Cancun",
    country: "Mexico",
    images: ["/placeholder.svg", "/placeholder.svg"],
    duration: 7,
    packageType: "Flight + Hotel",
    hotel: {
      name: "Grand Resort Cancun",
      starRating: 5,
      rating: 9.2,
      reviewCount: 1247
    },
    flight: {
      airline: "American Airlines",
      duration: "4h 30m",
      stops: 0
    },
    inclusions: ["Round-trip flights", "7 nights hotel", "All meals", "Airport transfers"],
    highlights: ["Beachfront location", "All-inclusive", "Spa included", "Water sports"],
    originalPrice: 1299,
    discountedPrice: 899,
    savings: 400,
    currency: "$",
    dealType: "EARLY BIRD",
    departureDate: "March 15",
    availableSpots: 3
  },
  {
    id: "2", 
    title: "European City Explorer",
    destination: "Paris",
    country: "France",
    images: ["/placeholder.svg"],
    duration: 5,
    packageType: "Flight + Hotel + Tours",
    hotel: {
      name: "Hotel Le Marais",
      starRating: 4,
      rating: 8.7,
      reviewCount: 892
    },
    flight: {
      airline: "Air France",
      duration: "8h 15m",
      stops: 0
    },
    inclusions: ["Round-trip flights", "5 nights hotel", "City tours", "Museum passes"],
    highlights: ["City center", "Historic district", "Walking tours", "Seine cruise"],
    originalPrice: 1599,
    discountedPrice: 1199,
    savings: 400,
    currency: "$",
    departureDate: "April 20",
    availableSpots: 8
  }
];

const PackageResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<typeof mockPackageResults>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<typeof mockPackageResults[0] | undefined>();

  useEffect(() => {
    setTimeout(() => {
      setPackages(mockPackageResults);
      setLoading(false);
    }, 1500);
  }, []);

  const handlePackageSelect = (packageData: typeof mockPackageResults[0]) => {
    setSelectedPackage(packageData);
    const bookingParams = new URLSearchParams({
      packageId: packageData.id,
      ...Object.fromEntries(searchParams.entries())
    });
    navigate(`/packages/booking?${bookingParams.toString()}`);
  };

  const breadcrumbs = [
    { label: "Packages", href: "/packages" },
    { label: "Search Results", isActive: true }
  ];

  const resultsHeader = {
    title: `Vacation Packages`,
    subtitle: `Great deals on flight + hotel packages`,
    count: packages.length,
    sortInfo: "Sorted by best value"
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {packages.map((pkg) => (
          <PackageResultCard
            key={pkg.id}
            packageData={pkg}
            onSelect={handlePackageSelect}
            selected={selectedPackage?.id === pkg.id}
          />
        ))}
      </div>
    );
  };

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <FilterLayout
        filters={<PackageFilters />}
        results={renderResults()}
        resultsHeader={resultsHeader}
      />
    </ProductLayout>
  );
};

export default PackageResults;
