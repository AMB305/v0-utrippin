import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Plane, Hotel, Bot } from "lucide-react";
import { VecteezyImage } from "@/components/VecteezyImage";

const HeroSection = () => {
  const navigate = useNavigate();
  
  // Hero destination data (could be dynamic in the future)
  const heroDestination = {
    name: "Santorini",
    country: "Greece"
  };

  const handleExploreNow = () => {
    navigate(`/packages?destination=${heroDestination.name}`);
  };

  const handleFlightsClick = () => {
    console.log("🚀 Flights button clicked - navigating to /flights");
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'navigation_click', {
        event_category: 'Hero Actions',
        event_label: 'Find Flights to Santorini',
        value: 1,
      });
    }
    navigate('/flights');
  };

  const handleStaysClick = () => {
    console.log("🏨 Hotels button clicked - navigating to /hotels");
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'navigation_click', {
        event_category: 'Hero Actions',
        event_label: 'Book Stay',
        value: 1,
      });
    }
    navigate('/hotels');
  };

  const handle360Experience = () => {
    console.log("🌍 360° Experience button clicked - opening Google Earth");
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'external_link_click', {
        event_category: 'Hero Actions',
        event_label: 'Santorini 360 Experience',
        value: 1,
      });
    }
    const santorini360Url = "https://earth.google.com/web/search/Santorini,+Greece/@36.37583181,25.42446553,163.19439248a,0d,60y,99.75010187h,79.2800239t,0r/data=CoABGlISTAolMHgxNDk5Y2U4NmFkZmQ5ZmY3OjB4YjJhNzYxZjc0MGQ2OGFmYxkdnD7xUjJCQCGZzYh3JXY5QCoRU2FudG9yaW5pLCBHcmVlY2UYASABIiYKJAmPBXubEwxCQBG8dvMmgAdCQBlEeuxyugpcwCEN2S9WGg1cwEICCAEiGkoXQ0lITTBvZ0tFSUNBZ0lDaGstVzY5Z0UQBToDCgEwQgIIAEoNCP___________wEQAA";
    window.open(santorini360Url, '_blank');
  };

  const handleThingsToSeeAndDo = () => {
    navigate('/greece');
  };

  const handleAITravelClick = () => {
    console.log("🤖 AI Travel Planner button clicked - navigating to /ai-travel");
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'navigation_click', {
        event_category: 'Hero Actions',
        event_label: 'AI Travel Planner',
        value: 1,
      });
    }
    navigate('/ai-travel');
  };

  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[500px] sm:min-h-[600px] overflow-hidden">
      <img
        src="/lovable-uploads/73750d9f-4b47-4b9c-9b9e-489d73ad1418.png"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Beautiful Santorini, Greece with white buildings and sunset"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 h-full flex items-center pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 pointer-events-auto">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="text-primary-foreground/80 text-lg sm:text-xl font-medium">Greece</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 animate-fade-in">
              Santorini
            </h1>
            
            <p className="text-primary-foreground/90 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed animate-slide-up">
              Visit Santorini to enjoy the island's dramatic volcanic scenery, particularly those in the Oia and 
              Fira districts, as well as its spectacular beauty and charm. Catch sun and its 
              rich cultural legacy. Don't miss the island's centuries-old fortifications, traditional Greek...
              <span className="text-primary-foreground/70 cursor-pointer hover:text-primary-foreground transition-colors">know more</span>
            </p>
            
          </div>
        </div>
        
        <Button 
          variant="travel-glass" 
          size="icon"
          className="hidden md:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full pointer-events-auto"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        
        <Button 
          variant="travel-glass" 
          size="icon"
          className="hidden md:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full pointer-events-auto"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        
      </div>
      
      {/* Category buttons below the image */}
      <div className="absolute bottom-16 left-0 right-0 w-full px-4 pointer-events-none">
        {/* Mobile: Horizontal scrollable chips */}
        <div className="sm:hidden flex overflow-x-auto gap-3 pb-2 px-2 animate-scale-in pointer-events-auto">
          <Button variant="travel-glass" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap" onClick={handle360Experience}>
            <div className="w-4 h-4 rounded-full border border-primary-foreground flex items-center justify-center">
              <Play className="w-2 h-2 fill-current" />
            </div>
            <span className="text-xs">360° View</span>
          </Button>
          <Button variant="travel-outline" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap" onClick={handleFlightsClick}>
            <Plane className="w-3 h-3" />
            <span className="text-xs">Flights</span>
          </Button>
          <Button variant="travel-gold" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap" onClick={handleStaysClick}>
            <Hotel className="w-3 h-3" />
            <span className="text-xs">Hotels</span>
          </Button>
          <Button variant="travel-outline" size="sm" className="flex-shrink-0 gap-2 px-4 py-2 rounded-full whitespace-nowrap" onClick={handleAITravelClick}>
            <Bot className="w-3 h-3" />
            <span className="text-xs">AI Planner</span>
          </Button>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden sm:flex flex-row flex-wrap gap-4 animate-scale-in justify-center pointer-events-auto">
          <Button variant="travel-glass" size="lg" className="gap-3 w-auto text-base" onClick={handle360Experience}>
            <div className="w-8 h-8 rounded-full border-2 border-primary-foreground flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <span>Experience in 360°</span>
          </Button>
          <Button variant="travel-outline" size="lg" className="gap-2 w-auto text-base" onClick={handleFlightsClick}>
            <Plane className="w-4 h-4" />
            <span>Find Flights to Santorini</span>
          </Button>
          <Button variant="travel-gold" size="lg" className="gap-2 w-auto text-base" onClick={handleStaysClick}>
            <Hotel className="w-4 h-4" />
            <span>Book Your Stay in Santorini</span>
          </Button>
          <Button variant="travel-outline" size="lg" className="gap-2 w-auto text-base" onClick={handleAITravelClick}>
            <Bot className="w-4 h-4" />
            <span>AI Travel Planner</span>
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[1, 2, 3, 4, 5].map((dot, index) => (
          <div 
            key={dot}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === 0 ? 'bg-primary-foreground' : 'bg-primary-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
