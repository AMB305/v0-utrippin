import React from 'react';

const ExploreOurTrips: React.FC = () => {
  const trips = [
    {
      id: 1,
      title: "SELOUS TO ZANZIBAR: ESCAPE THE CROWDS IN TANZANIA",
      nights: "8 NIGHTS",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "HIGHLAND LUXURY: CLASSIC INDULGENCE",
      nights: "5 NIGHTS", 
      image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Wild Waterways of the Amazon",
      nights: "9 NIGHTS",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Art Deco Days & Neon Nights",
      nights: "5 NIGHTS",
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-8 bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 tracking-wider">EXPLORE OUR TRIPS</h2>
            <p className="text-lg text-gray-300 italic">
              Remarkable experiences to inspire the mind
            </p>
          </div>
          
          <div className="space-y-6">
            {trips.slice(0, 2).map((trip, index) => (
              <div key={trip.id} className="relative h-96 rounded-lg overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${trip.image}')` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm font-medium">
                  {trip.nights}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
                    {trip.title}
                  </h3>
                  <button className="border-2 border-white text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-white hover:text-black transition-colors">
                    EXPLORE TRIP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex-shrink-0 w-1/3">
            <h2 className="text-5xl font-bold mb-6">EXPLORE<br/>OUR TRIPS</h2>
            <p className="text-xl text-gray-300 mb-8">
              Remarkable experiences to inspire the mind
            </p>
          </div>
          
          <div className="flex-1 flex gap-6 overflow-x-auto">
            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop" 
                  alt="Wild Waterways of the Amazon" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">9 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Wild Waterways of the Amazon</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Jungle canopies, pink dolphins & riverboat sunsets</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop" 
                  alt="Art Deco Days & Neon Nights" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">5 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Art Deco Days & Neon Nights</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Beach mornings, Wynwood murals & Cuban cafecitos</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop" 
                  alt="Cultural Expedition" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">7 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Cultural Expedition</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Ancient temples, local markets & authentic cuisine</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop" 
                  alt="Wildlife Safari" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">6 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Wildlife Safari Adventure</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Majestic wildlife encounters in pristine natural habitats</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=400&h=300&fit=crop" 
                  alt="Whale Watching" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">4 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Ocean Whale Watching</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Spectacular marine life & breathtaking ocean views</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=300&fit=crop" 
                  alt="Desert Expedition" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">8 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Desert Caravan Experience</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Endless dunes, starlit nights & nomadic traditions</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=400&h=300&fit=crop" 
                  alt="Antarctic Adventure" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">12 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Antarctic Expedition</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Pristine icebergs, penguins & polar wilderness</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=400&h=300&fit=crop" 
                  alt="Mountain Expedition" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">10 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>High Altitude Adventure</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Peak climbing, alpine landscapes & mountain culture</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=300&fit=crop" 
                  alt="Jungle Discovery" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">7 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Jungle Discovery Tour</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Exotic wildlife, canopy walks & indigenous cultures</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-80 bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=400&h=300&fit=crop" 
                  alt="Island Adventure" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-sm">5 NIGHTS</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 !text-white" style={{ color: 'white !important' }}>Dragon Islands Explorer</h3>
                <p className="text-gray-300 mb-4 !text-gray-300" style={{ color: '#d1d5db !important' }}>Ancient reptiles, coral reefs & volcanic landscapes</p>
                <button className="border border-white text-white px-6 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  EXPLORE TRIP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreOurTrips;