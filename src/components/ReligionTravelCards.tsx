import React from 'react';

export const ReligionTravelCards: React.FC = () => {
  const destinations = [
    { title: "Vatican City", location: "Vatican City", flightPrice: "₹81K", hotelPrice: "₹8K/night", query: "vatican st peters basilica" },
    { title: "Mecca", location: "Saudi Arabia", flightPrice: "₹95K", hotelPrice: "₹12K/night", query: "mecca hajj pilgrimage" },
    { title: "Haridwar", location: "Uttarakhand, India", flightPrice: "₹8K", hotelPrice: "₹3K/night", query: "haridwar ganga aarti" },
    { title: "Bodh Gaya", location: "Bihar, India", flightPrice: "₹12K", hotelPrice: "₹4K/night", query: "bodhgaya buddhist temple" },
    { title: "Amritsar", location: "Punjab, India", flightPrice: "₹15K", hotelPrice: "₹5K/night", query: "amritsar golden temple" },
    { title: "Jerusalem", location: "Israel", flightPrice: "₹75K", hotelPrice: "₹15K/night", query: "jerusalem old city religion" },
    { title: "Varanasi", location: "Uttar Pradesh, India", flightPrice: "₹10K", hotelPrice: "₹3K/night", query: "varanasi ganges spirituality" },
    { title: "Lumbini", location: "Nepal", flightPrice: "₹25K", hotelPrice: "₹6K/night", query: "lumbini birthplace of buddha" },
    { title: "Paro", location: "Bhutan", flightPrice: "₹35K", hotelPrice: "₹8K/night", query: "paro taktsang bhutan" },
    { title: "Tirupati", location: "Andhra Pradesh, India", flightPrice: "₹12K", hotelPrice: "₹4K/night", query: "tirupati balaji temple" },
    { title: "Mount Kailash", location: "Tibet", flightPrice: "₹45K", hotelPrice: "₹10K/night", query: "kailash tibet sacred mountain" },
    { title: "Kyoto", location: "Japan", flightPrice: "₹65K", hotelPrice: "₹12K/night", query: "kyoto shrines temples" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map(({ title, location, flightPrice, hotelPrice, query }, i) => (
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
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          </div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
            {/* Title and Location */}
            <div className="text-center mt-auto mb-2">
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-sm opacity-90 font-medium tracking-wider uppercase">
                {location}
              </p>
            </div>
            
            {/* Pricing Information */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                </svg>
                <span className="text-xs font-semibold">{flightPrice}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.25 9.035 14.394 6.92a1 1 0 00.788-1.84l-7-3z"/>
                </svg>
                <span className="text-xs font-semibold">{hotelPrice}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};