import React from 'react';

export const SoloTravelCards = () => {
  const destinations = [
    { title: "Lisbon", location: "Portugal", query: "lisbon portugal solo travel digital nomad safe" },
    { title: "Chiang Mai", location: "Thailand", query: "chiang mai thailand budget solo traveler" },
    { title: "Barcelona", location: "Spain", query: "barcelona spain walkable solo traveler" },
    { title: "Bali", location: "Indonesia", query: "bali indonesia solo yoga beach community" },
    { title: "Tulum", location: "Mexico", query: "tulum mexico solo travel beach digital nomad" },
    { title: "Prague", location: "Czech Republic", query: "prague czech republic solo travel historic city" },
    { title: "Mexico City", location: "Mexico", query: "mexico city solo traveler safe food tour" },
    { title: "Tokyo", location: "Japan", query: "tokyo japan solo culture technology safe" },
    { title: "Amsterdam", location: "Netherlands", query: "amsterdam netherlands solo canals walkable" },
    { title: "Cape Town", location: "South Africa", query: "cape town south africa solo hiking beach" },
    { title: "Reykjavik", location: "Iceland", query: "reykjavik iceland solo travel northern lights" },
    { title: "Medellín", location: "Colombia", query: "medellin colombia solo nomad community metro" },
    { title: "Budapest", location: "Hungary", query: "budapest hungary solo thermal baths nightlife" },
    { title: "Seoul", location: "South Korea", query: "seoul south korea solo cafes walkable nightlife" },
    { title: "Hanoi", location: "Vietnam", query: "hanoi vietnam backpacking solo affordable" },
    { title: "Athens", location: "Greece", query: "athens greece solo ruins mythology safe" },
    { title: "Dubrovnik", location: "Croatia", query: "dubrovnik croatia old town solo coastal walk" },
    { title: "Buenos Aires", location: "Argentina", query: "buenos aires argentina tango solo city life" },
    { title: "Lima", location: "Peru", query: "lima peru solo surfing culture nomad" },
    { title: "Taipei", location: "Taiwan", query: "taipei taiwan solo night market metro" },
    { title: "New Orleans", location: "Louisiana, USA", query: "new orleans jazz solo safe music food" },
    { title: "Istanbul", location: "Turkey", query: "istanbul turkey solo mosques bazaar ferry" },
    { title: "Ho Chi Minh City", location: "Vietnam", query: "ho chi minh vietnam solo street food scooter" },
    { title: "Kuala Lumpur", location: "Malaysia", query: "kuala lumpur malaysia solo friendly expats" },
    { title: "Vancouver", location: "Canada", query: "vancouver canada solo outdoor safe" },
    { title: "Berlin", location: "Germany", query: "berlin germany solo culture museums nightlife" },
    { title: "Warsaw", location: "Poland", query: "warsaw poland solo travel modern safe" },
    { title: "Sydney", location: "Australia", query: "sydney australia solo beach opera house" },
    { title: "Vienna", location: "Austria", query: "vienna austria classical music solo cafe" },
    { title: "Canggu", location: "Bali, Indonesia", query: "canggu bali solo nomad surf cafes coworking" },
    { title: "San Francisco", location: "California, USA", query: "san francisco solo golden gate friendly" },
    { title: "Tallinn", location: "Estonia", query: "tallinn estonia solo digital nomad old town" },
    { title: "Ljubljana", location: "Slovenia", query: "ljubljana slovenia solo clean green safe" },
    { title: "Porto", location: "Portugal", query: "porto portugal solo wine river solo friendly" },
    { title: "Ubud", location: "Bali, Indonesia", query: "ubud bali solo jungle yoga meditation" },
    { title: "Bangkok", location: "Thailand", query: "bangkok thailand solo food temples nightlife" },
    { title: "Copenhagen", location: "Denmark", query: "copenhagen denmark safe bike friendly solo" },
    { title: "Osaka", location: "Japan", query: "osaka japan solo street food city energy" },
    { title: "Tirana", location: "Albania", query: "tirana albania solo underrated affordable safe" },
    { title: "Santiago", location: "Chile", query: "santiago chile solo hiking cultural modern" }
  ];

  const getImageUrl = (title: string, query: string) => {
    const soloImages = {
      'Lisbon': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
      'Chiang Mai': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'Barcelona': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      'Tulum': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop',
      'Mexico City': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop',
      'Tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&fit=crop',
      'Amsterdam': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
      'Cape Town': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop'
    };
    return soloImages[title as keyof typeof soloImages] || 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop';
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
                  e.currentTarget.src = `https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop`;
                }}
              />
              {/* Strong dark overlay for text visibility */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            
            {/* Text Overlay */}
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