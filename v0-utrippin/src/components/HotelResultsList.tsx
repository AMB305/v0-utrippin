import HotelResultCard from "@/components/HotelResultCard";
import { Hotel } from "@/hooks/useHotelSearch";

interface HotelResultsListProps {
  hotels: Hotel[];
  onSelect: (hotel: Hotel) => void;
  selectedHotel?: Hotel;
}

const HotelResultsList = ({ hotels, onSelect, selectedHotel }: HotelResultsListProps) => {
  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <HotelResultCard
          key={hotel.id}
          hotel={hotel}
          onSelect={onSelect}
          selected={selectedHotel?.id === hotel.id}
        />
      ))}
    </div>
  );
};

export default HotelResultsList;
