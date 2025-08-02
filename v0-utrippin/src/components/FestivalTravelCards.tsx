import React from 'react';

export const FestivalTravelCards: React.FC = () => {
  const destinations = [
    { title: "Carnival Rio", location: "Rio de Janeiro, Brazil", imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop", query: "carnival rio de janeiro parade costumes" },
    { title: "Holi India", location: "India", imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop", query: "holi festival india color celebration" },
    { title: "Oktoberfest", location: "Munich, Germany", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "oktoberfest munich beer festival" },
    { title: "Day of the Dead", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=300&fit=crop", query: "dia de los muertos mexico skulls" },
    { title: "La Tomatina", location: "Buñol, Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "la tomatina spain tomato fight" },
    { title: "Chinese New Year", location: "China", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "chinese new year lanterns dragon" },
    { title: "Songkran", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "songkran water festival thailand" },
    { title: "Diwali", location: "India", imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop", query: "diwali lights india celebration" },
    { title: "Burning Man", location: "Nevada, USA", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "burning man desert art fire" },
    { title: "Coachella", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", query: "coachella music festival california" },
    { title: "St. Patrick's Day", location: "Ireland", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "st patricks day ireland green parade" },
    { title: "Gion Matsuri", location: "Kyoto, Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "gion matsuri kyoto japan parade" },
    { title: "Cherry Blossom Festival", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "cherry blossom festival japan sakura" },
    { title: "Mardi Gras", location: "New Orleans, USA", imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop", query: "mardi gras new orleans beads float" },
    { title: "Inti Raymi", location: "Cusco, Peru", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", query: "inti raymi peru inca festival" },
    { title: "Yi Peng Lantern Festival", location: "Chiang Mai, Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "yi peng lantern festival thailand" },
    { title: "Edinburgh Fringe", location: "Edinburgh, Scotland", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "edinburgh fringe theatre festival" },
    { title: "Carnival Venice", location: "Venice, Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "carnival venice masks parade" },
    { title: "Glastonbury", location: "Somerset, UK", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", query: "glastonbury music festival uk" },
    { title: "Bastille Day", location: "Paris, France", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "bastille day paris fireworks" },
    { title: "Up Helly Aa", location: "Shetland, Scotland", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "up helly aa viking fire festival scotland" },
    { title: "Rath Yatra", location: "Puri, India", imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop", query: "rath yatra india chariot festival" },
    { title: "Pingxi Lantern Festival", location: "Taiwan", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "pingxi sky lantern festival taiwan" },
    { title: "Harbin Ice Festival", location: "Harbin, China", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", query: "harbin ice sculpture festival china" },
    { title: "Tet Vietnam", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "tet lunar new year vietnam" },
    { title: "Carnival Trinidad", location: "Port of Spain, Trinidad", imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop", query: "trinidad carnival costumes dance" },
    { title: "Feria de Abril", location: "Seville, Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "feria de abril seville spain" },
    { title: "Kumbh Mela", location: "India", imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop", query: "kumbh mela hindu festival india" },
    { title: "Sapporo Snow Festival", location: "Sapporo, Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "sapporo snow sculpture festival japan" },
    { title: "Sechseläuten", location: "Zurich, Switzerland", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "sechseläuten zurich burning snowman" },
    { title: "Loi Krathong", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "loi krathong floating lanterns thailand" },
    { title: "Notting Hill Carnival", location: "London, UK", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "notting hill carnival london street" },
    { title: "Boryeong Mud Festival", location: "South Korea", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "boryeong mud festival south korea" },
    { title: "Carnival Colombia", location: "Barranquilla, Colombia", imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop", query: "barranquilla carnival colombia" },
    { title: "Hanami Japan", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", query: "hanami cherry blossom japan picnic" },
    { title: "San Fermin", location: "Pamplona, Spain", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "san fermin running of the bulls spain" },
    { title: "Bonnaroo", location: "Tennessee, USA", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", query: "bonnaroo music festival usa" },
    { title: "White Nights Festival", location: "St. Petersburg, Russia", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "white nights st petersburg russia" },
    { title: "Full Moon Party", location: "Koh Phangan, Thailand", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "full moon party thailand beach" },
    { title: "Caribana Toronto", location: "Toronto, Canada", imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop", query: "caribana toronto caribbean parade" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop`;
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
