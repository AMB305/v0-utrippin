import React from 'react';

export const LuxuryTravelCards = () => {
  const luxuryDestinations = [
    { title: "Maldives", query: "maldives luxury overwater bungalow island" },
    { title: "Bora Bora", query: "bora bora five star resort luxury travel" },
    { title: "Santorini", query: "santorini greece luxury cliff hotel" },
    { title: "Dubai", query: "dubai luxury hotel skyline beach" },
    { title: "Paris", query: "paris france luxury shopping hotel" },
    { title: "Amalfi Coast", query: "amalfi coast italy luxury cliffside hotel" },
    { title: "Lake Como", query: "lake como italy luxury villa travel" },
    { title: "Aspen", query: "aspen colorado luxury ski resort" },
    { title: "Maui", query: "maui hawaii luxury resort beach" },
    { title: "Capri", query: "capri italy yacht luxury hotel" },
    { title: "Bali", query: "bali jungle luxury retreat spa" },
    { title: "Mykonos", query: "mykonos greece luxury party beach hotel" },
    { title: "Monaco", query: "monaco yachts luxury travel casino" },
    { title: "Dubai Desert", query: "dubai desert luxury camp resort" },
    { title: "Tokyo", query: "tokyo japan luxury hotel skyline" },
    { title: "New York City", query: "new york city luxury penthouse skyline" },
    { title: "Oahu", query: "oahu hawaii luxury beach resort" },
    { title: "Big Sur", query: "big sur california luxury ocean resort" },
    { title: "Tuscany", query: "tuscany italy vineyard luxury villa" },
    { title: "Zurich", query: "zurich switzerland luxury hotel lake" },
    { title: "Venice", query: "venice italy gondola luxury hotel" },
    { title: "St. Moritz", query: "st moritz switzerland luxury alpine resort" },
    { title: "London", query: "london england luxury hotel spa afternoon tea" },
    { title: "Kyoto", query: "kyoto japan ryokan luxury cultural stay" },
    { title: "Barbados", query: "barbados luxury beach resort" },
    { title: "Napa Valley", query: "napa valley california vineyard resort spa" },
    { title: "Sedona", query: "sedona arizona luxury wellness retreat" },
    { title: "Seychelles", query: "seychelles beach private luxury villa" },
    { title: "Los Cabos", query: "los cabos mexico luxury resort ocean" },
    { title: "Zermatt", query: "zermatt switzerland luxury ski hotel" },
    { title: "South Beach", query: "south beach miami luxury beachfront hotel" },
    { title: "Banff", query: "banff canada luxury mountain lodge" },
    { title: "Queenstown", query: "queenstown new zealand luxury lodge adventure" },
    { title: "Phuket", query: "phuket thailand luxury pool villa resort" },
    { title: "Palm Beach", query: "palm beach florida luxury coastal resort" },
    { title: "Montana Ranches", query: "montana usa luxury wilderness ranch resort" },
    { title: "Tulum", query: "tulum mexico eco luxury resort" },
    { title: "Costa Rica", query: "costa rica rainforest luxury villa" },
    { title: "St. Barts", query: "st barts caribbean luxury travel island" },
    { title: "Hong Kong", query: "hong kong harbor view luxury hotel" },
    { title: "Florence", query: "florence italy luxury boutique hotel" },
    { title: "Marrakech", query: "marrakech morocco riad luxury spa" },
    { title: "Vancouver", query: "vancouver canada luxury waterfront hotel" },
    { title: "Vienna", query: "vienna austria palace hotel luxury travel" },
    { title: "Aspen Snowmass", query: "aspen snowmass luxury ski winter lodge" },
    { title: "Lake Tahoe", query: "lake tahoe california luxury resort" },
    { title: "Positano", query: "positano italy luxury oceanview villa" },
    { title: "Whistler", query: "whistler canada luxury ski resort" },
    { title: "Dubrovnik", query: "dubrovnik croatia old town luxury hotel" },
    { title: "Doha", query: "doha qatar luxury desert modern skyline" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {luxuryDestinations.map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gray-200">
            <img
              src={`/public/images/luxury/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
