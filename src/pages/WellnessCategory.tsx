import { ArrowLeft, Leaf, Heart, Sun, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function WellnessCategory() {
  const wellnessDestinations = [
    {
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop",
      description: "Spiritual sanctuary with luxury spa retreats",
      highlights: ["Yoga retreats", "Spa treatments", "Meditation", "Healthy cuisine"]
    },
    {
      name: "Tuscany, Italy",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      description: "Rolling hills and thermal springs",
      highlights: ["Thermal baths", "Wine therapy", "Countryside walks", "Farm-to-table dining"]
    },
    {
      name: "Tulum, Mexico",
      image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&h=300&fit=crop",
      description: "Bohemian beach town with wellness focus",
      highlights: ["Beachfront yoga", "Cenote swimming", "Mayan healing", "Detox programs"]
    },
    {
      name: "Swiss Alps",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      description: "Mountain air and alpine wellness traditions",
      highlights: ["Mountain hiking", "Clean air therapy", "Luxury spas", "Wellness hotels"]
    },
    {
      name: "Kerala, India",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      description: "Ayurvedic healing and backwater serenity",
      highlights: ["Ayurveda treatments", "Backwater cruises", "Yoga training", "Herbal therapies"]
    },
    {
      name: "Costa Rica",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
      description: "Eco-wellness in natural paradise",
      highlights: ["Rainforest yoga", "Volcano views", "Organic farms", "Adventure therapy"]
    }
  ];

  const wellnessActivities = [
    { icon: Leaf, title: "Spa Treatments", description: "Rejuvenating massages and therapies" },
    { icon: Heart, title: "Yoga & Meditation", description: "Mindfulness and spiritual practices" },
    { icon: Sun, title: "Detox Programs", description: "Cleansing and nutrition programs" },
    { icon: Waves, title: "Thermal Baths", description: "Natural hot springs and healing waters" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Wellness & Relaxation Destinations - Rejuvenate Your Soul | Utrippin.ai"
        description="Discover the world's best wellness destinations. From spa retreats to yoga sanctuaries, find your perfect place to relax and rejuvenate."
        canonical="https://utrippin.ai/categories/wellness"
        keywords="wellness travel, spa retreats, yoga destinations, relaxation, meditation retreats"
      />
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
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
              <Leaf size={20} />
              Wellness & Relaxation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Wellness Destinations
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Restore your mind, body, and soul in the world's most tranquil wellness sanctuaries
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Wellness Activities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Wellness Experiences</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {wellnessActivities.map((activity, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
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
          <h2 className="text-3xl font-bold text-center mb-4">Top Wellness Destinations</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Escape to tranquil destinations designed to nurture your well-being and inner peace
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wellnessDestinations.map((destination, index) => (
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
                      <span key={i} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
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
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Wellness Travel Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-500" />
                Preparing for Wellness Travel
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Research retreat philosophies and approaches</li>
                <li>• Pack comfortable, loose-fitting clothing</li>
                <li>• Bring your own yoga mat if preferred</li>
                <li>• Consider digital detox during your stay</li>
                <li>• Arrive with an open mind</li>
                <li>• Book treatments in advance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-pink-500" />
                Maximizing Your Experience
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Start each day with intention setting</li>
                <li>• Try new wellness practices</li>
                <li>• Stay hydrated and eat mindfully</li>
                <li>• Allow time for rest and reflection</li>
                <li>• Connect with nature daily</li>
                <li>• Take wellness habits home with you</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}