import { Button } from "@/components/ui/button";
import adventure from "@/assets/adventure.jpg";
import artsCulture from "@/assets/arts-culture.jpg";
import soloTravel from "@/assets/solo-travel.jpg";
import familyFriendly from "@/assets/family-friendly.jpg";

const virtualDestinations = [
  {
    name: "James Oglethorpe Monument, Chippewa Square",
    location: "Savannah, Georgia",
    image: adventure,
  },
  {
    name: "New Brunswick, Saint John, Rockwood Park",
    location: "Long Lake Trail",
    image: artsCulture,
  },
  {
    name: "Lake at the 2011 Dogwood Festival",
    location: "Piedmont Park, Atlanta",
    image: soloTravel,
  },
  {
    name: "New York City skyline from downtown",
    location: "Brooklyn, NYC",
    image: familyFriendly,
  },
];

const VirtualTravel = () => {
  return (
    <div className="py-16 bg-travel-navy text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Travel the world virtually
          </h2>
          <p className="text-white/80 text-lg">
            Experience popular destinations without leaving home
          </p>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button variant="travel-glass" className="bg-white/20 text-white border-white/30">
            Panorama
          </Button>
          <Button variant="travel-glass" className="bg-white/20 text-white border-white/30">
            Day / Night view
          </Button>
          <Button variant="travel-glass" className="bg-white/20 text-white border-white/30">
            360 videos
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Left sidebar with thumbnails */}
          <div className="space-y-4">
            {virtualDestinations.map((destination, index) => (
              <div
                key={destination.name}
                className="group cursor-pointer animate-scale-in bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300 border border-white/10 hover:border-white/20"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex gap-4">
                  <div className="relative overflow-hidden rounded-lg w-28 h-20 flex-shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${destination.image})` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base text-white group-hover:text-travel-gold transition-colors duration-300">
                      {destination.name}
                    </h4>
                    <p className="text-white/60 text-sm mt-2">
                      {destination.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main panoramic view */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${adventure})` }}
              />
              
              {/* Navigation controls overlay */}
              <div className="absolute inset-0">
                {/* Compass in top right */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-black/70 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-6 h-6 text-white/80">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Zoom controls on right side */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                  <button className="w-12 h-12 bg-black/70 rounded-lg border-2 border-white/30 hover:bg-black/80 transition-colors backdrop-blur-sm flex items-center justify-center text-white/80 text-xl font-light">
                    +
                  </button>
                  <button className="w-12 h-12 bg-black/70 rounded-lg border-2 border-white/30 hover:bg-black/80 transition-colors backdrop-blur-sm flex items-center justify-center text-white/80 text-xl font-light">
                    −
                  </button>
                </div>
                
                {/* Directional navigation control in bottom left */}
                <div className="absolute bottom-6 left-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 bg-black/70 rounded-full border-2 border-white/30 backdrop-blur-sm"></div>
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full"></div>
                    {/* Up arrow */}
                    <button className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-white/80"></div>
                    </button>
                    {/* Down arrow */}
                    <button className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-white/80"></div>
                    </button>
                    {/* Left arrow */}
                    <button className="absolute left-1 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-r-[6px] border-transparent border-r-white/80"></div>
                    </button>
                    {/* Right arrow */}
                    <button className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-white/80"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom overlay with location info */}
            <div className="absolute bottom-6 left-32 right-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    James Oglethorpe Monument,
                  </h3>
                  <p className="text-white/80">
                    Chippewa Square, Savannah, Georgia
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="travel-glass" 
                    size="sm"
                    className="bg-white/20 text-white border-white/30"
                  >
                    Like what you see?
                  </Button>
                  <Button 
                    variant="travel-gold" 
                    size="sm"
                  >
                    Explore now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTravel;