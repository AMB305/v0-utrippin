import React from 'react';

export const FamilyTravelCards: React.FC = () => {
  const destinations = [
    { title: "Orlando", location: "Florida, USA", query: "orlando florida disney world universal studios family travel" },
    { title: "San Diego", location: "California, USA", query: "san diego california zoo beaches family trip" },
    { title: "Tokyo", location: "Japan", query: "tokyo japan disney sea kid friendly attractions" },
    { title: "Copenhagen", location: "Denmark", query: "copenhagen denmark tivoli gardens family travel" },
    { title: "Dubai", location: "UAE", query: "dubai family attractions aquaventure legoland safari" },
    { title: "Paris", location: "France", query: "paris france disneyland paris kids travel" },
    { title: "Singapore", location: "Singapore", query: "singapore sentosa universal studios kid friendly" },
    { title: "Los Angeles", location: "California, USA", query: "los angeles california universal hollywood science center" },
    { title: "London", location: "United Kingdom", query: "london uk kid museums harry potter world" },
    { title: "Washington DC", location: "USA", query: "washington dc smithsonian zoo family travel" },
    { title: "Barcelona", location: "Spain", query: "barcelona spain aquarium beach kid friendly" },
    { title: "Anaheim", location: "California, USA", query: "anaheim california disneyland family vacation" },
    { title: "Toronto", location: "Canada", query: "toronto canada zoo ripley's aquarium science centre" },
    { title: "Amsterdam", location: "Netherlands", query: "amsterdam netherlands science museum kids canal tour" },
    { title: "Chicago", location: "Illinois, USA", query: "chicago illinois shedd aquarium navy pier kids museum" },
    { title: "Rome", location: "Italy", query: "rome italy family travel gelato colosseum" },
    { title: "Hong Kong", location: "Hong Kong", query: "hong kong disneyland ocean park kids attractions" },
    { title: "Cape Town", location: "South Africa", query: "cape town south africa penguins family safari" },
    { title: "Bangkok", location: "Thailand", query: "bangkok thailand kid friendly activities safari world" },
    { title: "New York City", location: "New York, USA", query: "new york central park museums family trip" },
    { title: "Vancouver", location: "Canada", query: "vancouver canada aquarium science museum family" },
    { title: "Reykjavik", location: "Iceland", query: "reykjavik iceland northern lights family nature" },
    { title: "Sydney", location: "Australia", query: "sydney australia taronga zoo beaches kids" },
    { title: "Munich", location: "Germany", query: "munich germany english garden kid friendly attractions" },
    { title: "Athens", location: "Greece", query: "athens greece myths museums family adventure" },
    { title: "San Antonio", location: "Texas, USA", query: "san antonio texas sea world riverwalk family fun" },
    { title: "Lisbon", location: "Portugal", query: "lisbon portugal oceanarium trams family adventure" },
    { title: "Bali", location: "Indonesia", query: "bali indonesia waterparks monkeys beaches family" },
    { title: "Prague", location: "Czech Republic", query: "prague czech republic castle zoo kids travel" },
    { title: "Mexico City", location: "Mexico", query: "mexico city papalote museo del nino family" },
    { title: "Kuala Lumpur", location: "Malaysia", query: "kuala lumpur malaysia aquaria petrosains kids" },
    { title: "Gold Coast", location: "Australia", query: "gold coast australia theme parks surfers paradise" },
    { title: "Honolulu", location: "Hawaii, USA", query: "honolulu hawaii beaches kids snorkeling" },
    { title: "Helsinki", location: "Finland", query: "helsinki finland family sauna parks winter" },
    { title: "Doha", location: "Qatar", query: "doha qatar desert zoo family vacation" },
    { title: "Osaka", location: "Japan", query: "osaka japan universal studios aquarium family" },
    { title: "Istanbul", location: "Turkey", query: "istanbul turkey kid friendly history museums" },
    { title: "Wellington", location: "New Zealand", query: "wellington new zealand wildlife family hiking" },
    { title: "Seoul", location: "South Korea", query: "seoul korea kid cafes amusement parks science museum" },
    { title: "Rotorua", location: "New Zealand", query: "rotorua new zealand mud pools family adventure" }
  ];

  const getImageUrl = (title: string, query: string) => {
    const familyImages = {
      'Orlando': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'San Diego': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      'Tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&fit=crop',
      'Copenhagen': 'https://images.unsplash.com/photo-1513622470522-26e89109c35a?w=400&h=300&fit=crop',
      'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
      'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
      'Los Angeles': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
      'London': 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=300&fit=crop',
      'Washington DC': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop'
    };
    return familyImages[title as keyof typeof familyImages] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map(({ title, location, query }, i) => {
        const imageUrl = getImageUrl(title, query);
        
        return (
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
        );
      })}
    </div>
  );
};
