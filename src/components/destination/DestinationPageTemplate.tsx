import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, Mountain, Leaf, Landmark, Utensils } from 'lucide-react';
import { DestinationHero } from './DestinationHero';
import { WeatherStrip } from './WeatherStrip';
import { HorizontalCardScroll } from './HorizontalCardScroll';
import { CollapsibleSection } from './CollapsibleSection';
import { StarRating } from './StarRating';

// Data interfaces
export interface HotelData {
  name: string;
  rating: number;
  location: string;
  price: string;
  image: string;
}

export interface ActivityData {
  title: string;
  description: string;
  image: string;
}

export interface AttractionData {
  name: string;
  rating: number;
  description: string;
  image: string;
}

export interface RestaurantData {
  name: string;
  rating: number;
  cuisine: string;
  image: string;
}

export interface MonthData {
  month: string;
  temp: string;
  aqi: string;
  icon: 'sun' | 'cloud' | 'cloud-rain';
  highlight?: boolean;
}

export interface PopularFeature {
  name: string;
  icon: React.ComponentType<any>;
}

export interface DestinationPageData {
  // Hero data
  destination: string;
  country: string;
  description: string;
  temperature: string;
  aqi: string;
  heroImage: string;
  
  // Weather data
  monthsData: MonthData[];
  bestTimeToVisit: string;
  
  // Content data
  popularFeatures: PopularFeature[];
  tripDuration: string;
  tripDescription: string;
  
  // Card data
  hotels: HotelData[];
  activities: ActivityData[];
  attractions: AttractionData[];
  restaurants: RestaurantData[];
  
  // Q&A data
  faqs: Array<{
    question: string;
    content: React.ReactNode;
  }>;
}

interface DestinationPageTemplateProps {
  data: DestinationPageData;
  onCreateTripWithAI?: () => void;
  onBookFlight?: () => void;
}

export const DestinationPageTemplate: React.FC<DestinationPageTemplateProps> = ({
  data,
  onCreateTripWithAI,
  onBookFlight
}) => {
  const tabs = ['Overview', 'Places to Stay', 'Things to Do', 'How to Reach', 'More'];
  const [activeTab, setActiveTab] = React.useState('Overview');

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <DestinationHero
          destination={data.destination}
          country={data.country}
          description={data.description}
          temperature={data.temperature}
          aqi={data.aqi}
          imageUrl={data.heroImage}
        />

        {/* Navigation Tabs and AI Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border border-gray-300 ${
                  tab === activeTab 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-700'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onCreateTripWithAI}
            className="mt-4 md:mt-0 px-6 py-2 rounded-full text-white bg-orange-500 shadow-md flex items-center gap-2"
          >
            Create trip with AI
          </motion.button>
        </div>

        {/* Weather Strip */}
        <WeatherStrip
          destination={data.destination}
          monthsData={data.monthsData}
          bestTimeToVisit={data.bestTimeToVisit}
        />

        {/* Info Cards Section */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl shadow-md p-4">
            <CardContent className="p-2">
              <h3 className="text-lg font-semibold mb-2">{data.destination} is popular for</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                {data.popularFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <feature.icon size={16} />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-4 md:col-span-2">
            <CardContent className="p-2">
              <h3 className="text-lg font-semibold mb-1">Usual trip duration</h3>
              <p className="text-2xl font-bold text-gray-800 mb-2">{data.tripDuration}</p>
              <p className="text-sm text-gray-700">{data.tripDescription}</p>
            </CardContent>
          </Card>
        </div>

        {/* Hotels & Tents Section */}
        <HorizontalCardScroll title="Hotels & Tents" showViewAll>
          {data.hotels.map((hotel, index) => (
            <Card key={index} className="flex-none w-64 md:w-80 rounded-2xl shadow-md overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={hotel.rating} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={14} />
                    {hotel.location}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xl font-bold text-gray-800">{hotel.price}</span>
                  <Button variant="ghost" className="text-orange-500">
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </HorizontalCardScroll>

        {/* Places to Visit Section */}
        <HorizontalCardScroll 
          title="Places to Visit" 
          tags={['Museum', 'Mountain', 'Wildlife', 'Historical', 'Nature']}
        >
          {data.attractions.map((place, index) => (
            <Card key={index} className="flex-none w-64 md:w-80 rounded-2xl shadow-md overflow-hidden relative">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 p-4 flex flex-col justify-end">
                <div className="flex items-center text-white text-sm bg-black bg-opacity-60 px-2 py-1 rounded-full w-max mb-2">
                  <StarRating rating={place.rating} />
                </div>
                <h3 className="text-lg font-semibold text-white">{place.name}</h3>
                <p className="text-sm text-gray-200">{place.description}</p>
              </div>
            </Card>
          ))}
        </HorizontalCardScroll>

        {/* Places to Eat Section */}
        <HorizontalCardScroll title="Places to Eat" showViewAll>
          {data.restaurants.map((place, index) => (
            <Card key={index} className="flex-none w-64 md:w-80 rounded-2xl shadow-md overflow-hidden">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold">{place.name}</h3>
                  <p className="text-sm text-gray-500">{place.cuisine}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <StarRating rating={place.rating} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </HorizontalCardScroll>

        {/* Things to Do Section */}
        <HorizontalCardScroll title="Things to Do" showViewAll>
          {data.activities.map((item, index) => (
            <Card key={index} className="flex-none w-64 md:w-80 rounded-2xl shadow-md overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </HorizontalCardScroll>

        {/* More About Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">More About {data.destination}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, index) => (
              <CollapsibleSection key={index} title={faq.question}>
                {faq.content}
              </CollapsibleSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};