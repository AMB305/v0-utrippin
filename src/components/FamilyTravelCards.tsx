import React from 'react';

export const FamilyTravelCards: React.FC = () => {
  const destinations = [
    { title: "Orlando", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1594736797933-d0bc5e904d35?w=400&h=300&fit=crop", query: "orlando disney world universal studios" },
    { title: "San Diego", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "san diego zoo beach family" },
    { title: "Yellowstone", location: "Wyoming, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "yellowstone geysers wildlife family" },
    { title: "Washington DC", location: "Washington, USA", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", query: "washington dc museums family friendly" },
    { title: "London", location: "England", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop", query: "london family museums parks" },
    { title: "Tokyo Disneyland", location: "Tokyo, Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "tokyo disneyland theme park family" },
    { title: "Paris", location: "France", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", query: "paris france kids family travel" },
    { title: "New York City", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop", query: "new york city central park family" },
    { title: "Grand Canyon", location: "Arizona, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "grand canyon family hiking views" },
    { title: "Anaheim", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1594736797933-d0bc5e904d35?w=400&h=300&fit=crop", query: "anaheim disneyland california family" },
    { title: "Copenhagen", location: "Denmark", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "copenhagen tivoli gardens kids family" },
    { title: "Chicago", location: "Illinois, USA", imageUrl: "https://images.unsplash.com/photo-1494522358652-f30e61a5ad5f?w=400&h=300&fit=crop", query: "chicago museums navy pier family" },
    { title: "Sydney", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "sydney zoo aquarium harbor family" },
    { title: "Rome", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", query: "rome colosseum pizza family fun" },
    { title: "Barcelona", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "barcelona park guell beach family" },
    { title: "Dubai", location: "UAE", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "dubai indoor ski waterparks family" },
    { title: "Los Angeles", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "los angeles griffith park beaches family" },
    { title: "San Francisco", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "san francisco cable cars aquarium" },
    { title: "Singapore", location: "Singapore", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "singapore gardens family kid zoo" },
    { title: "Cape Town", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "cape town beach penguins family" },
    { title: "Toronto", location: "Ontario, Canada", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "toronto science centre aquarium family" },
    { title: "Vancouver", location: "British Columbia, Canada", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "vancouver stanley park outdoor family" },
    { title: "Lisbon", location: "Portugal", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "lisbon portugal oceanarium family" },
    { title: "Costa Rica", location: "Costa Rica", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "costa rica wildlife jungle family" },
    { title: "Lake Tahoe", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "lake tahoe california summer family" },
    { title: "Atlanta", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "atlanta aquarium family friendly" },
    { title: "Niagara Falls", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "niagara falls boat family adventure" },
    { title: "Seattle", location: "Washington, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "seattle space needle family museums" },
    { title: "Punta Cana", location: "Dominican Republic", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "punta cana resorts family beach" },
    { title: "Boston", location: "Massachusetts, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "boston freedom trail family history" },
    { title: "Dubai Parks", location: "UAE", imageUrl: "https://images.unsplash.com/photo-1594736797933-d0bc5e904d35?w=400&h=300&fit=crop", query: "dubai legoland motiongate family fun" },
    { title: "Bali", location: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop", query: "bali monkey forest beach family" },
    { title: "Iceland", location: "Iceland", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "iceland waterfalls lagoons family" },
    { title: "Amsterdam", location: "Netherlands", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "amsterdam canals family bikes zoo" },
    { title: "San Antonio", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "san antonio river walk family" },
    { title: "Myrtle Beach", location: "South Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "myrtle beach amusement park family" },
    { title: "Tampa", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1594736797933-d0bc5e904d35?w=400&h=300&fit=crop", query: "tampa florida family zoo aquariums" },
    { title: "Houston", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1494522358652-f30e61a5ad5f?w=400&h=300&fit=crop", query: "houston science museum kids" },
    { title: "Oranjestad", location: "Aruba", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "aruba family friendly beaches" },
    { title: "Athens", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop", query: "athens greece ruins for kids" },
    { title: "Phuket", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "phuket thailand family beaches" },
    { title: "Mexico City", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "mexico city museums kids friendly" },
    { title: "Dublin", location: "Ireland", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "dublin ireland family walking tours" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map(({ title, location, imageUrl, query }, i) => (
        <div
          key={i}
          className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1594736797933-d0bc5e904d35?w=400&h=300&fit=crop`;
              }}
            />
            {/* Strong dark overlay for text visibility */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Text Overlay - BRIGHT WHITE TEXT */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
            <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
              {title}
            </h3>
            <p className="text-white text-sm font-medium tracking-[0.2em] uppercase opacity-95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};