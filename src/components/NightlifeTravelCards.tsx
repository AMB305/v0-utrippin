import React from 'react';

export const NightlifeTravelCards = () => {
  const destinations = [
    { title: "Ibiza", location: "Spain", query: "ibiza spain nightlife clubs beach party" },
    { title: "Berlin", location: "Germany", query: "berlin germany nightlife berghain techno" },
    { title: "Bangkok", location: "Thailand", query: "bangkok thailand street party khao san road" },
    { title: "Las Vegas", location: "Nevada, USA", query: "las vegas strip nightclubs neon lights" },
    { title: "Miami", location: "Florida, USA", query: "miami florida nightlife wynwood beach bars" },
    { title: "Rio de Janeiro", location: "Brazil", query: "rio brazil lapa samba night party" },
    { title: "Amsterdam", location: "Netherlands", query: "amsterdam netherlands red light nightlife" },
    { title: "New York City", location: "New York, USA", query: "new york nightlife house of yes le bain" },
    { title: "Prague", location: "Czech Republic", query: "prague czech republic nightlife old town" },
    { title: "London", location: "United Kingdom", query: "london nightlife soho ministry of sound" },
    { title: "Tel Aviv", location: "Israel", query: "tel aviv israel nightlife beach party" },
    { title: "Mykonos", location: "Greece", query: "mykonos greece cavo paradiso beach club" },
    { title: "Paris", location: "France", query: "paris france clubs rooftop nightlife" },
    { title: "Seoul", location: "South Korea", query: "seoul korea gangnam octagon club" },
    { title: "Tokyo", location: "Japan", query: "tokyo japan nightlife roppongi shibuya" },
    { title: "Los Angeles", location: "California, USA", query: "los angeles hollywood nightlife sunset" },
    { title: "Medellín", location: "Colombia", query: "medellin colombia parque lleras clubs" },
    { title: "Tulum", location: "Mexico", query: "tulum mexico jungle rave party beach" },
    { title: "Barcelona", location: "Spain", query: "barcelona razzmatazz spain nightlife" },
    { title: "Belgrade", location: "Serbia", query: "belgrade serbia nightlife floating clubs" },
    { title: "Cape Town", location: "South Africa", query: "cape town south africa long street" },
    { title: "São Paulo", location: "Brazil", query: "sao paulo brazil d-edge techno club" },
    { title: "Buenos Aires", location: "Argentina", query: "buenos aires argentina nightlife palermo" },
    { title: "Montreal", location: "Canada", query: "montreal canada crescent street nightlife" },
    { title: "Bali", location: "Indonesia", query: "bali indonesia nightlife beach club" },
    { title: "Ho Chi Minh City", location: "Vietnam", query: "ho chi minh vietnam nightlife bui vien" },
    { title: "Copenhagen", location: "Denmark", query: "copenhagen denmark culture box" },
    { title: "Beirut", location: "Lebanon", query: "beirut lebanon nightlife bo18 the garten" },
    { title: "Krakow", location: "Poland", query: "krakow poland nightlife jewish quarter" },
    { title: "Dubai", location: "UAE", query: "dubai nightlife white soho garden" },
    { title: "Cancun", location: "Mexico", query: "cancun mexico nightlife coco bongo" },
    { title: "San Juan", location: "Puerto Rico", query: "san juan puerto rico la placita" },
    { title: "Pattaya", location: "Thailand", query: "pattaya thailand nightlife walking street" },
    { title: "Istanbul", location: "Turkey", query: "istanbul turkey nightlife bosphorus clubs" },
    { title: "Manila", location: "Philippines", query: "manila philippines nightlife bgc xylo" },
    { title: "Kyiv", location: "Ukraine", query: "kyiv ukraine nightlife closer club" },
    { title: "Moscow", location: "Russia", query: "moscow russia nightlife gipsy club" },
    { title: "Auckland", location: "New Zealand", query: "auckland new zealand nightlife ponsonby" },
    { title: "Nairobi", location: "Kenya", query: "nairobi kenya nightlife b club westlands" },
    { title: "Budapest", location: "Hungary", query: "budapest ruin bars nightlife szimpla kert" }
  ];

  const getImageUrl = (title: string, query: string) => {
    const nightlifeImages = {
      'Ibiza': 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop',
      'Berlin': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
      'Bangkok': 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=400&h=300&fit=crop',
      'Las Vegas': 'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=400&h=300&fit=crop',
      'Miami': 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=400&h=300&fit=crop',
      'Rio de Janeiro': 'https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88?w=400&h=300&fit=crop',
      'Amsterdam': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
      'New York City': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&h=300&fit=crop',
      'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop'
    };
    return nightlifeImages[title as keyof typeof nightlifeImages] || 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop';
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
                  e.currentTarget.src = `https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop`;
                }}
              />
              {/* Strong dark overlay for text visibility */}
              <div className="absolute inset-0 bg-black/60"></div>
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