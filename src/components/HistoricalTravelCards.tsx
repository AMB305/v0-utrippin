import React from 'react';

export const HistoricalTravelCards = () => {
  const historicalDestinations = [
    { title: "Rome", query: "rome italy colosseum ancient ruins history" },
    { title: "Athens", query: "athens greece acropolis historical site" },
    { title: "Cairo", query: "cairo egypt pyramids sphinx historical" },
    { title: "Petra", query: "petra jordan ancient city unesco" },
    { title: "Machu Picchu", query: "machu picchu peru inca ruins unesco" },
    { title: "Jerusalem", query: "jerusalem israel holy historical city" },
    { title: "Istanbul", query: "istanbul turkey hagia sophia history" },
    { title: "Kyoto", query: "kyoto japan temples historical heritage" },
    { title: "Beijing", query: "beijing china forbidden city great wall" },
    { title: "Angkor Wat", query: "angkor wat cambodia ancient temples" },
    { title: "Varanasi", query: "varanasi india oldest city history" },
    { title: "Fez", query: "fez morocco medina history unesco" },
    { title: "Cusco", query: "cusco peru historical colonial city" },
    { title: "Hanoi", query: "hanoi vietnam old quarter historical" },
    { title: "Delphi", query: "delphi greece ancient ruins" },
    { title: "Lalibela", query: "lalibela ethiopia rock churches unesco" },
    { title: "Cartagena", query: "cartagena colombia walled city historical" },
    { title: "Tikal", query: "tikal guatemala mayan ruins jungle" },
    { title: "Quito", query: "quito ecuador old town unesco" },
    { title: "Prague", query: "prague czech republic old town square history" },
    { title: "Budapest", query: "budapest hungary castles historical buildings" },
    { title: "Dubrovnik", query: "dubrovnik croatia city walls history" },
    { title: "Xi'an", query: "xian china terracotta army ancient" },
    { title: "Jericho", query: "jericho palestine oldest city ruins" },
    { title: "Luang Prabang", query: "luang prabang laos temples heritage" },
    { title: "Samarkand", query: "samarkand uzbekistan silk road historical" },
    { title: "Yogyakarta", query: "yogyakarta indonesia borobudur temples" },
    { title: "Paris", query: "paris france historical landmarks eiffel louvre" },
    { title: "Florence", query: "florence italy renaissance historical city" },
    { title: "London", query: "london england tower bridge big ben history" },
    { title: "Granada", query: "granada spain alhambra history" },
    { title: "Vienna", query: "vienna austria historical palaces city" },
    { title: "Zanzibar", query: "zanzibar tanzania stone town historical" },
    { title: "Lisbon", query: "lisbon portugal historical tram streets" },
    { title: "Lima", query: "lima peru plaza mayor colonial history" },
    { title: "Mexico City", query: "mexico city teotihuacan aztec ruins" },
    { title: "Boston", query: "boston usa freedom trail history" },
    { title: "Philadelphia", query: "philadelphia usa liberty bell independence hall" },
    { title: "Charleston", query: "charleston south carolina historic district" },
    { title: "Savannah", query: "savannah georgia cobblestone streets historic" },
    { title: "St. Augustine", query: "st augustine florida oldest city usa" },
    { title: "San Antonio", query: "san antonio texas alamo history" },
    { title: "Montreal", query: "montreal canada old town history" },
    { title: "New Orleans", query: "new orleans french quarter historic" },
    { title: "Santa Fe", query: "santa fe new mexico adobe historical" },
    { title: "Gettysburg", query: "gettysburg pennsylvania civil war site" },
    { title: "York", query: "york england medieval history" },
    { title: "Edinburgh", query: "edinburgh scotland castle old town" },
    { title: "Valletta", query: "valletta malta fortress city historical" },
    { title: "Timbuktu", query: "timbuktu mali desert library ancient history" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {historicalDestinations.map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gray-200">
            <img
              src={`/public/images/historical/${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`}
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
