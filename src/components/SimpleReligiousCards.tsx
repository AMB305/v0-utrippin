import React from 'react';

const SimpleReligiousCards: React.FC = () => {
  const cards = [
    { title: "Vatican City", location: "Vatican City", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop" },
    { title: "Mecca", location: "Saudi Arabia", imageUrl: "https://images.unsplash.com/photo-1564769662080-ec2544481688?w=400&h=300&fit=crop" },
    { title: "Jerusalem", location: "Israel", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop" },
  ];

  const handleClick = (cardTitle: string) => {
    console.log('✅ Card clicked successfully:', cardTitle);
    alert(`You clicked: ${cardTitle}`);
  };

  console.log('🏛️ SimpleReligiousCards component is rendering');

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Religious & Spiritual Destinations
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64 bg-gray-800"
            onClick={() => handleClick(card.title)}
          >
            <div className="absolute inset-0">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.log('Image failed to load for:', card.title);
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                {card.title}
              </h3>
              <p className="text-white text-sm font-medium uppercase opacity-95 drop-shadow-lg">
                {card.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimpleReligiousCards;
