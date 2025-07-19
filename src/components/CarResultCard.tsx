import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Fuel, Zap, Shield, MapPin } from "lucide-react";

interface CarResult {
  id: string;
  name: string;
  category: string;
  image: string;
  company: string;
  rating: number;
  reviewCount: number;
  features: string[];
  passengers: number;
  bags: number;
  transmission: "automatic" | "manual";
  fuelType: "gasoline" | "electric" | "hybrid";
  pricePerDay: number;
  totalPrice: number;
  currency: string;
  location: string;
  freeChanges: boolean;
  freeCancellation: boolean;
  payAtCounter: boolean;
}

interface CarResultCardProps {
  car: CarResult;
  onSelect: (car: CarResult) => void;
  selected?: boolean;
}

const CarResultCard = ({ car, onSelect, selected = false }: CarResultCardProps) => {
  const getFuelIcon = () => {
    switch (car.fuelType) {
      case "electric":
        return <Zap className="w-4 h-4" />;
      case "hybrid":
        return <Zap className="w-4 h-4" />;
      default:
        return <Fuel className="w-4 h-4" />;
    }
  };

  const getFuelColor = () => {
    switch (car.fuelType) {
      case "electric":
        return "text-green-600";
      case "hybrid":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`hover:shadow-soft transition-all duration-300 cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Car Image & Basic Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{car.name}</h3>
                <p className="text-sm text-muted-foreground">{car.category}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {car.company}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-travel-gold text-travel-gold" />
                    <span className="text-xs font-medium">{car.rating}</span>
                    <span className="text-xs text-muted-foreground">({car.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{car.passengers} passengers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{car.bags} bags</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="capitalize">{car.transmission}</span>
                </div>
                <div className={`flex items-center gap-1 ${getFuelColor()}`}>
                  {getFuelIcon()}
                  <span className="capitalize">{car.fuelType}</span>
                </div>
              </div>

              {car.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{car.location}</span>
              </div>
              
              {car.freeCancellation && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Shield className="w-3 h-3" />
                  <span>Free cancellation</span>
                </div>
              )}
              
              {car.freeChanges && (
                <div className="text-xs text-green-600">
                  Free changes
                </div>
              )}
              
              {car.payAtCounter && (
                <div className="text-xs text-blue-600">
                  Pay at counter
                </div>
              )}
            </div>
          </div>

          {/* Price & Action */}
          <div className="lg:col-span-3">
            <div className="text-right space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Per day</div>
                <div className="text-2xl font-bold">
                  {car.currency}{car.pricePerDay}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Total: {car.currency}{car.totalPrice}
              </div>
              
              <Button 
                onClick={() => onSelect(car)}
                className="w-full"
                variant={selected ? "default" : "outline"}
              >
                {selected ? "Selected" : "Select Car"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarResultCard;