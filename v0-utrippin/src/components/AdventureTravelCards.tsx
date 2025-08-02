import React from 'react';

export const AdventureTravelCards: React.FC = () => {
  const destinations = [
    { title: "Mount Everest Base Camp", location: "Nepal", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "mount everest base camp trek" },
    { title: "Machu Picchu", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", query: "machu picchu hiking adventure" },
    { title: "The Inca Trail", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", query: "inca trail peru trekking" },
    { title: "Torres del Paine", location: "Chile", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "torres del paine trekking chile" },
    { title: "Zion Narrows", location: "Utah, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "zion national park narrows hike" },
    { title: "Grand Canyon Rim to Rim", location: "Arizona, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "grand canyon hiking trail adventure" },
    { title: "Interlaken", location: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "interlaken paragliding switzerland" },
    { title: "Queenstown", location: "New Zealand", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "queenstown bungee jumping new zealand" },
    { title: "Whistler", location: "British Columbia, Canada", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "whistler mountain skiing snowboarding" },
    { title: "Iceland Ice Cave", location: "Iceland", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "iceland glacier ice cave hike" },
    { title: "Banff Ice Walk", location: "Alberta, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "banff canada ice walk winter" },
    { title: "White Water Rafting Zambezi", location: "Zambia & Zimbabwe", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "zambezi river rafting victoria falls" },
    { title: "Volcano Boarding Nicaragua", location: "Nicaragua", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "cerro negro volcano boarding nicaragua" },
    { title: "Patagonia Expedition", location: "Argentina & Chile", imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=300&fit=crop", query: "patagonia hiking climbing expedition" },
    { title: "Safari Serengeti", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "serengeti safari wildlife jeep adventure" },
    { title: "Borneo Jungle Trek", location: "Malaysia", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "borneo jungle trek malaysia" },
    { title: "Amazon Kayaking", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "amazon river kayak rainforest" },
    { title: "Skydiving Dubai", location: "UAE", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "skydiving dubai palm island aerial" },
    { title: "Dog Sledding Alaska", location: "Alaska, USA", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "dog sledding alaska snowy trail" },
    { title: "Sandboarding Dubai", location: "UAE", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "sandboarding dubai desert dunes" },
    { title: "Mountain Biking Moab", location: "Utah, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "moab mountain biking utah" },
    { title: "Caving Waitomo", location: "New Zealand", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "waitomo glowworm cave adventure" },
    { title: "Paragliding Rio", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "paragliding rio de janeiro brazil" },
    { title: "Hot Air Balloon Cappadocia", location: "Turkey", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "cappadocia hot air balloon turkey" },
    { title: "Scuba Diving Belize", location: "Belize", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "scuba diving belize barrier reef" },
    { title: "Surfing Bali", location: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "surfing bali beach waves" },
    { title: "Heli Skiing Canada", location: "British Columbia, Canada", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "heli skiing british columbia snow" },
    { title: "Rock Climbing Kalymnos", location: "Greece", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "kalymnos rock climbing greece" },
    { title: "Canyoning Switzerland", location: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "canyoning switzerland water cliffs" },
    { title: "ATV Riding Morocco", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "atv quad biking sahara morocco" },
    { title: "Snowmobiling Iceland", location: "Iceland", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "snowmobile iceland glacier" },
    { title: "Kilimanjaro Climb", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "kilimanjaro summit climb africa" },
    { title: "Bungee Victoria Falls", location: "Zambia & Zimbabwe", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "bungee jumping victoria falls bridge" },
    { title: "Desert Safari Abu Dhabi", location: "UAE", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "abu dhabi desert safari adventure" },
    { title: "Cave Diving Mexico", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "cenote cave diving mexico" },
    { title: "Jet Boating New Zealand", location: "New Zealand", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "jet boat adventure new zealand river" },
    { title: "Snow Trek Nepal", location: "Nepal", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "snow trek annapurna nepal" },
    { title: "Via Ferrata Dolomites", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "via ferrata dolomites climbing italy" },
    { title: "Ice Climbing Ouray", location: "Colorado, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "ice climbing ouray colorado" },
    { title: "Ziplining Costa Rica", location: "Costa Rica", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "zipline costa rica jungle canopy" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`;
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
