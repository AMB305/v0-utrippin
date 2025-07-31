import React from 'react';

export const ReligionTravelCards: React.FC = () => {
  console.log('🚨 ReligionTravelCards component is rendering!');
  
  const destinations = [
    { title: "Vatican City", location: "Vatican City", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", query: "vatican st peters basilica" },
    { title: "Mecca", location: "Saudi Arabia", imageUrl: "https://images.unsplash.com/photo-1564769662080-ec2544481688?w=400&h=300&fit=crop", query: "mecca hajj pilgrimage" },
    { title: "Jerusalem", location: "Israel", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", query: "jerusalem old city religion" },
  ];

  return (
    <div style={{backgroundColor: 'yellow', border: '10px solid red', padding: '20px'}}>
      <h3 style={{color: 'red', fontSize: '24px', textAlign: 'center'}}>🚨 RELIGION CARDS COMPONENT 🚨</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {destinations.map(({ title, location, imageUrl, query }, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64"
            style={{border: '5px solid lime'}}
            onClick={() => {
              console.log('🚨 RELIGION CARD CLICKED:', title);
              alert(`🚨 RELIGION CARD SUCCESS: ${title}`);
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={imageUrl}
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
    </div>
  );
};