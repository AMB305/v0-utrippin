import React from 'react';

export const WellnessTravelCards = () => {
  const destinations = [
    { title: "Ubud", location: "Bali, Indonesia", query: "ubud bali indonesia yoga retreat rice fields" },
    { title: "Sedona", location: "Arizona, USA", query: "sedona arizona spiritual healing red rocks" },
    { title: "Tulum", location: "Mexico", query: "tulum mexico jungle spa yoga beach" },
    { title: "Kerala", location: "India", query: "kerala india ayurveda backwaters wellness" },
    { title: "Goa", location: "India", query: "goa india wellness resorts beach yoga" },
    { title: "Costa Rica", location: "Costa Rica", query: "costa rica eco retreat pura vida" },
    { title: "Santorini", location: "Greece", query: "santorini greece spa white buildings" },
    { title: "Maui", location: "Hawaii, USA", query: "maui hawaii ocean yoga wellness escape" },
    { title: "Sedbergh", location: "England", query: "sedbergh england yoga forest retreat" },
    { title: "Rishikesh", location: "India", query: "rishikesh india yoga capital meditation" },
    { title: "Bali", location: "Indonesia", query: "bali indonesia wellness retreats spa yoga" },
    { title: "Napa Valley", location: "California, USA", query: "napa valley california vineyard spa" },
    { title: "Lake Louise", location: "Canada", query: "lake louise canada nature spa escape" },
    { title: "Chiang Mai", location: "Thailand", query: "chiang mai thailand wellness jungle retreat" },
    { title: "Uluwatu", location: "Bali, Indonesia", query: "uluwatu bali cliffside spa yoga retreat" },
    { title: "Koh Samui", location: "Thailand", query: "koh samui thailand detox wellness" },
    { title: "Oaxaca", location: "Mexico", query: "oaxaca mexico cultural healing retreat" },
    { title: "Nosara", location: "Costa Rica", query: "nosara costa rica beach yoga eco lodge" },
    { title: "Ibiza", location: "Spain", query: "ibiza spain wellness resort spiritual detox" },
    { title: "Blue Lagoon", location: "Iceland", query: "blue lagoon iceland geothermal spa retreat" },
    { title: "Palm Springs", location: "California, USA", query: "palm springs california desert spa escape" },
    { title: "Queenstown", location: "New Zealand", query: "queenstown new zealand hot pools spa" },
    { title: "Kyoto", location: "Japan", query: "kyoto japan zen gardens wellness temples" },
    { title: "Lake Atitlán", location: "Guatemala", query: "lake atitlan guatemala yoga eco retreat" },
    { title: "Sri Lanka", location: "Sri Lanka", query: "sri lanka wellness tea plantations yoga" },
    { title: "Banff", location: "Canada", query: "banff canada mountains hot springs spa" },
    { title: "Auroville", location: "India", query: "auroville india meditation yoga spiritual" },
    { title: "Big Sur", location: "California, USA", query: "big sur california cliffside retreat spa" },
    { title: "Taghazout", location: "Morocco", query: "taghazout morocco surf yoga retreat" },
    { title: "Algarve", location: "Portugal", query: "algarve portugal coastal wellness retreat" },
    { title: "Langkawi", location: "Malaysia", query: "langkawi malaysia luxury wellness resorts" },
    { title: "Jeju Island", location: "South Korea", query: "jeju island korea spa volcano hiking" },
    { title: "Paro", location: "Bhutan", query: "paro bhutan spiritual wellness meditation" },
    { title: "Mont Tremblant", location: "Canada", query: "mont tremblant canada forest spa escape" },
    { title: "San Juan Islands", location: "Washington, USA", query: "san juan islands washington coastal retreat" },
    { title: "Crete", location: "Greece", query: "crete greece wellness spa mediterranean" },
    { title: "Tenerife", location: "Canary Islands, Spain", query: "tenerife canary islands yoga beach detox" },
    { title: "Vietnam Highlands", location: "Vietnam", query: "vietnam highlands retreat wellness spa" },
    { title: "Amalfi Coast", location: "Italy", query: "amalfi coast italy peaceful coastal wellness" },
    { title: "Lofoten Islands", location: "Norway", query: "lofoten norway wellness retreat arctic escape" }
  ];

  const getImageUrl = (title: string, query: string) => {
    const wellnessImages = {
      'Ubud': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'Sedona': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop',
      'Tulum': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'Kerala': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop',
      'Goa': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Costa Rica': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
      'Maui': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      'Rishikesh': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop'
    };
    return wellnessImages[title as keyof typeof wellnessImages] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
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
              <div className="absolute inset-0 bg-black/50"></div>
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
