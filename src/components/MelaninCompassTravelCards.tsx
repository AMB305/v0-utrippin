import React from 'react';

export const MelaninCompassTravelCards = () => {
  const destinations = [
    { title: "Accra", location: "Ghana", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "accra ghana black culture afrochella" },
    { title: "Kigali", location: "Rwanda", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "kigali rwanda black travel culture" },
    { title: "Zanzibar", location: "Tanzania", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "zanzibar tanzania black travelers beach" },
    { title: "Dakar", location: "Senegal", imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop", query: "dakar senegal black culture island of goree" },
    { title: "Cape Town", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", query: "cape town south africa black owned tours" },
    { title: "Johannesburg", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400&h=300&fit=crop", query: "johannesburg apartheid museum black history" },
    { title: "New Orleans", location: "Louisiana, USA", imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop", query: "new orleans louisiana black music culture" },
    { title: "Memphis", location: "Tennessee, USA", imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=300&fit=crop", query: "memphis tennessee civil rights blues" },
    { title: "Harlem", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&h=300&fit=crop", query: "harlem new york black renaissance history" },
    { title: "Montgomery", location: "Alabama, USA", imageUrl: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=300&fit=crop", query: "montgomery alabama legacy museum" },
    { title: "Selma", location: "Alabama, USA", imageUrl: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=400&h=300&fit=crop", query: "selma alabama civil rights march history" },
    { title: "Atlanta", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop", query: "atlanta black history civil rights culture" },
    { title: "Baltimore", location: "Maryland, USA", imageUrl: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400&h=300&fit=crop", query: "baltimore black history museums" },
    { title: "Chicago South Side", location: "Illinois, USA", imageUrl: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=400&h=300&fit=crop", query: "chicago south side black culture music" },
    { title: "Oakland", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=400&h=300&fit=crop", query: "oakland california black panther history" },
    { title: "Washington DC", location: "USA", imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=300&fit=crop", query: "washington dc african american history museum" },
    { title: "Philadelphia", location: "Pennsylvania, USA", imageUrl: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=400&h=300&fit=crop", query: "philadelphia black history murals" },
    { title: "Savannah", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=400&h=300&fit=crop", query: "savannah georgia gullah culture black history" },
    { title: "Charleston", location: "South Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=300&fit=crop", query: "charleston south carolina gullah geechee" },
    { title: "Jamaica", location: "Caribbean", imageUrl: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=400&h=300&fit=crop", query: "jamaica reggae culture black heritage" },
    { title: "Barbados", location: "Caribbean", imageUrl: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=300&fit=crop", query: "barbados caribbean black culture" },
    { title: "Trinidad", location: "Caribbean", imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop", query: "trinidad carnival black caribbean culture" },
    { title: "Bahamas", location: "Caribbean", imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=400&h=300&fit=crop", query: "bahamas junkanoo black heritage" },
    { title: "Cuba", location: "Caribbean", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", query: "cuba afro cuban music black culture havana" },
    { title: "Cartagena", location: "Colombia", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", query: "cartagena colombia palenque black history" },
    { title: "Rio de Janeiro", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1574714892095-8adeb8c0e87b?w=400&h=300&fit=crop", query: "rio de janeiro afro brazil culture" },
    { title: "Salvador", location: "Bahia, Brazil", imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop", query: "salvador bahia brazil black history" },
    { title: "London", location: "United Kingdom", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop", query: "london brixton black british culture" },
    { title: "Paris", location: "France", imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop", query: "paris france black artists diaspora culture" },
    { title: "Lagos", location: "Nigeria", imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop", query: "lagos nigeria black culture afrobeat" },
    { title: "Addis Ababa", location: "Ethiopia", imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop", query: "addis ababa ethiopia pan african history" },
    { title: "Kingston", location: "Jamaica", imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop", query: "kingston jamaica reggae bob marley museum" },
    { title: "Freetown", location: "Sierra Leone", imageUrl: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400&h=300&fit=crop", query: "freetown sierra leone diaspora return" },
    { title: "São Tomé", location: "São Tomé and Príncipe", imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop", query: "sao tome african island black travel" },
    { title: "Port-au-Prince", location: "Haiti", imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=300&fit=crop", query: "port au prince haiti revolution history" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map(({ title, location, imageUrl, query }, i) => (
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop`;
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
