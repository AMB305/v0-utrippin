import React from 'react';

export const BeachTravelCards: React.FC = () => {
  const destinations = [
    { title: "Waikiki Beach", location: "Honolulu, Hawaii", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "waikiki beach honolulu hawaii" },
    { title: "Maui", location: "Hawaii, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "maui hawaii beaches black sand" },
    { title: "Santa Monica", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "santa monica california pier beach" },
    { title: "Malibu", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "malibu beach california cliffs" },
    { title: "Clearwater", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "clearwater beach florida white sand" },
    { title: "Siesta Key", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "siesta key beach florida" },
    { title: "South Beach", location: "Miami, Florida", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "south beach miami art deco ocean" },
    { title: "Cannon Beach", location: "Oregon, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "cannon beach oregon haystack rock" },
    { title: "Myrtle Beach", location: "South Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "myrtle beach boardwalk ocean" },
    { title: "Cape Cod", location: "Massachusetts, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "cape cod beach massachusetts coast" },
    { title: "Outer Banks", location: "North Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "outer banks north carolina beach" },
    { title: "Laguna Beach", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "laguna beach california coves" },
    { title: "Coronado", location: "San Diego, California", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "coronado beach san diego california" },
    { title: "Destin", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "destin florida emerald coast beach" },
    { title: "Hamptons", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "hamptons new york beach luxury" },
    { title: "Naples", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "naples florida beach sunset" },
    { title: "Tulum", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "tulum mexico beach ruins" },
    { title: "Playa del Carmen", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "playa del carmen mexico beach" },
    { title: "Cancún", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "cancun resort beach mexico" },
    { title: "Bahamas", location: "Bahamas", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "bahamas beach pink sand" },
    { title: "Turks and Caicos", location: "Turks and Caicos", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "turks and caicos beach crystal water" },
    { title: "St. Barts", location: "Caribbean", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "st barts caribbean beach luxury" },
    { title: "Bora Bora", location: "French Polynesia", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "bora bora overwater bungalows beach" },
    { title: "Maldives", location: "Maldives", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "maldives island beach turquoise water" },
    { title: "Seychelles", location: "Seychelles", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "seychelles granite beach boulders" },
    { title: "Bali", location: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop", query: "bali indonesia beach sunset" },
    { title: "Phuket", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "phuket thailand beach island" },
    { title: "Krabi", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "krabi thailand railay beach cliffs" },
    { title: "El Nido", location: "Palawan, Philippines", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "el nido philippines lagoons beach" },
    { title: "Boracay", location: "Philippines", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "boracay philippines white beach" },
    { title: "Copacabana", location: "Rio de Janeiro, Brazil", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "copacabana beach rio brazil" },
    { title: "Ipanema", location: "Rio de Janeiro, Brazil", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "ipanema beach rio de janeiro" },
    { title: "Byron Bay", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "byron bay australia beach surfers" },
    { title: "Bondi Beach", location: "Sydney, Australia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "bondi beach sydney australia" },
    { title: "Zanzibar", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "zanzibar tanzania white sand beach" },
    { title: "Cape Town", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "cape town clifton beach south africa" },
    { title: "Amalfi Coast", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "amalfi coast italy beach cliff" },
    { title: "Cinque Terre", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "cinque terre beach italy village" },
    { title: "Nice", location: "French Riviera, France", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", query: "nice france beach french riviera" },
    { title: "Barcelona", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "barcelona beach spain" },
    { title: "Ibiza", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "ibiza spain party beach" },
    { title: "Santorini", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop", query: "santorini greece beach caldera view" },
    { title: "Mykonos", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop", query: "mykonos greece beach party vibes" },
    { title: "Dubrovnik", location: "Croatia", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "dubrovnik beach croatia adriatic" },
    { title: "Split", location: "Croatia", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "split croatia beach europe summer" },
    { title: "Palawan", location: "Philippines", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "palawan philippines tropical beach" },
    { title: "Hvar", location: "Croatia", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "hvar croatia beach crystal clear" },
    { title: "Gold Coast", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "gold coast australia surfing beach" },
    { title: "Tahiti", location: "French Polynesia", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "tahiti french polynesia island beach" },
    { title: "Key West", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "key west florida beach sunset pier" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop`;
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
