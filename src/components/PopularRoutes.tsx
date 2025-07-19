import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, TrendingUp } from "lucide-react";

const popularRoutes = [
  {
    id: 1,
    from: "New York",
    to: "London",
    fromCode: "NYC",
    toCode: "LON",
    price: 459,
    change: "+12%",
    trend: "up",
    frequency: "Daily",
    airlines: 8
  },
  {
    id: 2,
    from: "Los Angeles",
    to: "Tokyo",
    fromCode: "LAX",
    toCode: "NRT",
    price: 987,
    change: "-5%",
    trend: "down",
    frequency: "Daily",
    airlines: 6
  },
  {
    id: 3,
    from: "Miami",
    to: "Madrid",
    fromCode: "MIA",
    toCode: "MAD",
    price: 567,
    change: "+8%",
    trend: "up",
    frequency: "4x/week",
    airlines: 5
  },
  {
    id: 4,
    from: "Chicago",
    to: "Paris",
    fromCode: "ORD",
    toCode: "CDG",
    price: 634,
    change: "-3%",
    trend: "down",
    frequency: "Daily",
    airlines: 7
  },
  {
    id: 5,
    from: "San Francisco",
    to: "Amsterdam",
    fromCode: "SFO",
    toCode: "AMS",
    price: 723,
    change: "+15%",
    trend: "up",
    frequency: "5x/week",
    airlines: 4
  },
  {
    id: 6,
    from: "Boston",
    to: "Rome",
    fromCode: "BOS",
    toCode: "FCO",
    price: 545,
    change: "-1%",
    trend: "down",
    frequency: "4x/week",
    airlines: 6
  }
];

const PopularRoutes = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🌟 Most Popular Flight Routes</h2>
        <p className="text-muted-foreground">Discover trending destinations and compare prices on popular routes</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularRoutes.map((route) => (
          <Card key={route.id} className="p-4 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <p className="font-bold text-sm">{route.fromCode}</p>
                  <p className="text-xs text-muted-foreground">{route.from}</p>
                </div>
                <Plane className="w-5 h-5 text-primary rotate-45" />
                <div className="text-center">
                  <p className="font-bold text-sm">{route.toCode}</p>
                  <p className="text-xs text-muted-foreground">{route.to}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                route.trend === 'up' ? 'text-red-500' : 'text-green-500'
              }`}>
                <TrendingUp className={`w-3 h-3 ${route.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{route.change}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xl font-bold text-primary">${route.price}</p>
                <p className="text-xs text-muted-foreground">from</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{route.frequency}</p>
                <p className="text-xs text-muted-foreground">{route.airlines} airlines</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Search Flights
            </Button>
          </Card>
        ))}
      </div>

      <div className="bg-travel-light p-8 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Can't find your route?</h3>
        <p className="text-muted-foreground mb-4">
          We cover over 1,000+ destinations worldwide. Search for any city or airport.
        </p>
        <Button size="lg">
          Search All Destinations
        </Button>
      </div>
    </div>
  );
};

export default PopularRoutes;