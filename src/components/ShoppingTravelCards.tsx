import React from 'react';

export const ShoppingTravelCards: React.FC = () => {
  const destinations = [
    { title: "New York City", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop", query: "new york city shopping soho 5th avenue" },
    { title: "Tokyo", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "tokyo shopping shibuya harajuku fashion" },
    { title: "Dubai", location: "UAE", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "dubai mall souk shopping luxury" },
    { title: "London", location: "England", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop", query: "london oxford street camden market" },
    { title: "Marrakech", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", query: "marrakech souks morocco traditional market" },
    { title: "Bangkok", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "bangkok thailand floating market shopping" },
    { title: "Los Angeles", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "los angeles rodeo drive fashion" },
    { title: "Paris", location: "France", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", query: "paris shopping champs elysees boutiques" },
    { title: "Seoul", location: "South Korea", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "seoul korea shopping myeongdong night market" },
    { title: "Istanbul", location: "Turkey", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop", query: "istanbul grand bazaar spices shopping" },
    { title: "Hong Kong", location: "Hong Kong", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "hong kong ladies market temple street" },
    { title: "Barcelona", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "barcelona shopping la rambla el born" },
    { title: "San Francisco", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "san francisco union square markets" },
    { title: "Mexico City", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "mexico city mercados traditional crafts" },
    { title: "Chicago", location: "Illinois, USA", imageUrl: "https://images.unsplash.com/photo-1494522358652-f30e61a5ad5f?w=400&h=300&fit=crop", query: "chicago magnificent mile shopping" },
    { title: "Florence", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", query: "florence italy leather markets" },
    { title: "Buenos Aires", location: "Argentina", imageUrl: "https://images.unsplash.com/photo-1589909202802-8f960c1b9f2e?w=400&h=300&fit=crop", query: "buenos aires san telmo antiques market" },
    { title: "Milan", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", query: "milan italy galleria fashion shopping" },
    { title: "Delhi", location: "India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", query: "delhi india shopping chandni chowk market" },
    { title: "Miami", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "miami shopping lincoln road beach boutiques" },
    { title: "Kuala Lumpur", location: "Malaysia", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "kuala lumpur petaling street shopping" },
    { title: "Shanghai", location: "China", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "shanghai china shopping nanjing road" },
    { title: "Beijing", location: "China", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "beijing silk market shopping china" },
    { title: "Lisbon", location: "Portugal", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "lisbon portugal shopping bairro alto" },
    { title: "Amsterdam", location: "Netherlands", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "amsterdam nine streets market shopping" },
    { title: "Singapore", location: "Singapore", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "singapore orchard road shopping" },
    { title: "Las Vegas", location: "Nevada, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "las vegas premium outlets shopping" },
    { title: "Cape Town", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "cape town south africa craft markets" },
    { title: "Istanbul Spice Bazaar", location: "Turkey", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop", query: "istanbul spice bazaar colors" },
    { title: "Melbourne", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "melbourne queen victoria market" },
    { title: "Lima", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", query: "lima peru markets crafts shopping" },
    { title: "Berlin", location: "Germany", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "berlin flea markets vintage shops" },
    { title: "Toronto", location: "Ontario, Canada", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "toronto kensington market canada shopping" },
    { title: "Philadelphia", location: "Pennsylvania, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "philadelphia reading terminal market" },
    { title: "Boston", location: "Massachusetts, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "boston quincy market shops usa" },
    { title: "San Diego", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "san diego seaport village shops" },
    { title: "Austin", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "austin texas street market shopping" },
    { title: "Madrid", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "madrid el rastro market shopping spain" },
    { title: "Prague", location: "Czech Republic", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "prague old town shopping local goods" },
    { title: "Cairo", location: "Egypt", imageUrl: "https://images.unsplash.com/photo-1575562863675-b43b5b8e5a55?w=400&h=300&fit=crop", query: "cairo khan el khalili market egypt" },
    { title: "Jerusalem", location: "Israel", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", query: "jerusalem old city market bazaar" },
    { title: "Athens", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop", query: "athens greece plaka market shopping" },
    { title: "Nashville", location: "Tennessee, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "nashville boutiques local makers" },
    { title: "Hanoi", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "hanoi vietnam night market street shopping" },
    { title: "Savannah", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "savannah city market georgia shops" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop`;
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