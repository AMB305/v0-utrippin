import React from 'react';

export const OutdoorTravelCards = () => {
  const outdoorDestinations = [
    { title: "Zion National Park", query: "zion national park utah outdoors hiking" },
    { title: "Torres del Paine", query: "torres del paine chile hiking outdoor adventure" },
    { title: "Lake Bled", query: "lake bled slovenia outdoor nature" },
    { title: "Yellowstone", query: "yellowstone national park outdoors geysers wildlife" },
    { title: "Banff", query: "banff national park canada outdoor lake mountains" },
    { title: "Yosemite", query: "yosemite national park california hiking nature" },
    { title: "Cinque Terre", query: "cinque terre italy hiking ocean outdoors" },
    { title: "Patagonia", query: "patagonia argentina outdoor trekking mountains" },
    { title: "Glacier National Park", query: "glacier national park montana outdoor" },
    { title: "Iceland", query: "iceland waterfalls hiking outdoors volcano" },
    { title: "Sedona", query: "sedona arizona red rocks hiking outdoor" },
    { title: "Blue Ridge Parkway", query: "blue ridge parkway scenic outdoors fall" },
    { title: "Grand Canyon", query: "grand canyon arizona outdoor hiking views" },
    { title: "Big Sur", query: "big sur california cliffs outdoors" },
    { title: "Swiss Alps", query: "swiss alps outdoors mountain hiking" },
    { title: "Moab", query: "moab utah arches outdoors desert" },
    { title: "Costa Rica Rainforest", query: "costa rica rainforest zipline outdoors" },
    { title: "New Zealand South Island", query: "new zealand outdoors adventure" },
    { title: "Joshua Tree", query: "joshua tree national park outdoor desert" },
    { title: "Lake Tahoe", query: "lake tahoe california outdoor trails" },
    { title: "Appalachian Trail", query: "appalachian trail hiking outdoors usa" },
    { title: "Mount Rainier", query: "mount rainier washington outdoors wildflowers" },
    { title: "Bryce Canyon", query: "bryce canyon utah outdoors hoodoos" },
    { title: "Lofoten Islands", query: "lofoten norway mountains ocean outdoor" },
    { title: "Tulum Cenotes", query: "tulum mexico outdoor cenotes swimming" },
    { title: "Grand Teton", query: "grand teton national park outdoors" },
    { title: "Sossusvlei", query: "sossusvlei namibia dunes outdoors" },
    { title: "Mount Cook", query: "mount cook new zealand outdoors alpine" },
    { title: "Wadi Rum", query: "wadi rum jordan desert camping outdoors" },
    { title: "Great Smoky Mountains", query: "smoky mountains national park outdoors hiking" },
    { title: "Adirondacks", query: "adirondack mountains new york outdoors" },
    { title: "Plitvice Lakes", query: "plitvice lakes croatia waterfalls outdoors" },
    { title: "Saxon Switzerland", query: "saxon switzerland germany outdoor national park" },
    { title: "Death Valley", query: "death valley california outdoors desert" },
    { title: "Kenai Fjords", query: "kenai fjords alaska kayak outdoors" },
    { title: "Isle of Skye", query: "isle of skye scotland outdoors cliffs" },
    { title: "Olympic National Park", query: "olympic national park outdoors rainforest" },
    { title: "Vermont", query: "vermont fall foliage outdoors hiking" },
    { title: "Zermatt", query: "zermatt switzerland outdoors mountain trails" },
    { title: "Norwegian Fjords", query: "norwegian fjords cruise outdoors nature" },
    { title: "Crater Lake", query: "crater lake oregon hiking outdoors" },
    { title: "Bled Gorge", query: "bled gorge slovenia river hike outdoors" },
    { title: "Redwood Forest", query: "redwood national park california outdoors" },
    { title: "Monteverde", query: "monteverde costa rica cloud forest outdoors" },
    { title: "Cappadocia", query: "cappadocia turkey hot air balloon outdoors" },
    { title: "Cotswolds", query: "cotswolds england walking outdoors village" },
    { title: "Shenandoah", query: "shenandoah national park virginia outdoors" },
    { title: "Havasu Falls", query: "havasu falls arizona hiking outdoors" },
    { title: "Dolomites", query: "dolomites italy outdoors alpine hiking" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {outdoorDestinations.map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gray-200">
            <img
              src={`/public/images/outdoors/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
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