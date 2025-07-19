import { ArrowLeft, Mountain, Snowflake, Coffee, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function SkiCategory() {
  const skiDestinations = [
    {
      name: "Aspen, Colorado",
      image: "https://images.unsplash.com/photo-1551524164-6cf64ac230fb?w=500&h=300&fit=crop",
      description: "World-class skiing and luxury mountain resort",
      highlights: ["Four ski areas", "Luxury lodges", "Apres-ski scene", "Celebrity spotting"]
    },
    {
      name: "Chamonix, France",
      image: "https://images.unsplash.com/photo-1551524164-0c2bc130e4ff?w=500&h=300&fit=crop",
      description: "The birthplace of extreme skiing",
      highlights: ["Mont Blanc views", "Off-piste skiing", "Cable cars", "Alpine cuisine"]
    },
    {
      name: "St. Moritz, Switzerland",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      description: "Glamorous Alpine resort destination",
      highlights: ["Luxury hotels", "Bobsled runs", "Lake activities", "High-end shopping"]
    },
    {
      name: "Whistler, Canada",
      image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=500&h=300&fit=crop",
      description: "Olympic-caliber skiing in British Columbia",
      highlights: ["Twin peaks", "Village atmosphere", "Summer activities", "Bear watching"]
    },
    {
      name: "Niseko, Japan",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      description: "Famous for its powder snow and hot springs",
      highlights: ["Powder snow", "Onsen hot springs", "Japanese culture", "Night skiing"]
    },
    {
      name: "Zermatt, Switzerland",
      image: "https://images.unsplash.com/photo-1578063286240-fa0b3aa8f1dc?w=500&h=300&fit=crop",
      description: "Car-free village beneath the Matterhorn",
      highlights: ["Matterhorn views", "Glacier skiing", "Scenic railways", "Alpine huts"]
    }
  ];

  const skiActivities = [
    { icon: Mountain, title: "Alpine Skiing", description: "Hit the slopes on groomed trails" },
    { icon: Snowflake, title: "Snowboarding", description: "Freestyle and freeride adventures" },
    { icon: Activity, title: "Cross Country", description: "Nordic skiing through winter landscapes" },
    { icon: Coffee, title: "Après-Ski", description: "Cozy mountain lodges and hot drinks" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Ski Destinations - Alpine Adventures | Utrippin.ai"
        description="Discover the world's best ski destinations. From powder snow to luxury resorts, find your perfect winter mountain getaway."
        canonical="https://utrippin.ai/categories/ski"
        keywords="ski destinations, winter sports, alpine skiing, snowboarding, mountain resorts"
      />
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <Link 
            to="/flights" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Flights
          </Link>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-4">
              <Snowflake size={20} />
              Winter Adventures
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Ski Destinations
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Carve through fresh powder on the world's most spectacular mountain slopes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Ski Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Winter Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {skiActivities.map((activity, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                  <activity.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{activity.title}</h3>
                <p className="text-muted-foreground text-sm">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Top Ski Destinations</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            From legendary Alpine resorts to hidden powder gems, discover the world's best ski destinations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skiDestinations.map((destination, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
                    <p className="text-sm text-white/90">{destination.description}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{destination.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{destination.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Ski Travel Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-blue-500" />
                Essential Gear
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Quality ski jacket and pants (waterproof)</li>
                <li>• Thermal base layers</li>
                <li>• Ski socks (avoid cotton)</li>
                <li>• Helmet and goggles</li>
                <li>• Sunscreen (high SPF for snow reflection)</li>
                <li>• Consider renting equipment locally</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-indigo-500" />
                Best Ski Seasons
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Alps:</strong> December to April</li>
                <li>• <strong>North America:</strong> November to April</li>
                <li>• <strong>Japan:</strong> December to March</li>
                <li>• <strong>Southern Hemisphere:</strong> June to September</li>
                <li>• Book accommodations early for peak season</li>
                <li>• Consider shoulder seasons for better deals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}