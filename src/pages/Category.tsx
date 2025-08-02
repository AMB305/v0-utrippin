import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  overview: string;
  hero_image_url: string;
  best_time_to_visit: string;
  currency: string;
  average_cost_per_day: number;
  keywords: string[];
}

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  cost_range: string;
  location: string;
}

const categoryConfig = {
  'wildlife-nature': {
    title: 'Wildlife & Nature',
    description: 'Discover incredible wildlife and pristine natural environments around the world',
    keywords: ['wildlife', 'nature', 'safari', 'national park', 'rainforest'],
    heroImage: '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'
  },
  'budget-travel': {
    title: 'Budget Travel',
    description: 'Amazing destinations that won\'t break the bank - incredible value for money',
    keywords: ['budget', 'affordable', 'backpacking'],
    heroImage: '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'
  },
  'beaches-islands': {
    title: 'Beaches & Islands',
    description: 'Paradise destinations with pristine beaches and crystal-clear waters',
    keywords: ['beaches', 'tropical', 'islands', 'diving', 'luxury'],
    heroImage: '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'
  },
  'adventure': {
    title: 'Adventure',
    description: 'Thrilling destinations for adrenaline seekers and outdoor enthusiasts',
    keywords: ['adventure', 'extreme sports', 'trekking', 'mountains'],
    heroImage: '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'
  },
  'arts-culture': {
    title: 'Arts & Culture',
    description: 'Immerse yourself in rich history, art, and cultural heritage',
    keywords: ['culture', 'history', 'art', 'museums', 'heritage'],
    heroImage: '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'
  },
  'romantic': {
    title: 'Romantic',
    description: 'Perfect destinations for couples and romantic getaways',
    keywords: ['romantic', 'honeymoon', 'couples'],
    heroImage: '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'
  }
};

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Record<string, Activity[]>>({});
  const [loading, setLoading] = useState(true);

  const config = category ? categoryConfig[category as keyof typeof categoryConfig] : null;

  useEffect(() => {
    if (!config) {
      navigate('/404');
      return;
    }

    const fetchCategoryData = async () => {
      try {
        // Fetch destinations that match category keywords
        const { data: destinationsData, error: destError } = await supabase
          .from('destinations')
          .select('*')
          .overlaps('keywords', config.keywords)
          .eq('featured', true)
          .order('name');

        if (destError) throw destError;

        setDestinations(destinationsData || []);

        // Fetch activities for each destination
        if (destinationsData?.length) {
          const destinationIds = destinationsData.map(d => d.id);
          const { data: activitiesData, error: actError } = await supabase
            .from('destination_activities')
            .select('*')
            .in('destination_id', destinationIds);

          if (actError) throw actError;

          // Group activities by destination
          const activitiesByDest = (activitiesData || []).reduce((acc, activity) => {
            if (!acc[activity.destination_id]) {
              acc[activity.destination_id] = [];
            }
            acc[activity.destination_id].push(activity);
            return acc;
          }, {} as Record<string, Activity[]>);

          setActivities(activitiesByDest);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category, config, navigate]);

  const handleBookFlight = (destination: Destination) => {
    navigate(`/flights?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`);
  };

  if (!config) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${config.title} Travel Destinations | Utrippin.ai`}
        description={`${config.description}. Discover the best ${config.title.toLowerCase()} destinations worldwide with expert travel guides and booking options.`}
        canonical={`https://utrippin.ai/categories/${category}`}
        keywords={`${config.keywords.join(', ')}, ${config.title.toLowerCase()} travel, destinations`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `https://utrippin.ai/categories/${category}#webpage`,
          "url": `https://utrippin.ai/categories/${category}`,
          "name": `${config.title} Travel Destinations | Utrippin.ai`,
          "description": `${config.description}. Discover the best ${config.title.toLowerCase()} destinations worldwide.`,
          "inLanguage": "en-US"
        }}
      />
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={config.heroImage} 
          alt={config.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{config.title}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Destinations</h2>
          <p className="text-muted-foreground">
            Discover the best {config.title.toLowerCase()} destinations around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={destination.hero_image_url} 
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">
                    {destination.region}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {destination.name}, {destination.country}
                </CardTitle>
                <CardDescription>{destination.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {destination.best_time_to_visit}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {destination.currency} {destination.average_cost_per_day}/day
                  </div>
                </div>

                {/* Top Activities */}
                {activities[destination.id] && activities[destination.id].length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Top Activities:</h4>
                    <div className="space-y-2">
                      {activities[destination.id].slice(0, 2).map((activity) => (
                        <div key={activity.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{activity.title}</span>
                          </div>
                          <p className="text-muted-foreground text-xs ml-5">
                            {activity.duration} • {activity.cost_range}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/destinations/${destination.slug}`)}
                  >
                    Learn More
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleBookFlight(destination)}
                  >
                    Book Flight
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {destinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No destinations found for this category. Check back soon for new additions!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
    </>
  );
}
