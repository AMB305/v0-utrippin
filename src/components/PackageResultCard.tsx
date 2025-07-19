import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Users, Plane, Building2, Car, Heart, Clock } from "lucide-react";

interface PackageResult {
  id: string;
  title: string;
  destination: string;
  country: string;
  images: string[];
  duration: number;
  packageType: string;
  hotel: {
    name: string;
    starRating: number;
    rating: number;
    reviewCount: number;
  };
  flight: {
    airline: string;
    duration: string;
    stops: number;
  };
  inclusions: string[];
  highlights: string[];
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  currency: string;
  dealType?: string;
  departureDate: string;
  availableSpots: number;
}

interface PackageResultCardProps {
  packageData: PackageResult;
  onSelect: (packageData: PackageResult) => void;
  selected?: boolean;
}

const PackageResultCard = ({ packageData: pkg, onSelect, selected = false }: PackageResultCardProps) => {
  const savingsPercentage = Math.round((pkg.savings / pkg.originalPrice) * 100);

  return (
    <Card className={`hover:shadow-soft transition-all duration-300 cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Package Images */}
          <div className="lg:col-span-4">
            <div className="relative h-64 lg:h-56">
              <img
                src={pkg.images[0]}
                alt={pkg.title}
                className="w-full h-full object-cover rounded-l-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {pkg.dealType && (
                <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                  {pkg.dealType}
                </Badge>
              )}
              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                SAVE ${pkg.savings}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
              {pkg.images.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  +{pkg.images.length - 1} photos
                </div>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="lg:col-span-8 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
              {/* Main Info */}
              <div className="lg:col-span-8">
                <div className="space-y-3">
                  {/* Title & Location */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-xl mb-1">{pkg.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{pkg.destination}, {pkg.country}</span>
                          <span>•</span>
                          <span>{pkg.duration} nights</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {pkg.packageType}
                      </Badge>
                    </div>
                  </div>

                  {/* Hotel & Flight Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{pkg.hotel.name}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        {[...Array(pkg.hotel.starRating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                        ))}
                        <span className="text-xs">
                          {pkg.hotel.rating}/10 ({pkg.hotel.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{pkg.flight.airline}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-6 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{pkg.flight.duration}</span>
                        <span>•</span>
                        <span>{pkg.flight.stops === 0 ? 'Nonstop' : `${pkg.flight.stops} stop${pkg.flight.stops > 1 ? 's' : ''}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Highlights */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 4).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {pkg.highlights.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{pkg.highlights.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Package Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                        <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          {inclusion}
                        </span>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{pkg.inclusions.length - 3} more included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Departure & Availability */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Departs {pkg.departureDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{pkg.availableSpots} spots left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div className="text-right space-y-2">
                  <div className="text-sm text-muted-foreground line-through">
                    Was {pkg.currency}{pkg.originalPrice.toLocaleString()}
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {pkg.currency}{pkg.discountedPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                  
                  <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                    {savingsPercentage}% OFF • Save {pkg.currency}{pkg.savings}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Total for 2 travelers: {pkg.currency}{(pkg.discountedPrice * 2).toLocaleString()}
                  </div>
                  
                  {pkg.availableSpots <= 5 && (
                    <div className="text-xs text-orange-600 font-medium">
                      Only {pkg.availableSpots} spots remaining!
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => onSelect(pkg)}
                  className="w-full mt-4"
                  variant={selected ? "default" : "outline"}
                  size="lg"
                >
                  {selected ? "Selected" : "Book Package"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Free cancellation • No booking fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageResultCard;