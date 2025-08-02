import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createDealSearchParams, createSearchParams } from "@/utils/hotelSearchUtils";

interface HotelDealCardProps {
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  hasVipAccess?: boolean;
  isMemberPrice?: boolean;
}

export const HotelDealCard = ({
  name,
  image,
  location,
  rating,
  reviewCount,
  originalPrice,
  discountedPrice,
  discount,
  hasVipAccess = false,
  isMemberPrice = false
}: HotelDealCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const searchParams = createDealSearchParams(
      location, 
      hasVipAccess ? 'vip' : 'deal',
      [discountedPrice, originalPrice]
    );
    const urlParams = createSearchParams(searchParams);
    navigate(`/hotels/results?${urlParams.toString()}`);
  };

  return (
    <Card 
      className="min-w-[280px] overflow-hidden hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
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
          {hasVipAccess && (
            <Badge className="absolute top-3 left-3 bg-travel-gold text-white">
              VIP Access
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-destructive text-white">
              {discount}% off
            </Badge>
          )}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{location}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-travel-gold text-travel-gold" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {originalPrice > discountedPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-primary">
                  ${discountedPrice}
                </span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
              {isMemberPrice && (
                <span className="text-xs text-travel-blue">Member price</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
