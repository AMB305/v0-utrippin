import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Plane, Hotel, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { EnvatoAsset } from "./EnvatoAsset";

// Import downloaded hero images as fallbacks
import heroSantorini from "@/assets/images/santorini-hero.jpg";
import heroAfrica from "@/assets/images/safari-hero.jpg";
import heroAlaska from "@/assets/images/alaska-hero.jpg";
import heroNyc from "@/assets/images/nyc-hero.jpg";
import heroBali from "@/assets/images/bali-hero.jpg";

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  
  // Enhanced destinations with Envato video support
  const destinations = [
    {
      name: "Santorini",
      country: "Greece",
      image: heroSantorini,
      envatoQuery: "Santorini Greece sunset blue domes Mediterranean",
      description: "Immerse yourself in the magic of the Cyclades where volcanic cliffs meet azure waters. Santorini beckons with its iconic blue-domed churches, world-renowned sunsets, and ancient Minoan heritage that whispers tales of civilizations past..."
    },
    {
      name: "Safari Expedition", 
      country: "Africa",
      image: heroAfrica,
      envatoQuery: "African safari wildlife elephants savanna sunset",
      description: "Venture into Africa's heart where the rhythm of the wild sets your pulse racing. Witness the Great Migration across endless savannas, encounter the Big Five in their natural kingdom, and sleep under star-filled skies..."
    },
    {
      name: "Arctic Frontier",
      country: "Alaska", 
      image: heroAlaska,
      envatoQuery: "Alaska mountains glaciers northern lights aurora",
      description: "Step into Alaska's untamed magnificence where glaciers carve ancient stories into mountainsides. Navigate through fjords dotted with icebergs, spot breaching whales, and experience the ethereal dance of the northern lights..."
    },
    {
      name: "Urban Pulse",
      country: "New York",
      image: heroNyc,
      envatoQuery: "New York City skyline Manhattan urban night lights",
      description: "Feel the electric energy of the metropolis that defines modern ambition. From Broadway's dazzling lights to hidden speakeasies in Brooklyn, from world-class art galleries to rooftop gardens touching the sky..."
    },
    {
      name: "Tropical Serenity",
      country: "Bali",
      image: heroBali,
      envatoQuery: "Bali Indonesia rice terraces temples tropical paradise",
      description: "Discover your inner balance in Bali's sacred landscapes where ancient traditions blend seamlessly with natural beauty. Meditate beside emerald rice paddies, explore ornate Hindu temples, and rejuvenate on pristine beaches..."
    }
  ];

  const [currentDestination, setCurrentDestination] = useState(0);

  // Auto-rotate destinations every 6 seconds (longer for videos)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [destinations.length]);

  const currentDest = destinations[currentDestination];

  const handleExploreNow = () => {
    navigate(`/packages?destination=${currentDest.name}`);
  };

  const handleFlightsClick = () => {
    console.log("🚀 Flights button clicked - navigating to /flights");
    navigate('/flights');
  };

  const handleStaysClick = () => {
    console.log("🏨 Hotels button clicked - navigating to /hotels");
    navigate('/hotels');
  };

  const handle360Experience = () => {
    console.log("🌍 360° Experience button clicked - opening Google Earth");
    const earthUrl = "https://earth.google.com/web/";
    window.open(earthUrl, '_blank');
  };

  const handleAITravelClick = () => {
    console.log("🤖 AI Travel Planner button clicked - navigating to /ai-travel");
    navigate('/ai-travel');
  };

  return (
    <div className="hero-section-set relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[500px] sm:min-h-[600px] overflow-hidden">
      {/* Video backgrounds with fallback images */}
      {destinations.map((dest, index) => (
        <div
          key={dest.name}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentDestination ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Use video if available, otherwise fallback to image */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              // Hide video and show image on error
              e.currentTarget.style.display = 'none';
              const img = e.currentTarget.nextElementSibling as HTMLImageElement;
              if (img) img.style.opacity = '1';
            }}
            onLoadedData={(e) => {
              // Hide image when video loads
              const img = e.currentTarget.nextElementSibling as HTMLImageElement;
              if (img) img.style.opacity = '0';
            }}
          >
            <source src={`/api/envato-video?q=${encodeURIComponent(dest.envatoQuery)}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Fallback image */}
          <img
            src={dest.image}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            alt={`Beautiful ${dest.name}, ${dest.country}`}
          />
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 h-full flex items-center pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 pointer-events-auto">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="text-white/80 text-lg sm:text-xl font-medium animate-fade-in">
                {currentDest.country}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
              {currentDest.name}
            </h1>
            
            <p className="text-white/90 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed animate-slide-up">
              {currentDest.description}
              <span className="text-white/70 cursor-pointer hover:text-white transition-colors ml-1">know more</span>
            </p>
          </div>
        </div>
        
        {/* Navigation arrows */}
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden md:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full pointer-events-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white"
          onClick={() => setCurrentDestination((prev) => (prev - 1 + destinations.length) % destinations.length)}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden md:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full pointer-events-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white"
          onClick={() => setCurrentDestination((prev) => (prev + 1) % destinations.length)}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
      
      {/* Enhanced action buttons */}
      <div className="absolute bottom-16 left-0 right-0 w-full px-4 pointer-events-none">
        {/* Mobile: Horizontal scrollable chips */}
        <div className="sm:hidden flex overflow-x-auto gap-3 pb-2 px-2 animate-scale-in pointer-events-auto">
          <Button variant="ghost" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap bg-white/20 backdrop-blur-sm text-white border border-white/30" onClick={handle360Experience}>
            <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
              <Play className="w-2 h-2 fill-current" />
            </div>
            <span className="text-xs">360° View</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap text-white border-white/50 hover:bg-white/20" onClick={handleFlightsClick}>
            <Plane className="w-3 h-3" />
            <span className="text-xs">Flights</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap text-white border-white/50 hover:bg-white/20" onClick={handleStaysClick}>
            <Hotel className="w-3 h-3" />
            <span className="text-xs">Hotels</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap text-white border-white/50 hover:bg-white/20" onClick={handleAITravelClick}>
            <Bot className="w-3 h-3" />
            <span className="text-xs">AI Planner</span>
          </Button>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden sm:flex flex-row flex-wrap gap-4 animate-scale-in justify-center pointer-events-auto">
          <Button variant="ghost" size="lg" className="gap-3 w-auto text-base bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30" onClick={handle360Experience}>
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <span>Experience in 360°</span>
          </Button>
          <Button variant="outline" size="lg" className="gap-2 w-auto text-base text-white border-white/50 hover:bg-white/20" onClick={handleFlightsClick}>
            <Plane className="w-4 h-4" />
            <span>Find Flights to {currentDest.name}</span>
          </Button>
          <Button variant="outline" size="lg" className="gap-2 w-auto text-base text-white border-white/50 hover:bg-white/20" onClick={handleStaysClick}>
            <Hotel className="w-4 h-4" />
            <span>Book Your Stay in {currentDest.name}</span>
          </Button>
          <Button variant="outline" size="lg" className="gap-2 w-auto text-base text-white border-white/50 hover:bg-white/20" onClick={handleAITravelClick}>
            <Bot className="w-4 h-4" />
            <span>AI Travel Planner</span>
          </Button>
        </div>
      </div>
      
      {/* Interactive dots for direct navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDestination(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentDestination ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedHeroSection; 