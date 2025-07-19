import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Filter } from "lucide-react";
import { format } from "date-fns";

interface SearchPreviewProps {
  destination: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  adults: number;
  children: number;
  rooms: number;
  category?: string;
  dealType?: string;
  priceRange?: [number, number];
}

export const SearchPreview = ({
  destination,
  checkInDate,
  checkOutDate,
  adults,
  children,
  rooms,
  category,
  dealType,
  priceRange
}: SearchPreviewProps) => {
  return (
    <Alert className="mb-4 border-primary/20 bg-primary/5">
      <Filter className="h-4 w-4 text-primary" />
      <AlertDescription>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{destination}</span>
          </div>
          
          {checkInDate && checkOutDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(checkInDate, "MMM dd")} - {format(checkOutDate, "MMM dd")}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{adults + children} guests, {rooms} rooms</span>
          </div>
          
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category} hotels
            </Badge>
          )}
          
          {dealType && (
            <Badge variant="secondary" className="text-xs">
              {dealType} deals
            </Badge>
          )}
          
          {priceRange && (
            <Badge variant="secondary" className="text-xs">
              ${priceRange[0]} - ${priceRange[1]}
            </Badge>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};