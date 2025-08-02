import React from 'react';

export const RomanticTravelCards: React.FC = () => {
  const destinations = [
    { title: "Paris", location: "France", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", query: "paris romantic eiffel tower couple" },
    { title: "Santorini", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop", query: "santorini greece romantic sunset" },
    { title: "Venice", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&h=300&fit=crop", query: "venice gondola romantic italy" },
    { title: "Maui", location: "Hawaii, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "maui hawaii romantic beach sunset" },
    { title: "Charleston", location: "South Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "charleston south carolina historic romantic" },
    { title: "Savannah", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "savannah georgia oak trees romance" },
    { title: "Big Sur", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "big sur california coastline romance" },
    { title: "Amalfi Coast", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "amalfi coast italy romantic cliffside" },
    { title: "Bali", location: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop", query: "bali couple sunset rice terrace" },
    { title: "New York City", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop", query: "new york city skyline romance" },
    { title: "Napa Valley", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "napa valley vineyard couple" },
    { title: "Tulum", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "tulum beach mexico romantic escape" },
    { title: "Kyoto", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "kyoto cherry blossoms romantic japan" },
    { title: "Positano", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "positano italy romantic seaside" },
    { title: "Lake Como", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "lake como italy couple boat" },
    { title: "Banff", location: "Alberta, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "banff lake louise couple canoe" },
    { title: "Aspen", location: "Colorado, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "aspen colorado romantic snowy getaway" },
    { title: "Sedona", location: "Arizona, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "sedona arizona red rocks couple" },
    { title: "Vienna", location: "Austria", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "vienna architecture romance europe" },
    { title: "Quebec City", location: "Quebec, Canada", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "quebec city winter romantic street" },
    { title: "Lake Tahoe", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "lake tahoe romantic nature" },
    { title: "Tuscany", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "tuscany italy vineyard couple" },
    { title: "Prague", location: "Czech Republic", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "prague romantic cobblestone bridge" },
    { title: "Carmel-by-the-Sea", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "carmel california romantic coast" },
    { title: "Barcelona", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "barcelona spain romantic couple" },
    { title: "Maldives", location: "Maldives", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "maldives overwater bungalow romantic" },
    { title: "Hallstatt", location: "Austria", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "hallstatt austria fairytale romance" },
    { title: "Blue Ridge Parkway", location: "Virginia, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "blue ridge parkway scenic fall romantic" },
    { title: "Bar Harbor", location: "Maine, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "bar harbor maine seaside romance" },
    { title: "Rome", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", query: "rome romantic fountain historic" },
    { title: "Cinque Terre", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "cinque terre romantic italian coast" },
    { title: "Monterey", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "monterey california coastal romance" },
    { title: "London", location: "England", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop", query: "london night river thames couple" },
    { title: "Buenos Aires", location: "Argentina", imageUrl: "https://images.unsplash.com/photo-1589909202802-8f960c1b9f2e?w=400&h=300&fit=crop", query: "buenos aires tango romantic city" },
    { title: "Montreal", location: "Quebec, Canada", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "montreal old town winter couple" },
    { title: "Niagara Falls", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "niagara falls romantic mist couple" },
    { title: "Zermatt", location: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "zermatt switzerland snowy romance" },
    { title: "Palm Springs", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "palm springs desert getaway couple" },
    { title: "Healdsburg", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "healdsburg sonoma romantic wine country" },
    { title: "St. Augustine", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "st augustine florida romantic historic" },
    { title: "Udaipur", location: "Rajasthan, India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", query: "udaipur india lake palace romance" },
    { title: "Bruges", location: "Belgium", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "bruges belgium canal couple" },
    { title: "Paris, Texas", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "paris texas small town charm" },
    { title: "Seville", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "seville spain romantic streets" },
    { title: "Cotswolds", location: "England", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop", query: "cotswolds england countryside romantic" },
    { title: "Guanajuato", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "guanajuato mexico colorful romantic town" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop`;
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
