import React from 'react';

export const NatureTravelCards: React.FC = () => {
  const destinations = [
    { title: "Banff", location: "Alberta, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "banff national park lake mountain" },
    { title: "Yosemite", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "yosemite waterfalls cliffs nature" },
    { title: "Grand Canyon", location: "Arizona, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "grand canyon arizona sunset" },
    { title: "Iceland", location: "Iceland", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "iceland volcano glacier" },
    { title: "Norwegian Fjords", location: "Norway", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "norwegian fjords landscape" },
    { title: "Patagonia", location: "Argentina & Chile", imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=300&fit=crop", query: "patagonia mountains lakes" },
    { title: "Amazon Rainforest", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "amazon rainforest river" },
    { title: "Bali Rice Terraces", location: "Bali, Indonesia", imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop", query: "bali rice terrace sunrise" },
    { title: "Sahara Desert", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "sahara desert dunes camel" },
    { title: "Plitvice Lakes", location: "Croatia", imageUrl: "https://images.unsplash.com/photo-1586276393635-5ecd8112877e?w=400&h=300&fit=crop", query: "plitvice lakes waterfalls croatia" },
    { title: "Zhangjiajie", location: "Hunan, China", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "zhangjiajie china stone pillars" },
    { title: "Great Barrier Reef", location: "Queensland, Australia", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "great barrier reef aerial coral" },
    { title: "Torres del Paine", location: "Patagonia, Chile", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "torres del paine national park" },
    { title: "Ha Long Bay", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "ha long bay limestone islands" },
    { title: "Cinque Terre", location: "Liguria, Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "cinque terre coast italy" },
    { title: "Swiss Alps", location: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "swiss alps snow mountain" },
    { title: "New Zealand South Island", location: "New Zealand", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "new zealand fjord mountains" },
    { title: "Victoria Falls", location: "Zambia & Zimbabwe", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "victoria falls africa rainbow" },
    { title: "Seychelles", location: "Seychelles", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "seychelles beach nature" },
    { title: "Faroe Islands", location: "Faroe Islands", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "faroe islands cliffs grass" },
    { title: "Moraine Lake", location: "Alberta, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "moraine lake banff turquoise" },
    { title: "Tuscany", location: "Tuscany, Italy", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=300&fit=crop", query: "tuscany italy rolling hills" },
    { title: "Galápagos Islands", location: "Ecuador", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "galapagos islands animals nature" },
    { title: "Atacama Desert", location: "Chile", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "atacama desert chile sky" },
    { title: "Himalayas", location: "Nepal & Tibet", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "himalayas mountain range snow" },
    { title: "Kruger National Park", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "kruger park safari animals" },
    { title: "Arches National Park", location: "Utah, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "arches national park desert" },
    { title: "Northern Lights", location: "Arctic Circle", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "northern lights aurora arctic" },
    { title: "Lake Bled", location: "Slovenia", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "lake bled slovenia nature" },
    { title: "Denali", location: "Alaska, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "denali national park alaska" },
    { title: "Lofoten Islands", location: "Norway", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "lofoten islands norway nature" },
    { title: "Dolomites", location: "Northern Italy", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "dolomites mountains italy nature" },
    { title: "Yellowstone", location: "Wyoming, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "yellowstone geysers nature" },
    { title: "Svalbard", location: "Norway", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "svalbard polar bears arctic" },
    { title: "Redwood Forest", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "redwood forest tall trees" },
    { title: "Namib Desert", location: "Namibia", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "namib desert dunes sunrise" },
    { title: "Mount Fuji", location: "Honshu, Japan", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "mount fuji japan with nature" },
    { title: "Blue Ridge Mountains", location: "Virginia, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "blue ridge mountains fall leaves" },
    { title: "Tikal", location: "Guatemala", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "tikal guatemala jungle ruins" },
    { title: "Hạ Long Bay", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop", query: "ha long bay nature vietnam" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop`;
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