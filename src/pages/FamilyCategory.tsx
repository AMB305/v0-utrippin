import { ArrowLeft, Users, Heart, Baby, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function FamilyCategory() {
  const familyDestinations = [
    {
      name: "Orlando, Florida",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      description: "The ultimate theme park capital",
      highlights: ["Disney World", "Universal Studios", "Water parks", "Family resorts"]
    },
    {
      name: "London, England",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
      description: "History and magic for all ages",
      highlights: ["Harry Potter tours", "Museums", "Buckingham Palace", "Thames cruises"]
    },
    {
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
      description: "Where tradition meets modern fun",
      highlights: ["Disneyland Tokyo", "Anime culture", "Safe environment", "Unique experiences"]
    },
    {
      name: "Costa Rica",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
      description: "Adventure and wildlife for families",
      highlights: ["Wildlife watching", "Zip-lining", "Beach time", "Eco-adventures"]
    },
    {
      name: "Iceland",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c0e?w=500&h=300&fit=crop",
      description: "Natural wonders and family adventures",
      highlights: ["Geysers", "Northern lights", "Hot springs", "Whale watching"]
    },
    {
      name: "Sydney, Australia",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      description: "Urban adventures and beach fun",
      highlights: ["Opera House", "Taronga Zoo", "Bondi Beach", "Harbour Bridge"]
    }
  ];

  const familyActivities = [
    { icon: Gamepad2, title: "Theme Parks", description: "Thrilling rides and magical experiences" },
    { icon: Heart, title: "Wildlife", description: "Zoos, aquariums, and safari adventures" },
    { icon: Users, title: "Interactive Museums", description: "Hands-on learning and exploration" },
    { icon: Baby, title: "Kid-Friendly Tours", description: "Age-appropriate guided experiences" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Family Travel Destinations - Fun for All Ages | Utrippin.ai"
        description="Discover the best family-friendly destinations. From theme parks to cultural experiences, find perfect trips that delight kids and adults alike."
        canonical="https://utrippin.ai/categories/family"
        keywords="family travel, kid-friendly destinations, family vacation, theme parks, family activities"
      />
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent"></div>
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
              <Users size={20} />
              Family Adventures
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Family Destinations
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Create magical memories with destinations that delight every member of the family
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Family Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Family-Friendly Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {familyActivities.map((activity, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
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
          <h2 className="text-3xl font-bold text-center mb-4">Top Family Destinations</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Destinations designed to create unforgettable memories for the whole family
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {familyDestinations.map((destination, index) => (
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
                      <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Family Travel Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Baby className="w-5 h-5 text-green-500" />
                Traveling with Kids
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Pack entertainment for travel days</li>
                <li>• Bring familiar snacks and comfort items</li>
                <li>• Plan for rest breaks and nap times</li>
                <li>• Consider family-friendly accommodations</li>
                <li>• Pack a basic first aid kit</li>
                <li>• Keep important documents accessible</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500" />
                Making Memories
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Involve kids in trip planning</li>
                <li>• Create a travel journal together</li>
                <li>• Take lots of photos and videos</li>
                <li>• Try local foods together</li>
                <li>• Balance activities with downtime</li>
                <li>• Collect souvenirs from each destination</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}