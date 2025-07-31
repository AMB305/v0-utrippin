import React from 'react';

export const HiddenGemTravelCards: React.FC = () => {
  const destinations = [
    { title: "Civita di Bagnoregio", location: "Lazio, Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "civita di bagnoregio italy hidden gem village" },
    { title: "Tobermory", location: "Ontario, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "tobermory canada bruce peninsula shipwrecks" },
    { title: "Lake Bled", location: "Slovenia", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "lake bled slovenia castle island" },
    { title: "Kotor", location: "Montenegro", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "kotor montenegro bay medieval town" },
    { title: "Chefchaouen", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", query: "chefchaouen morocco blue city" },
    { title: "Aït Benhaddou", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "ait benhaddou morocco desert kasbah" },
    { title: "Giethoorn", location: "Netherlands", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "giethoorn netherlands village canals" },
    { title: "Hallstatt", location: "Austria", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "hallstatt austria alpine village" },
    { title: "Gjirokastër", location: "Albania", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "gjirokaster albania stone houses unesco" },
    { title: "Tinos", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop", query: "tinos greece island village" },
    { title: "Isle of Skye", location: "Scotland", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "isle of skye scotland dramatic cliffs" },
    { title: "Faroe Islands", location: "Denmark", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "faroe islands cliffs village grass roofs" },
    { title: "Lofoten Islands", location: "Norway", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "lofoten islands norway hidden fjord fishing village" },
    { title: "Plitvice Lakes", location: "Croatia", imageUrl: "https://images.unsplash.com/photo-1586276393635-5ecd8112877e?w=400&h=300&fit=crop", query: "plitvice lakes croatia waterfalls forest" },
    { title: "Valle de Cocora", location: "Colombia", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "valle de cocora colombia wax palm forest" },
    { title: "Iceland East Fjords", location: "Iceland", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "iceland east fjords wildlife mountains" },
    { title: "Sibiu", location: "Romania", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "sibiu romania old town hidden" },
    { title: "Leavenworth", location: "Washington, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "leavenworth washington bavarian village" },
    { title: "Great Sand Dunes", location: "Colorado, USA", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "great sand dunes national park colorado" },
    { title: "Door County", location: "Wisconsin, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "door county wisconsin hidden beaches" },
    { title: "Marfa", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "marfa texas art desert lights" },
    { title: "Cambria", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "cambria california coastal hidden town" },
    { title: "Driftless Region", location: "Wisconsin, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "driftless region wisconsin hills" },
    { title: "Blowing Rock", location: "North Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "blowing rock north carolina mountain town" },
    { title: "Little Switzerland", location: "North Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "little switzerland north carolina scenic drive" },
    { title: "Paia", location: "Maui, Hawaii", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "paia hawaii hidden beach town" },
    { title: "Crested Butte", location: "Colorado, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "crested butte colorado wildflowers" },
    { title: "Makanda", location: "Illinois, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "makanda illinois shawnee forest" },
    { title: "Sedbergh", location: "England", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop", query: "sedbergh england quiet countryside" },
    { title: "Salento", location: "Colombia", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "salento colombia town cocora valley" },
    { title: "Huacachina", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "huacachina peru desert oasis" },
    { title: "Matera", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "matera italy cave dwellings" },
    { title: "Tarn Canyon", location: "France", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "tarn canyon france hidden nature" },
    { title: "Wai'anapanapa", location: "Maui, Hawaii", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "waianapanapa black sand beach maui" },
    { title: "Joshua Tree Pioneertown", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "pioneertown joshua tree hidden desert" },
    { title: "El Nido", location: "Palawan, Philippines", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "el nido philippines lagoons paradise" },
    { title: "Tsumago", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "tsumago japan preserved village" },
    { title: "Fogo Island", location: "Newfoundland, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "fogo island newfoundland remote retreat" },
    { title: "Wengen", location: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "wengen switzerland mountain town" },
    { title: "North Cascades", location: "Washington, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "north cascades national park washington hidden gem" },
    { title: "Molokai", location: "Hawaii, USA", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "molokai hawaii quiet beach island" },
    { title: "Trinidad", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "trinidad california secret coastal town" },
    { title: "Silverton", location: "Colorado, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "silverton colorado remote town" },
    { title: "Letchworth", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "letchworth state park new york waterfalls" },
    { title: "Guatapé", location: "Colombia", imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop", query: "guatape colombia colorful town rock" },
    { title: "Appledore Island", location: "Maine, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "appledore island maine remote ocean" },
    { title: "Karijini", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "karijini national park australia hidden outback" },
    { title: "Colmar", location: "France", imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", query: "colmar france fairytale hidden town" },
    { title: "Terlingua", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "terlingua ghost town texas" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop`;
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