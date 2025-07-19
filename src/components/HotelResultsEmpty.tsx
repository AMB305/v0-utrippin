import { Button } from "@/components/ui/button";

interface HotelResultsEmptyProps {
  onNewSearch: () => void;
}

const HotelResultsEmpty = ({ onNewSearch }: HotelResultsEmptyProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
      <p className="text-muted-foreground mb-4">Try adjusting your search criteria or dates</p>
      <Button onClick={onNewSearch}>New Search</Button>
    </div>
  );
};

export default HotelResultsEmpty;