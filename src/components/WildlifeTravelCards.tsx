import React from 'react';

export const WildlifeTravelCards: React.FC = () => {
  const destinations = [
    { title: "Serengeti", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "serengeti national park tanzania safari wildlife" },
    { title: "Kruger", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "kruger national park south africa wildlife safari" },
    { title: "Galápagos Islands", location: "Ecuador", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "galapagos islands wildlife marine iguanas turtles" },
    { title: "Yellowstone", location: "Wyoming, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "yellowstone national park geysers bison wildlife" },
    { title: "Amazon Rainforest", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "amazon rainforest wildlife monkeys jungle" },
    { title: "Masai Mara", location: "Kenya", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "masai mara kenya safari lions" },
    { title: "Chobe National Park", location: "Botswana", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "chobe botswana elephants safari" },
    { title: "Denali", location: "Alaska, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "denali national park alaska wildlife bears" },
    { title: "Pantanal", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "pantanal brazil jaguars wetlands safari" },
    { title: "Banff", location: "Alberta, Canada", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", query: "banff canada wildlife bears moose" },
    { title: "Yosemite", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "yosemite wildlife deer mountains california" },
    { title: "Etosha", location: "Namibia", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "etosha national park namibia wildlife salt pan" },
    { title: "Borneo", location: "Malaysia", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "borneo orangutans jungle wildlife" },
    { title: "Great Barrier Reef", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "great barrier reef marine wildlife snorkeling" },
    { title: "Everglades", location: "Florida, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "everglades florida alligators wildlife tour" },
    { title: "Glacier National Park", location: "Montana, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "glacier national park wildlife montana" },
    { title: "Antarctica", location: "Antarctica", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "antarctica penguins seals expedition wildlife" },
    { title: "Ranthambore", location: "India", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "ranthambore india tiger safari" },
    { title: "Zion", location: "Utah, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "zion national park wildlife hiking utah" },
    { title: "Botswana Okavango", location: "Botswana", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "okavango delta botswana wildlife safari" },
    { title: "Costa Rica", location: "Costa Rica", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "costa rica jungle toucans monkeys wildlife" },
    { title: "Madagascar", location: "Madagascar", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "madagascar lemurs rainforest wildlife" },
    { title: "Grand Teton", location: "Wyoming, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "grand teton national park wildlife elk" },
    { title: "South Luangwa", location: "Zambia", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "south luangwa zambia walking safari wildlife" },
    { title: "Katmai", location: "Alaska, USA", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "katmai alaska bear watching salmon run" },
    { title: "Namib Desert", location: "Namibia", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop", query: "namibia desert wildlife safari" },
    { title: "Tanzania Ngorongoro", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "ngorongoro crater safari wildlife tanzania" },
    { title: "Kenai Fjords", location: "Alaska, USA", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "kenai fjords alaska whales puffins wildlife" },
    { title: "Isle Royale", location: "Michigan, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "isle royale michigan moose wolves wildlife" },
    { title: "Sundarbans", location: "India & Bangladesh", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "sundarbans india bangladesh tiger mangrove" },
    { title: "Custer State Park", location: "South Dakota, USA", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "custer state park bison south dakota" },
    { title: "Volcanoes Rwanda", location: "Rwanda", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "volcanoes national park rwanda gorillas" },
    { title: "Redwoods", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "redwood national park california wildlife" },
    { title: "Svalbard", location: "Norway", imageUrl: "https://images.unsplash.com/photo-1539066436738-336a9abb9b8a?w=400&h=300&fit=crop", query: "svalbard norway polar bears arctic wildlife" },
    { title: "Baja California", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "baja california mexico whale watching" },
    { title: "Laikipia", location: "Kenya", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "laikipia kenya private conservancy safari" },
    { title: "Manuel Antonio", location: "Costa Rica", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "manuel antonio costa rica wildlife" },
    { title: "Addo Elephant Park", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "addo elephant national park south africa" },
    { title: "Kanha", location: "India", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "kanha national park india tiger forest" },
    { title: "Bryce Canyon", location: "Utah, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "bryce canyon wildlife utah desert" },
    { title: "Aoraki / Mount Cook", location: "New Zealand", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=300&fit=crop", query: "aoraki mount cook new zealand alpine wildlife" },
    { title: "Monarch Grove", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "pacific grove california monarch butterflies" },
    { title: "Pinnacles", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=300&fit=crop", query: "pinnacles national park california bat caves wildlife" },
    { title: "Great Smoky Mountains", location: "Tennessee, USA", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "smoky mountains black bears wildlife" },
    { title: "Ranomafana", location: "Madagascar", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", query: "ranomafana national park madagascar lemurs" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop`;
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
