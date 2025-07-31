import React from 'react';

export const FoodTravelCards: React.FC = () => {
  const destinations = [
    { title: "New Orleans", location: "Louisiana, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "new orleans cajun creole food street" },
    { title: "Naples", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", query: "naples italy pizza food culture" },
    { title: "Osaka", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "osaka japan street food takoyaki" },
    { title: "Bangkok", location: "Thailand", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "bangkok thailand street food night market" },
    { title: "Tokyo", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop", query: "tokyo sushi ramen food scene" },
    { title: "Barcelona", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "barcelona tapas paella food tour" },
    { title: "Paris", location: "France", imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop", query: "paris france cafes croissant bakery" },
    { title: "New York City", location: "New York, USA", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", query: "new york city food trucks bagels pizza" },
    { title: "Istanbul", location: "Turkey", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "istanbul turkey spices street food market" },
    { title: "Rome", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop", query: "rome italy pasta gelato food" },
    { title: "Chicago", location: "Illinois, USA", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", query: "chicago deep dish hot dog food tour" },
    { title: "Lima", location: "Peru", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "lima peru ceviche food capital" },
    { title: "Hanoi", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "hanoi vietnam pho banh mi food" },
    { title: "San Francisco", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "san francisco food trucks seafood sourdough" },
    { title: "Charleston", location: "South Carolina, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "charleston southern cuisine seafood grits" },
    { title: "Mexico City", location: "Mexico", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "mexico city tacos tamales street food" },
    { title: "Buenos Aires", location: "Argentina", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "buenos aires steak empanadas parrilla" },
    { title: "Portland", location: "Oregon, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "portland oregon food trucks coffee donuts" },
    { title: "Los Angeles", location: "California, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "los angeles fusion food trucks korean bbq" },
    { title: "Seoul", location: "South Korea", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "seoul korea bibimbap korean street food" },
    { title: "Taipei", location: "Taiwan", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "taipei night market street food taiwan" },
    { title: "Marrakech", location: "Morocco", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "marrakech morocco spices tagine" },
    { title: "Austin", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "austin bbq tacos brisket food truck" },
    { title: "Madrid", location: "Spain", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "madrid spain churros tapas jamon" },
    { title: "Savannah", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "savannah georgia low country food" },
    { title: "Bologna", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop", query: "bologna italy pasta ragù culinary tour" },
    { title: "Hoi An", location: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "hoi an vietnam cooking class noodles" },
    { title: "Las Vegas", location: "Nevada, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "las vegas celebrity chef restaurants" },
    { title: "New Haven", location: "Connecticut, USA", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", query: "new haven pizza connecticut culinary" },
    { title: "Mumbai", location: "India", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "mumbai india street food chaat spices" },
    { title: "Singapore", location: "Singapore", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "singapore hawker stalls chili crab" },
    { title: "Philadelphia", location: "Pennsylvania, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "philadelphia cheesesteak local eats" },
    { title: "Boston", location: "Massachusetts, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "boston clam chowder lobster rolls" },
    { title: "Tuscany", location: "Italy", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "tuscany italy wine olive oil food tour" },
    { title: "Melbourne", location: "Australia", imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop", query: "melbourne australia coffee brunch food" },
    { title: "Atlanta", location: "Georgia, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "atlanta southern comfort food" },
    { title: "Bali", location: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "bali indonesia vegan tropical food" },
    { title: "Copenhagen", location: "Denmark", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "copenhagen michelin nordic cuisine" },
    { title: "Amman", location: "Jordan", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "amman jordan middle eastern street food" },
    { title: "Houston", location: "Texas, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "houston tex mex barbecue fusion food" },
    { title: "Sao Paulo", location: "Brazil", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "sao paulo brazil feijoada street eats" },
    { title: "Tel Aviv", location: "Israel", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "tel aviv israel hummus food market" },
    { title: "Nashville", location: "Tennessee, USA", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "nashville hot chicken soul food" },
    { title: "Vancouver", location: "British Columbia, Canada", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "vancouver canada seafood sushi food tour" },
    { title: "Cape Town", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "cape town south africa food wine" },
    { title: "Havana", location: "Cuba", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "havana cuba local food paladar" },
    { title: "Quebec City", location: "Quebec, Canada", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "quebec city maple poutine food culture" },
    { title: "Kyoto", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop", query: "kyoto japan kaiseki traditional cuisine" },
    { title: "Delhi", location: "India", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", query: "delhi india street food chole bhature" }
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
                e.currentTarget.src = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop`;
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