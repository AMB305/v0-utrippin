import React from 'react';

export const MelaninCompassTravelCards = () => {
  const melaninCompassDestinations = [
    { title: "Accra", query: "accra ghana black culture afrochella" },
    { title: "Kigali", query: "kigali rwanda black travel culture" },
    { title: "Zanzibar", query: "zanzibar tanzania black travelers beach" },
    { title: "Dakar", query: "dakar senegal black culture island of goree" },
    { title: "Cape Town", query: "cape town south africa black owned tours" },
    { title: "Johannesburg", query: "johannesburg apartheid museum black history" },
    { title: "New Orleans", query: "new orleans louisiana black music culture" },
    { title: "Memphis", query: "memphis tennessee civil rights blues" },
    { title: "Harlem NYC", query: "harlem new york black renaissance history" },
    { title: "Montgomery", query: "montgomery alabama legacy museum" },
    { title: "Selma", query: "selma alabama civil rights march history" },
    { title: "Atlanta", query: "atlanta black history civil rights culture" },
    { title: "Baltimore", query: "baltimore black history museums" },
    { title: "Chicago South Side", query: "chicago south side black culture music" },
    { title: "Oakland", query: "oakland california black panther history" },
    { title: "Washington DC", query: "washington dc african american history museum" },
    { title: "Philadelphia", query: "philadelphia black history murals" },
    { title: "Savannah", query: "savannah georgia gullah culture black history" },
    { title: "Charleston", query: "charleston south carolina gullah geechee" },
    { title: "Jamaica", query: "jamaica reggae culture black heritage" },
    { title: "Barbados", query: "barbados caribbean black culture" },
    { title: "Trinidad", query: "trinidad carnival black caribbean culture" },
    { title: "Bahamas", query: "bahamas junkanoo black heritage" },
    { title: "Cuba", query: "cuba afro cuban music black culture havana" },
    { title: "Cartagena", query: "cartagena colombia palenque black history" },
    { title: "Rio de Janeiro", query: "rio de janeiro afro brazil culture" },
    { title: "Salvador", query: "salvador bahia brazil black history" },
    { title: "Port of Spain", query: "port of spain trinidad carnival music" },
    { title: "Panama City", query: "panama city afro panamanian culture" },
    { title: "London", query: "london brixton black british culture" },
    { title: "Paris", query: "paris france black artists diaspora culture" },
    { title: "Lagos", query: "lagos nigeria black culture afrobeat" },
    { title: "Addis Ababa", query: "addis ababa ethiopia pan african history" },
    { title: "Kingston", query: "kingston jamaica reggae bob marley museum" },
    { title: "Durban", query: "durban south africa black coastal travel" },
    { title: "The Bronx", query: "bronx new york hip hop black history" },
    { title: "Detroit", query: "detroit motown black music heritage" },
    { title: "Houston", query: "houston texas black owned businesses" },
    { title: "Los Angeles", query: "los angeles black hollywood leimert park" },
    { title: "St. Louis", query: "st louis black culture gateway to west" },
    { title: "Freetown", query: "freetown sierra leone diaspora return" },
    { title: "Kumasi", query: "kumasi ghana ashanti kingdom history" },
    { title: "Niamey", query: "niamey niger black heritage west africa" },
    { title: "São Tomé", query: "sao tome african island black travel" },
    { title: "Port-au-Prince", query: "port au prince haiti revolution history" },
    { title: "St. Kitts", query: "st kitts caribbean black culture beach" },
    { title: "Antigua", query: "antigua caribbean heritage black history" },
    { title: "Fort-de-France", query: "fort de france martinique afro french culture" },
    { title: "Bridgetown", query: "bridgetown barbados black caribbean heritage" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {melaninCompassDestinations.map(({ title, query }, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <h4 className="font-bold text-lg mb-2">{title}</h4>
              <p className="text-sm opacity-90">Black Cultural Heritage</p>
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};