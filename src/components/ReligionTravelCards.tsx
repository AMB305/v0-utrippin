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
              src={`/images/religion/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            {/* Gradient Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
          
          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{title}</h3>
            <p className="text-sm font-medium tracking-wider uppercase opacity-90 drop-shadow-md">
              {location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};