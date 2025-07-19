import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, DollarSign, Plane, Star, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  overview: string;
  history: string;
  culture_overview: string;
  best_time_to_visit: string;
  average_cost_per_day: number;
  currency: string;
  hero_image_url: string;
  meta_title: string;
  meta_description: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  cost_range: string;
  image_url: string;
  location: string;
  tips: string;
}

interface Attraction {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  website_url: string;
  image_url: string;
  rating: number;
  price_range: string;
  opening_hours: string;
}

interface Tip {
  id: string;
  category: string;
  title: string;
  content: string;
}

const Destination = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!slug) return;

      try {
        // Fetch destination
        const { data: destinationData, error: destinationError } = await supabase
          .from('destinations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (destinationError) throw destinationError;
        setDestination(destinationData);

        // Fetch activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('destination_activities')
          .select('*')
          .eq('destination_id', destinationData.id)
          .order('category');

        if (activitiesError) throw activitiesError;
        setActivities(activitiesData || []);

        // Fetch attractions
        const { data: attractionsData, error: attractionsError } = await supabase
          .from('destination_attractions')
          .select('*')
          .eq('destination_id', destinationData.id)
          .order('rating', { ascending: false });

        if (attractionsError) throw attractionsError;
        setAttractions(attractionsData || []);

        // Fetch tips
        const { data: tipsData, error: tipsError } = await supabase
          .from('destination_tips')
          .select('*')
          .eq('destination_id', destinationData.id)
          .order('category');

        if (tipsError) throw tipsError;
        setTips(tipsData || []);

      } catch (error) {
        console.error('Error fetching destination data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationData();
  }, [slug]);

  const handleBookFlight = () => {
    navigate(`/flights?destination=${encodeURIComponent(destination?.name || '')}`);
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const groupedTips = tips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, Tip[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Destination Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the destination you're looking for.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${destination.name}, ${destination.country} - Travel Guide | Utrippin.ai`}
        description={destination.meta_description || `Discover ${destination.name}, ${destination.country}. ${destination.description} Find flights, hotels, activities and travel tips for your perfect getaway.`}
        canonical={`https://utrippin.ai/destinations/${destination.slug}`}
        keywords={`${destination.name} travel, ${destination.country} tourism, ${destination.name} attractions, ${destination.name} hotels, ${destination.name} flights`}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TouristDestination",
              "name": destination.name,
              "description": destination.description,
              "url": `https://utrippin.ai/destinations/${destination.slug}`,
              "geo": {
                "@type": "GeoCoordinates",
                "addressCountry": destination.country,
                "addressRegion": destination.region
              },
              "touristType": "leisure",
              "hasMap": `https://maps.google.com/?q=${encodeURIComponent(destination.name + ', ' + destination.country)}`
            },
            {
              "@type": "TravelGuide",
              "name": `${destination.name} Travel Guide`,
              "description": `Complete travel guide for ${destination.name}, ${destination.country}`,
              "about": {
                "@type": "Place",
                "name": destination.name,
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": destination.country,
                  "addressRegion": destination.region
                }
              }
            },
            {
              "@type": "WebPage",
              "@id": `https://utrippin.ai/destinations/${destination.slug}#webpage`,
              "url": `https://utrippin.ai/destinations/${destination.slug}`,
              "name": `${destination.name}, ${destination.country} - Travel Guide | Utrippin.ai`,
              "description": destination.meta_description || `Discover ${destination.name}, ${destination.country}. Complete travel guide with attractions, activities and tips.`,
              "inLanguage": "en-US"
            }
          ]
        }}
      />
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination.hero_image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
          <div className="text-white max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{destination.country}</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">{destination.name}</h1>
            <p className="text-xl mb-8 leading-relaxed">{destination.description}</p>
            <Button 
              onClick={handleBookFlight}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3"
            >
              <Plane className="mr-2 h-5 w-5" />
              Book Your Flight
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-foreground mb-6">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {destination.overview}
              </p>
              
              {destination.history && (
                <>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">History & Culture</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {destination.history}
                  </p>
                </>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Best Time to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {destination.best_time_to_visit || "Year-round destination"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Average Daily Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    {destination.currency} {destination.average_cost_per_day || "150"}
                  </p>
                  <p className="text-sm text-muted-foreground">Per person per day</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        {activities.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Things to Do</h2>
            {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryActivities.map((activity) => (
                    <Card key={activity.id} className="group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <Badge variant="secondary">{activity.cost_range}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          {activity.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                        {activity.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Attractions Section */}
        {attractions.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Top Attractions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attractions.map((attraction) => (
                <Card key={attraction.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{attraction.name}</CardTitle>
                      {attraction.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{attraction.rating}</span>
                        </div>
                      )}
                    </div>
                    <CardDescription>{attraction.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{attraction.description}</p>
                    {attraction.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3" />
                        {attraction.address}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {attraction.price_range && (
                        <Badge variant="outline">{attraction.price_range}</Badge>
                      )}
                      {attraction.website_url && (
                        <Button variant="link" size="sm" asChild>
                          <a href={attraction.website_url} target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Travel Tips Section */}
        {tips.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Travel Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupedTips).map(([category, categoryTips]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryTips.map((tip) => (
                      <div key={tip.id}>
                        <h4 className="font-semibold text-foreground mb-2">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.content}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Visit {destination.name}?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Book your flight now and start planning your perfect getaway.
          </p>
          <Button 
            onClick={handleBookFlight}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3"
          >
            <Plane className="mr-2 h-5 w-5" />
            Book Your Flight to {destination.name}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
};

export default Destination;