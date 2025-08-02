import { ArrowLeft, Sun, Waves, Palmtree, Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function BeachCategory() {
  const beachDestinations = [
    {
      name: "Maldives",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      description: "Crystal clear waters and overwater bungalows",
      highlights: ["Overwater villas", "Coral reefs", "Luxury resorts", "Diving"]
    },
    {
      name: "Bora Bora",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop",
      description: "The pearl of the Pacific with stunning lagoons",
      highlights: ["Lagoon tours", "Mount Otemanu", "Pearl farms", "Jet skiing"]
    },
    {
      name: "Santorini",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=300&fit=crop",
      description: "Iconic blue domes and volcanic beaches",
      highlights: ["Sunset views", "Wine tasting", "Volcanic beaches", "Cliff hotels"]
    },
    {
      name: "Maui, Hawaii",
      image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=500&h=300&fit=crop",
      description: "Tropical paradise with diverse landscapes",
      highlights: ["Road to Hana", "Haleakala crater", "Snorkeling", "Luau parties"]
    },
    {
      name: "Turks & Caicos",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
      description: "Pristine beaches and luxury resorts",
      highlights: ["Grace Bay Beach", "Conch cuisine", "Whale watching", "Kayaking"]
    },
    {
      name: "Seychelles",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c783?w=500&h=300&fit=crop",
      description: "Unique granite boulders and pristine nature",
      highlights: ["Anse Source d'Argent", "Giant tortoises", "Snorkeling", "Nature reserves"]
    }
  ];

  const beachActivities = [
    { icon: Sun, title: "Sunbathing", description: "Relax on pristine sandy beaches" },
    { icon: Waves, title: "Water Sports", description: "Surfing, kayaking, and jet skiing" },
    { icon: Camera, title: "Photography", description: "Capture stunning coastal landscapes" },
    { icon: Palmtree, title: "Beach Walks", description: "Romantic strolls along the shore" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Beach Destinations - Paradise Awaits | Utrippin.ai"
        description="Discover the world's most beautiful beach destinations. From tropical paradises to coastal gems, find your perfect beach getaway."
        canonical="https://utrippin.ai/categories/beach"
        keywords="beach destinations, tropical paradise, beach vacation, coastal travel, island getaway"
      />
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
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
              <Waves size={20} />
              Beach Paradise
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Beach Destinations
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Escape to tropical paradises where crystal-clear waters meet pristine sandy shores
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Beach Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Beach Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {beachActivities.map((activity, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
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
          <h2 className="text-3xl font-bold text-center mb-4">Top Beach Destinations</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            From tropical islands to Mediterranean coastlines, discover the world's most stunning beach destinations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beachDestinations.map((destination, index) => (
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
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Beach Travel Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-500" />
                What to Pack
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• High SPF sunscreen (reef-safe when possible)</li>
                <li>• Swimwear and cover-ups</li>
                <li>• Waterproof phone case</li>
                <li>• Flip-flops and water shoes</li>
                <li>• Light, breathable clothing</li>
                <li>• Hat and sunglasses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Best Time to Visit
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Caribbean:</strong> December to April (dry season)</li>
                <li>• <strong>Mediterranean:</strong> May to September</li>
                <li>• <strong>Southeast Asia:</strong> November to March</li>
                <li>• <strong>Maldives:</strong> November to April</li>
                <li>• <strong>Australia:</strong> December to February</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
