import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

const deals = [
  {
    id: 1,
    destination: "Paris, France",
    price: 523,
    originalPrice: 678,
    image: "🗼",
    duration: "7h 45m",
    airline: "Air France",
    validUntil: "3 days left",
    discount: "23% OFF"
  },
  {
    id: 2,
    destination: "Tokyo, Japan",
    price: 1234,
    originalPrice: 1567,
    image: "🗾",
    duration: "14h 30m",
    airline: "JAL",
    validUntil: "5 days left",
    discount: "21% OFF"
  },
  {
    id: 3,
    destination: "London, UK",
    price: 459,
    originalPrice: 589,
    image: "🏰",
    duration: "7h 20m",
    airline: "Virgin Atlantic",
    validUntil: "2 days left",
    discount: "22% OFF"
  },
  {
    id: 4,
    destination: "Rome, Italy",
    price: 445,
    originalPrice: 567,
    image: "🏛️",
    duration: "8h 45m",
    airline: "Alitalia",
    validUntil: "1 week left",
    discount: "22% OFF"
  }
];

const FlightDeals = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🔥 Limited Time Flight Deals</h2>
        <p className="text-muted-foreground">Don't miss these incredible offers - book now before they expire!</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <Card key={deal.id} className="p-6 hover:shadow-large transition-all duration-300 bg-gradient-card border-primary/20">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{deal.image}</div>
              <h3 className="font-bold text-lg">{deal.destination}</h3>
              <p className="text-sm text-muted-foreground">{deal.airline}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{deal.duration}</span>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {deal.discount}
                </Badge>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-primary">${deal.price}</span>
                  <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">per person</p>
              </div>

              <div className="text-center">
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                  ⏰ {deal.validUntil}
                </Badge>
              </div>

              <Button className="w-full bg-gradient-hero hover:opacity-90">
                Book Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg">
          View All Deals
        </Button>
      </div>
    </div>
  );
};

export default FlightDeals;