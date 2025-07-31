import React from 'react';

export const ReligionTravelCards: React.FC = () => {
  const destinations = [
    { title: "Vatican City", location: "Vatican City", query: "vatican st peters basilica" },
    { title: "Mecca", location: "Saudi Arabia", query: "mecca hajj pilgrimage" },
    { title: "Haridwar", location: "Uttarakhand, India", query: "haridwar ganga aarti" },
    { title: "Bodh Gaya", location: "Bihar, India", query: "bodhgaya buddhist temple" },
    { title: "Amritsar", location: "Punjab, India", query: "amritsar golden temple" },
    { title: "Jerusalem", location: "Israel", query: "jerusalem old city religion" },
    { title: "Varanasi", location: "Uttar Pradesh, India", query: "varanasi ganges spirituality" },
    { title: "Lumbini", location: "Nepal", query: "lumbini birthplace of buddha" },
    { title: "Paro", location: "Bhutan", query: "paro taktsang bhutan" },
    { title: "Tirupati", location: "Andhra Pradesh, India", query: "tirupati balaji temple" },
    { title: "Mount Kailash", location: "Tibet", query: "kailash tibet sacred mountain" },
    { title: "Kyoto", location: "Japan", query: "kyoto shrines temples" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map(({ title, location, query }, i) => (
        <div
          key={i}
          className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={`https://images.unsplash.com/search/photos?query=${encodeURIComponent(query)}&w=400&h=300&fit=crop`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop`;
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