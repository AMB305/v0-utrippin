import React from 'react';
import { Mountain, Leaf, Landmark, Utensils } from 'lucide-react';
import { DestinationPageData, MonthData, PopularFeature } from '@/components/destination/DestinationPageTemplate';

// Default weather data for destinations that don't have specific weather data
const defaultWeatherData: MonthData[] = [
  { month: 'Jan', temp: '20/30°C', aqi: '45', icon: 'sun' },
  { month: 'Feb', temp: '21/31°C', aqi: '42', icon: 'sun' },
  { month: 'Mar', temp: '23/33°C', aqi: '40', icon: 'sun' },
  { month: 'Apr', temp: '25/35°C', aqi: '38', icon: 'sun' },
  { month: 'May', temp: '26/36°C', aqi: '35', icon: 'cloud' },
  { month: 'Jun', temp: '25/34°C', aqi: '32', icon: 'cloud-rain', highlight: true },
  { month: 'Jul', temp: '24/32°C', aqi: '30', icon: 'cloud-rain', highlight: true },
  { month: 'Aug', temp: '24/32°C', aqi: '32', icon: 'cloud-rain', highlight: true },
  { month: 'Sep', temp: '25/33°C', aqi: '35', icon: 'cloud-rain', highlight: true },
  { month: 'Oct', temp: '23/32°C', aqi: '38', icon: 'sun' },
  { month: 'Nov', temp: '21/30°C', aqi: '42', icon: 'sun' },
  { month: 'Dec', temp: '20/29°C', aqi: '45', icon: 'sun' },
];

const defaultPopularFeatures: PopularFeature[] = [
  { name: 'Scenic Beauty', icon: Mountain },
  { name: 'Cultural Sites', icon: Landmark },
  { name: 'Local Cuisine', icon: Utensils },
  { name: 'Natural Attractions', icon: Leaf },
];

/**
 * Converts existing destination data from the database to the new template format
 */
export const adaptDestinationToTemplate = (
  destination: any,
  activities: any[] = [],
  attractions: any[] = [],
  tips: any[] = []
): DestinationPageData => {
  // Convert activities to template format
  const adaptedActivities = activities.map(activity => ({
    title: activity.title || activity.name || 'Activity',
    description: activity.description || 'Enjoy this amazing activity',
    image: activity.image_url || `https://placehold.co/400x300/10B981/FFFFFF?text=${encodeURIComponent(activity.title || 'Activity')}`
  }));

  // Convert attractions to template format
  const adaptedAttractions = attractions.map(attraction => ({
    name: attraction.name || 'Attraction',
    rating: attraction.rating || 4.5,
    description: attraction.description || 'A must-visit attraction',
    image: attraction.image_url || `https://placehold.co/400x300/F59E0B/FFFFFF?text=${encodeURIComponent(attraction.name || 'Attraction')}`
  }));

  // Generate default hotels (can be replaced with real data later)
  const defaultHotels = [
    {
      name: `Hotel ${destination.name}`,
      rating: 4.5,
      location: destination.name,
      price: '$150/night',
      image: `https://placehold.co/400x300/10B981/FFFFFF?text=Hotel+1`
    },
    {
      name: `Resort ${destination.name}`,
      rating: 4.2,
      location: destination.name,
      price: '$200/night',
      image: `https://placehold.co/400x300/F59E0B/FFFFFF?text=Hotel+2`
    }
  ];

  // Generate default restaurants
  const defaultRestaurants = [
    {
      name: `Local Restaurant`,
      rating: 4.3,
      cuisine: 'Local Cuisine',
      image: `https://placehold.co/400x300/DC2626/FFFFFF?text=Restaurant+1`
    },
    {
      name: `Fine Dining`,
      rating: 4.6,
      cuisine: 'International',
      image: `https://placehold.co/400x300/3B82F6/FFFFFF?text=Restaurant+2`
    }
  ];

  // Convert tips to FAQ format
  const faqs = tips.map(tip => ({
    question: tip.title || 'Travel Tip',
    content: React.createElement('p', { className: 'text-sm text-gray-700' }, tip.content || 'Helpful travel information.')
  }));

  // Add default FAQ if none exist
  if (faqs.length === 0) {
    faqs.push({
      question: `What is the best time to visit ${destination.name}?`,
      content: React.createElement('p', { className: 'text-sm text-gray-700' }, `The best time to visit ${destination.name} depends on your preferences for weather and activities. Generally, the highlighted months in the weather chart above offer the most pleasant conditions.`)
    });
  }

  return {
    // Hero data
    destination: destination.name || 'Beautiful Destination',
    country: destination.country || 'Unknown Country',
    description: destination.description || `Discover the beauty and wonder of ${destination.name}`,
    temperature: '25°C',
    aqi: '40',
    heroImage: destination.hero_image_url || `https://placehold.co/1200x500/10B981/FFFFFF?text=${encodeURIComponent(destination.name)}`,
    
    // Weather data
    monthsData: defaultWeatherData,
    bestTimeToVisit: 'June-September',
    
    // Content data
    popularFeatures: defaultPopularFeatures,
    tripDuration: '2-3 days',
    tripDescription: `A perfect ${destination.name} getaway allows you to explore the main attractions, experience local culture, and enjoy the natural beauty of the region.`,
    
    // Card data
    hotels: defaultHotels,
    activities: adaptedActivities.length > 0 ? adaptedActivities : [
      {
        title: 'Sightseeing',
        description: 'Explore the beautiful sights',
        image: 'https://placehold.co/400x300/10B981/FFFFFF?text=Sightseeing'
      }
    ],
    attractions: adaptedAttractions.length > 0 ? adaptedAttractions : [
      {
        name: 'Main Attraction',
        rating: 4.5,
        description: 'The most popular attraction',
        image: 'https://placehold.co/400x300/F59E0B/FFFFFF?text=Attraction'
      }
    ],
    restaurants: defaultRestaurants,
    
    // Q&A data
    faqs
  };
};

/**
 * Creates empty template data for new destinations
 */
export const createEmptyDestinationTemplate = (name: string): DestinationPageData => {
  return adaptDestinationToTemplate({
    name,
    country: 'Country',
    description: `Discover the amazing ${name}`,
  });
};