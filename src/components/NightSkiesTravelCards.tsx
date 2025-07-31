import React from 'react';

export const NightSkiesTravelCards = () => {
  const nightSkiesDestinations = [
    { title: "Atacama Desert", query: "atacama desert chile stargazing clear skies" },
    { title: "Mauna Kea", query: "mauna kea hawaii observatory stargazing" },
    { title: "Death Valley", query: "death valley california dark sky stargazing" },
    { title: "Aoraki Mackenzie", query: "aoraki mackenzie new zealand dark sky reserve" },
    { title: "La Palma", query: "la palma canary islands observatory stargazing" },
    { title: "Jasper National Park", query: "jasper national park dark sky preserve canada" },
    { title: "Kerry Dark Sky Reserve", query: "kerry dark sky reserve ireland stargazing" },
    { title: "NamibRand", query: "namibrand nature reserve namibia dark sky" },
    { title: "Pic du Midi", query: "pic du midi france observatory night sky" },
    { title: "Big Bend", query: "big bend national park texas dark skies" },
    { title: "Bryce Canyon", query: "bryce canyon utah stargazing night sky" },
    { title: "Tenerife", query: "tenerife teide observatory canary islands" },
    { title: "Joshua Tree", query: "joshua tree national park california stargazing" },
    { title: "Uluru", query: "uluru australia outback stargazing aboriginal" },
    { title: "Mont-Mégantic", query: "mont megantic quebec dark sky reserve" },
    { title: "Cappadocia", query: "cappadocia turkey hot air balloon night sky" },
    { title: "Sossusvlei", query: "sossusvlei namibia dunes stargazing" },
    { title: "Galloway Forest", query: "galloway forest scotland dark sky park" },
    { title: "Cherry Springs", query: "cherry springs pennsylvania dark sky park" },
    { title: "Yellowstone", query: "yellowstone national park wyoming stargazing" },
    { title: "Wadi Rum", query: "wadi rum jordan desert night sky bedouin" },
    { title: "Easter Island", query: "easter island chile remote stargazing" },
    { title: "Fakarava", query: "fakarava french polynesia atoll night sky" },
    { title: "Ladakh", query: "ladakh india high altitude stargazing" },
    { title: "Iceland", query: "iceland northern lights aurora stargazing" },
    { title: "Norway Lofoten", query: "lofoten islands norway northern lights" },
    { title: "Alaska", query: "alaska northern lights aurora stargazing" },
    { title: "Finland Lapland", query: "lapland finland northern lights aurora" },
    { title: "Svalbard", query: "svalbard norway polar night aurora" },
    { title: "Greenland", query: "greenland northern lights ice stargazing" },
    { title: "Antelope Canyon", query: "antelope canyon arizona slot canyon night" },
    { title: "Monument Valley", query: "monument valley utah arizona night sky" },
    { title: "Grand Canyon South Rim", query: "grand canyon south rim stargazing" },
    { title: "Arches National Park", query: "arches national park utah night photography" },
    { title: "Capitol Reef", query: "capitol reef utah dark sky stargazing" },
    { title: "Great Basin", query: "great basin national park nevada dark sky" },
    { title: "Crater Lake", query: "crater lake oregon stargazing night sky" },
    { title: "Glacier National Park", query: "glacier national park montana stargazing" },
    { title: "Denali", query: "denali national park alaska aurora stargazing" },
    { title: "Badlands", query: "badlands national park south dakota night sky" },
    { title: "Saguenay Fjord", query: "saguenay fjord quebec dark sky reserve" },
    { title: "Algonquin Park", query: "algonquin park ontario dark sky preserve" },
    { title: "Point Pelee", query: "point pelee ontario dark sky preserve" },
    { title: "Kielder Forest", query: "kielder forest england dark sky park" },
    { title: "Exmoor", query: "exmoor england dark sky reserve stargazing" },
    { title: "Snowdonia", query: "snowdonia wales dark sky reserve" },
    { title: "Brecon Beacons", query: "brecon beacons wales dark sky reserve" },
    { title: "Rhön", query: "rhon biosphere reserve germany stargazing" },
    { title: "Westhavelland", query: "westhavelland germany dark sky reserve" },
    { title: "Zselic", query: "zselic starry sky park hungary dark sky" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {nightSkiesDestinations.map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gray-200">
            <img
              src={`/public/images/nightskies/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
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