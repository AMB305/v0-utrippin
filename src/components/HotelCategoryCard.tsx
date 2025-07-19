import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createCategorySearchParams, createSearchParams } from "@/utils/hotelSearchUtils";

interface HotelCategoryCardProps {
  title: string;
  image: string;
  destination?: string;
}

export const HotelCategoryCard = ({ title, image, destination = "Global" }: HotelCategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const searchParams = createCategorySearchParams(destination, title.toLowerCase());
    const urlParams = createSearchParams(searchParams);
    navigate(`/hotels/results?${urlParams.toString()}`);
  };

  return (
    <Card 
      className="min-w-[200px] h-[140px] cursor-pointer hover:shadow-soft transition-all duration-300 hover:scale-105 overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-0 relative h-full">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};