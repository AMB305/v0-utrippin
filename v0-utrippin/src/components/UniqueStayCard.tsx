import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createDealSearchParams, createSearchParams } from "@/utils/hotelSearchUtils";

interface UniqueStayCardProps {
  name: string;
  image: string;
  type: string;
  rating: number;
  price: number;
  originalPrice?: number;
  isExceptional?: boolean;
}

export const UniqueStayCard = ({ 
  name, 
  image, 
  type, 
  rating, 
  price, 
  originalPrice,
  isExceptional = false 
}: UniqueStayCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Extract location from name (first part before comma if exists)
    const location = name.split(' ')[0] || 'Luxury Property';
    const searchParams = createDealSearchParams(
      location, 
      'unique', 
      originalPrice ? [price, originalPrice] : [price, price + 200]
    );
    const urlParams = createSearchParams(searchParams);
    navigate(`/hotels/results?${urlParams.toString()}`);
  };

  return (
    <Card 
      className="min-w-[300px] overflow-hidden hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative h-48">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {isExceptional && (
            <Badge className="absolute top-3 left-3 bg-green-600 text-white">
              Exceptional
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-travel-gold text-travel-gold" />
            <span className="font-semibold">{rating}</span>
            <span className="text-sm text-muted-foreground">• {type}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-3 line-clamp-2">{name}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-primary">
                  ${price}
                </span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
