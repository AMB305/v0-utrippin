import React from 'react';

interface TripCard {
  title: string;
  subtitle: string;
  nights: string;
  image: string;
}

const ExploreOurTrips = () => {
  const trips: TripCard[] = [
    {
      title: "SELOUS TO ZANZIBAR:",
      subtitle: "ESCAPE THE CROWDS IN TANZANIA",
      nights: "9 NIGHTS",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "DISCOVER JAPAN:",
      subtitle: "ANCIENT TRADITIONS & MODERN WONDERS",
      nights: "12 NIGHTS", 
      image: "/lovable-uploads/cd8bccc6-f260-4105-b1da-110b7d78d4cd.png"
    },
    {
      title: "TROPICAL PARADISE:",
      subtitle: "LUXURY ISLAND ESCAPE",
      nights: "7 NIGHTS",
      image: "/lovable-uploads/742a8535-4832-4494-b76c-1c58d6abb2a8.png"
    },
    {
      title: "ATHENS, MYKONOS AND",
      subtitle: "CRETE: A LUXURY FAMILY DISCOVERY IN GREECE",
      nights: "9 NIGHTS",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="explore-our-trip bg-gray-800 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-12">
          {/* Left side content */}
          <div className="flex-shrink-0 w-80">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wider">
              EXPLORE OUR TRIPS
            </h2>
            <p className="text-white/80 text-lg font-light italic leading-relaxed mb-12">
              Remarkable experiences to inspire the mind
            </p>
            
            {/* Decorative circular pattern */}
            <div className="opacity-30">
              <svg width="200" height="200" viewBox="0 0 200 200" className="text-white/20">
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r={20 + i * 10}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Right side - Trip cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trips.map((trip, index) => (
                <div
                  key={index}
                  className="relative h-80 bg-gray-900 overflow-hidden group cursor-pointer"
                >
                  {/* Trip duration badge */}
                  <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 text-white text-xs font-medium tracking-wider">
                    {trip.nights}
                  </div>

                  {/* Background image */}
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-sm font-semibold mb-1 tracking-wide leading-tight">
                      {trip.title}
                    </h3>
                    <h4 className="text-sm font-light mb-4 leading-tight">
                      {trip.subtitle}
                    </h4>

                    <button className="border border-white/50 px-4 py-2 text-xs font-medium tracking-wider hover:bg-white/10 transition-all duration-300 w-full">
                      EXPLORE TRIP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreOurTrips; 