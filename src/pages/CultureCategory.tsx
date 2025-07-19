import { ArrowLeft, Camera, MapPin, Book, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function CultureCategory() {
  const culturalDestinations = [
    {
      name: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop",
      description: "Ancient temples and traditional arts",
      highlights: ["Bamboo groves", "Geisha districts", "Temple visits", "Tea ceremonies"]
    },
    {
      name: "Rome, Italy",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&h=300&fit=crop",
      description: "Eternal city with layers of history",
      highlights: ["Colosseum", "Vatican City", "Roman Forum", "Art galleries"]
    },
    {
      name: "Istanbul, Turkey",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=500&h=300&fit=crop",
      description: "Where East meets West",
      highlights: ["Hagia Sophia", "Grand Bazaar", "Bosphorus cruise", "Turkish baths"]
    },
    {
      name: "Marrakech, Morocco",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c0e?w=500&h=300&fit=crop",
      description: "Imperial city of vibrant souks",
      highlights: ["Medina exploration", "Tagine cooking", "Desert trips", "Riads"]
    },
    {
      name: "Cusco, Peru",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=500&h=300&fit=crop",
      description: "Gateway to Machu Picchu",
      highlights: ["Inca ruins", "Colonial architecture", "Local markets", "Andean culture"]
    },
    {
      name: "Rajasthan, India",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop",
      description: "Land of maharajas and palaces",
      highlights: ["Palace hotels", "Camel safaris", "Henna art", "Bollywood culture"]
    }
  ];

  const culturalActivities = [
    { icon: Camera, title: "Photography", description: "Capture historical landmarks and local life" },
    { icon: Book, title: "Museums", description: "Explore world-class art and history" },
    { icon: Users, title: "Local Tours", description: "Guided walks with cultural insights" },
    { icon: MapPin, title: "Heritage Sites", description: "Visit UNESCO World Heritage locations" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Cultural Destinations - Immerse in History | Utrippin.ai"
        description="Explore the world's richest cultural destinations. From ancient temples to modern museums, discover heritage sites and local traditions."
        canonical="https://utrippin.ai/categories/culture"
        keywords="cultural travel, heritage sites, museums, historical destinations, cultural experiences"
      />
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent"></div>
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
              <Book size={20} />
              Cultural Heritage
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Cultural Destinations
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Immerse yourself in rich histories, vibrant traditions, and artistic masterpieces
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Cultural Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Cultural Experiences</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {culturalActivities.map((activity, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
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
          <h2 className="text-3xl font-bold text-center mb-4">Top Cultural Destinations</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Journey through time and discover civilizations that shaped our world
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {culturalDestinations.map((destination, index) => (
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
                      <span key={i} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
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
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Cultural Travel Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Cultural Etiquette
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Research local customs and dress codes</li>
                <li>• Learn basic phrases in the local language</li>
                <li>• Respect photography restrictions</li>
                <li>• Be mindful in religious spaces</li>
                <li>• Support local artisans and guides</li>
                <li>• Try traditional cuisine with an open mind</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Planning Your Visit
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Book popular attractions in advance</li>
                <li>• Consider shoulder seasons for fewer crowds</li>
                <li>• Allow extra time for exploration</li>
                <li>• Pack comfortable walking shoes</li>
                <li>• Bring a good camera or smartphone</li>
                <li>• Research historical context beforehand</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}