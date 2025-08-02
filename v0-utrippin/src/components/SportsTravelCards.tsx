import React from 'react';

export const SportsTravelCards = () => {
  const destinations = [
    { title: "Queenstown", location: "New Zealand", query: "queenstown new zealand adventure bungee skiing" },
    { title: "Chamonix", location: "France", query: "chamonix france mountaineering skiing hiking" },
    { title: "Banff", location: "Canada", query: "banff canada skiing ice climbing lakes" },
    { title: "Whistler", location: "Canada", query: "whistler canada snowboarding mountain biking" },
    { title: "Jackson Hole", location: "Wyoming, USA", query: "jackson hole wyoming skiing national park" },
    { title: "Moab", location: "Utah, USA", query: "moab utah rock climbing arches canyonlands" },
    { title: "Zermatt", location: "Switzerland", query: "zermatt switzerland skiing matterhorn alps" },
    { title: "Vail", location: "Colorado, USA", query: "vail colorado ski resort snowboard trails" },
    { title: "Aspen", location: "Colorado, USA", query: "aspen colorado winter sports luxury skiing" },
    { title: "Rotorua", location: "New Zealand", query: "rotorua new zealand rafting biking geysers" },
    { title: "Patagonia", location: "Argentina", query: "patagonia argentina hiking glaciers mountains" },
    { title: "Lake Tahoe", location: "California/Nevada, USA", query: "lake tahoe skiing fishing hiking resorts" },
    { title: "Montana", location: "USA", query: "montana usa fly fishing horseback riding" },
    { title: "Telluride", location: "Colorado, USA", query: "telluride colorado ski resort backcountry" },
    { title: "Park City", location: "Utah, USA", query: "park city utah skiing sundance film fest" },
    { title: "Maui", location: "Hawaii, USA", query: "maui hawaii surfing snorkeling volcano hikes" },
    { title: "Nazaré", location: "Portugal", query: "nazare portugal surfing big waves" },
    { title: "Valdez", location: "Alaska, USA", query: "valdez alaska heli skiing fishing snow" },
    { title: "Andermatt", location: "Switzerland", query: "andermatt switzerland deep snow skiing" },
    { title: "Costa Rica (Arenal)", location: "Costa Rica", query: "arenal costa rica zipline rafting volcano" },
    { title: "Yosemite", location: "California, USA", query: "yosemite california rock climbing hiking" },
    { title: "Bhutan", location: "Bhutan", query: "bhutan trekking archery cultural travel" },
    { title: "Mendoza", location: "Argentina", query: "mendoza argentina horseback riding wine tours" },
    { title: "Ketchikan", location: "Alaska, USA", query: "ketchikan alaska salmon fishing wilderness" },
    { title: "St. Moritz", location: "Switzerland", query: "st moritz switzerland ski polo luxury" },
    { title: "Bled", location: "Slovenia", query: "lake bled slovenia rowing hiking kayaking" },
    { title: "Dubai", location: "UAE", query: "dubai desert sports camel racing dune buggy" },
    { title: "Big Sky", location: "Montana, USA", query: "big sky montana ski resort outdoor sports" },
    { title: "Lake Placid", location: "New York, USA", query: "lake placid winter olympics bobsledding" },
    { title: "Innsbruck", location: "Austria", query: "innsbruck austria ski culture alps" },
    { title: "Machu Picchu Trail", location: "Peru", query: "machu picchu peru trekking adventure" },
    { title: "Kyoto Mountains", location: "Japan", query: "kyoto japan mountain hiking adventure" },
    { title: "Teton Village", location: "Wyoming, USA", query: "teton village wyoming skiing hiking" },
    { title: "Colorado Springs", location: "Colorado, USA", query: "colorado springs outdoor sports climbing" },
    { title: "Utah Canyons", location: "Utah, USA", query: "utah hiking slot canyons adventure" },
    { title: "Blue Ridge Mountains", location: "North Carolina, USA", query: "blue ridge north carolina hiking rafting" },
    { title: "Alaska Glaciers", location: "Alaska, USA", query: "alaska glacier fishing trekking" },
    { title: "Snowmass", location: "Colorado, USA", query: "aspen snowmass skiing snowboarding trails" },
    { title: "Arenal Volcano", location: "Costa Rica", query: "arenal costa rica hiking zipline rafting" },
    { title: "Hokkaido", location: "Japan", query: "hokkaido japan skiing powder snow" }
  ];

  const getImageUrl = (title: string, query: string) => {
    const sportsImages = {
      'Queenstown': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'Chamonix': 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&h=300&fit=crop',
      'Banff': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      'Whistler': 'https://images.unsplash.com/photo-1551524164-6cf2ac4ec217?w=400&h=300&fit=crop',
      'Jackson Hole': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      'Moab': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'Zermatt': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
      'Vail': 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&h=300&fit=crop',
      'Aspen': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      'Rotorua': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    };
    return sportsImages[title as keyof typeof sportsImages] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
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
                  e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`;
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
