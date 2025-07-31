import ItineraryPage from "@/components/ItineraryPage";
import { miamiDayTrip } from "@/data/itineraries/MiamiDayTrip";

export default function MiamiPage() {
  return <ItineraryPage trip={miamiDayTrip} />;
}