import React from 'react';

export const CultureTravelCards: React.FC = () => {
  const destinations = [
    { title: "Kyoto", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "kyoto geisha temples japan culture" },
    { title: "Istanbul", location: "Turkey", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop", query: "istanbul architecture mosques bazaars" },
    { title: "Varanasi", location: "India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", query: "varanasi india culture rituals" },
    { title: "Fez", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", query: "fez morocco souks medina culture" },
    { title: "Mexico City", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "mexico city historic center culture" },
    { title: "Rome", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", query: "rome colosseum culture italy" },
    { title: "Athens", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop", query: "athens greece ruins culture" },
    { title: "Cusco", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", query: "cusco peru inca culture" },
    { title: "Havana", location: "Cuba", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "havana cuba streets culture" },
    { title: "Bhaktapur", location: "Nepal", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", query: "bhaktapur nepal temples culture" },
    { title: "Jerusalem", location: "Israel", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", query: "jerusalem culture holy sites" },
    { title: "Hoi An", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "hoi an vietnam lanterns culture" },
    { title: "Marrakech", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", query: "marrakech souk morocco culture" },
    { title: "Lhasa", location: "Tibet", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", query: "lhasa tibet monasteries culture" },
    { title: "Cairo", location: "Egypt", imageUrl: "https://images.unsplash.com/photo-1575562863675-b43b5b8e5a55?w=400&h=300&fit=crop", query: "cairo pyramids egyptian culture" },
    { title: "Luang Prabang", location: "Laos", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "luang prabang temples monks" },
    { title: "Tbilisi", location: "Georgia", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "tbilisi georgia old town culture" },
    { title: "Chiang Mai", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "chiang mai temples culture thailand" },
    { title: "Ubud", location: "Bali, Indonesia", imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop", query: "ubud bali traditional dance culture" },
    { title: "Samarkand", location: "Uzbekistan", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop", query: "samarkand uzbekistan silk road" },
    { title: "Buenos Aires", location: "Argentina", imageUrl: "https://images.unsplash.com/photo-1589909202802-8f960c1b9f2e?w=400&h=300&fit=crop", query: "buenos aires tango argentina culture" },
    { title: "Tehran", location: "Iran", imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop", query: "tehran iran bazaars museums" },
    { title: "Delhi", location: "India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", query: "delhi india street culture heritage" },
    { title: "Lima", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", query: "lima peru colonial architecture culture" },
    { title: "Paris", location: "France", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", query: "paris france museums architecture" },
    { title: "Berlin", location: "Germany", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "berlin germany street art culture" },
    { title: "Lisbon", location: "Portugal", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "lisbon portugal fado tiles culture" },
    { title: "Barcelona", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "barcelona gaudi culture architecture" },
    { title: "Iquitos", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "iquitos peru amazon tribal culture" },
    { title: "Jaipur", location: "Rajasthan, India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", query: "jaipur pink city rajasthan culture" },
    { title: "Tunis", location: "Tunisia", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", query: "tunis medina culture unesco" },
    { title: "Florence", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", query: "florence italy renaissance culture" },
    { title: "Zanzibar", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "zanzibar tanzania swahili culture" },
    { title: "Bagan", location: "Myanmar", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "bagan myanmar temples culture" },
    { title: "Cartagena", location: "Colombia", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "cartagena colombia old town culture" },
    { title: "Yogyakarta", location: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop", query: "yogyakarta indonesia batik culture" },
    { title: "Antigua", location: "Guatemala", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "antigua guatemala colonial culture" },
    { title: "Santiago de Compostela", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "santiago cathedral galicia culture" },
    { title: "Quito", location: "Ecuador", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "quito ecuador historic center culture" },
    { title: "Alexandria", location: "Egypt", imageUrl: "https://images.unsplash.com/photo-1575562863675-b43b5b8e5a55?w=400&h=300&fit=crop", query: "alexandria egypt library heritage" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop`;
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