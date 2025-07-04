import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import MultiSearch from "../components/search/multi-search";
import PriceTracking from "../components/features/price-tracking";
import SocialPlanning from "../components/features/social-planning";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Plane, MapPin, Clock, TrendingUp } from "lucide-react";
import SEOHead from "../components/common/seo-head";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: recentSearches } = useQuery({
    queryKey: ['/api/searches'],
  });

  const { data: priceAlerts } = useQuery({
    queryKey: ['/api/price-alerts'],
  });

  const { data: userTrips } = useQuery({
    queryKey: ['/api/trips'],
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your travel dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Your Travel Dashboard - UTrippin"
        description="Manage your trips, track prices, and discover new destinations on your personalized travel dashboard."
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome back, {user?.firstName || 'Traveler'}! ✈️
              </h1>
              <p className="text-xl text-blue-100">
                Ready for your next adventure? Let's find you the perfect trip.
              </p>
            </div>
            
            <MultiSearch />
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Searches */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Recent Searches
                    </h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  
                  {recentSearches && recentSearches.length > 0 ? (
                    <div className="space-y-3">
                      {recentSearches.slice(0, 3).map((search) => (
                        <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Plane className="mr-3 h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium text-sm">
                                {search.searchData?.from} → {search.searchData?.to}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(search.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Search Again</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="mx-auto h-12 w-12 mb-2 text-gray-300" />
                      <p>No recent searches yet</p>
                      <p className="text-sm">Start planning your next trip!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Alerts */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Price Alerts
                    </h3>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                  
                  <PriceTracking alerts={priceAlerts} />
                </CardContent>
              </Card>

              {/* Your Trips */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Your Trips
                    </h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  
                  {userTrips && userTrips.length > 0 ? (
                    <div className="space-y-3">
                      {userTrips.slice(0, 3).map((trip) => (
                        <div key={trip.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-sm mb-1">{trip.title}</div>
                          <div className="text-xs text-gray-500 mb-2">{trip.destination}</div>
                          <div className="text-xs text-gray-400">
                            {trip.startDate && new Date(trip.startDate).toLocaleDateString()}
                            {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString()}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="mx-auto h-12 w-12 mb-2 text-gray-300" />
                      <p>No trips planned yet</p>
                      <Button className="mt-2" size="sm">Plan Your First Trip</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Social Planning Section */}
            <div className="mt-12">
              <SocialPlanning />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}