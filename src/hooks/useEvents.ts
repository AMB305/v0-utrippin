import { useState, useEffect } from 'react';

interface Event {
  id: string;
  name: string;
  location: string;
  start_date: string;
  description: string;
  tags: string[];
  image?: string;
  price?: number;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      
      // Mock data for demo purposes
      // In a real app, this would call your API or edge function
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const mockEvents: Event[] = [
        {
          id: '1',
          name: 'Barcelona Wine Fest',
          location: 'Barcelona, Spain',
          start_date: '2025-09-12',
          description: 'A vibrant wine & food festival by the sea.',
          tags: ['wine', 'foodie'],
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
          price: 150
        },
        {
          id: '2',
          name: 'Tokyo Jazz Nights',
          location: 'Tokyo, Japan',
          start_date: '2025-10-05',
          description: 'Live jazz through Shinjuku streets.',
          tags: ['music', 'nightlife'],
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
          price: 85
        },
        {
          id: '3',
          name: 'Iceland Aurora Hunt',
          location: 'Reykjavik, Iceland',
          start_date: '2025-11-20',
          description: 'Chasing northern lights on glacier jeeps.',
          tags: ['adventure', 'nature'],
          image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400',
          price: 280
        },
        {
          id: '4',
          name: 'New Orleans Gumbo Fest',
          location: 'New Orleans, USA',
          start_date: '2025-12-03',
          description: 'The best southern food and jazz.',
          tags: ['foodie', 'music'],
          image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
          price: 95
        },
        {
          id: '5',
          name: 'Sydney Harbour NYE',
          location: 'Sydney, Australia',
          start_date: '2025-12-31',
          description: 'World famous fireworks.',
          tags: ['nightlife', 'party'],
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          price: 200
        },
        {
          id: '6',
          name: 'Prague Christmas Markets',
          location: 'Prague, Czech Republic',
          start_date: '2025-12-15',
          description: 'Medieval streets & holiday spirit.',
          tags: ['culture', 'holiday'],
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          price: 45
        },
        {
          id: '7',
          name: 'Santorini Sunset Cruises',
          location: 'Santorini, Greece',
          start_date: '2026-06-15',
          description: 'Romantic boat tours at golden hour.',
          tags: ['romance', 'relax'],
          image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
          price: 120
        },
        {
          id: '8',
          name: 'Rio Carnival',
          location: 'Rio de Janeiro, Brazil',
          start_date: '2026-02-10',
          description: 'Samba parades, dancing all night.',
          tags: ['party', 'music'],
          image: 'https://images.unsplash.com/photo-1516306580123-e6036e65b98f?w=400',
          price: 175
        },
        {
          id: '9',
          name: 'Oktoberfest',
          location: 'Munich, Germany',
          start_date: '2025-09-20',
          description: 'Beers, pretzels & Bavarian bands.',
          tags: ['foodie', 'party'],
          image: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=400',
          price: 110
        },
        {
          id: '10',
          name: 'Kenya Safari',
          location: 'Nairobi, Kenya',
          start_date: '2026-07-10',
          description: 'Big 5 animal treks.',
          tags: ['adventure', 'nature'],
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
          price: 850
        }
      ];

      setEvents(mockEvents);
      setLoading(false);
    }

    fetchEvents();
  }, []);

  return { events, loading };
}
