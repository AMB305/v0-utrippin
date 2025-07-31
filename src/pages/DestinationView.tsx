import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DestinationPageTemplate, DestinationPageData } from '@/components/destination/DestinationPageTemplate';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { Mountain, Leaf, Landmark, Utensils } from 'lucide-react';

interface DestinationViewData {
  destination_id: string;
  slug: string;
  title: string;
  subtitle: string;
  overview: string;
  suggested_trip_duration: string;
  activities: any; // JSON data from database
  weather: any; // JSON data from database
  transport: any; // JSON data from database
  travel_tips: any; // JSON data from database
  photos: any; // JSON data from database
  best_time: string;
  best_time_notes: string;
}

const DestinationView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [destinationData, setDestinationData] = useState<DestinationViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!slug) {
        setError('No destination slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching destination data for slug:', slug);
        
        const { data, error: fetchError } = await supabase
          .from('full_destination_detail')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (fetchError) {
          console.error('Database error:', fetchError);
          throw fetchError;
        }

        if (!data) {
          console.log('No destination found for slug:', slug);
          setError('Destination not found');
          setLoading(false);
          return;
        }

        console.log('Raw destination data:', data);
        setDestinationData(data);
      } catch (err) {
        console.error('Error fetching destination data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch destination data');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationData();
  }, [slug]);

  const transformToTemplateData = (data: DestinationViewData): DestinationPageData => {
    // Safely parse JSON arrays
    const weatherArray = Array.isArray(data.weather) ? data.weather : [];
    const activitiesArray = Array.isArray(data.activities) ? data.activities : [];
    const transportArray = Array.isArray(data.transport) ? data.transport : [];
    const tipsArray = Array.isArray(data.travel_tips) ? data.travel_tips : [];
    const photosArray = Array.isArray(data.photos) ? data.photos : [];

    // Transform weather data
    const monthsData = weatherArray.map(w => ({
      month: w.month?.substring(0, 3) || 'Jan',
      temp: w.temperature || '25°C',
      aqi: w.aqi?.toString() || '40',
      icon: (w.aqi > 50 ? 'cloud' : (w.temperature?.includes('30') || w.temperature?.includes('35') ? 'sun' : 'cloud')) as 'sun' | 'cloud' | 'cloud-rain',
      highlight: ['Apr', 'May', 'Jun', 'Sep', 'Oct'].includes(w.month?.substring(0, 3) || '')
    }));

    // Transform activities
    const activities = activitiesArray.map(activity => ({
      title: activity.title || 'Activity',
      description: activity.description || 'Enjoy this amazing activity',
      image: `https://placehold.co/400x300/10B981/FFFFFF?text=${encodeURIComponent(activity.title || 'Activity')}`
    }));

    // Default hotels and restaurants (can be enhanced with real data later)
    const hotels = [
      {
        name: `Hotel ${data.title}`,
        rating: 4.5,
        location: data.title,
        price: '$150/night',
        image: 'https://placehold.co/400x300/10B981/FFFFFF?text=Hotel+1'
      },
      {
        name: `Resort ${data.title}`,
        rating: 4.2,
        location: data.title,
        price: '$200/night',
        image: 'https://placehold.co/400x300/F59E0B/FFFFFF?text=Hotel+2'
      }
    ];

    const restaurants = [
      {
        name: 'Local Restaurant',
        rating: 4.3,
        cuisine: 'Local Cuisine',
        image: 'https://placehold.co/400x300/DC2626/FFFFFF?text=Restaurant+1'
      },
      {
        name: 'Fine Dining',
        rating: 4.6,
        cuisine: 'International',
        image: 'https://placehold.co/400x300/3B82F6/FFFFFF?text=Restaurant+2'
      }
    ];

    const attractions = [
      {
        name: 'Main Attraction',
        rating: 4.5,
        description: 'The most popular attraction',
        image: 'https://placehold.co/400x300/F59E0B/FFFFFF?text=Attraction'
      }
    ];

    // Transform FAQs from travel tips and transport
    const faqs = [
      ...tipsArray.map(tip => ({
        question: tip.title || 'Travel Tip',
        content: React.createElement('p', { className: 'text-sm text-gray-700' }, tip.content || 'Helpful travel information.')
      })),
      ...(transportArray.length > 0 ? [{
        question: `How to reach ${data.title}?`,
        content: React.createElement('div', { className: 'text-sm text-gray-700' }, 
          transportArray.map((t, i) => 
            React.createElement('p', { key: i, className: 'mb-2' }, 
              React.createElement('strong', {}, (t.mode || 'Transport') + ': '), t.details || 'Details available'
            )
          )
        )
      }] : []),
      ...(data.best_time ? [{
        question: `What is the best time to visit ${data.title}?`,
        content: React.createElement('div', { className: 'text-sm text-gray-700' }, 
          React.createElement('p', { className: 'mb-2' }, `Best time: ${data.best_time}`),
          data.best_time_notes && React.createElement('p', {}, data.best_time_notes)
        )
      }] : [])
    ];

    const heroImage = photosArray.length > 0 
      ? photosArray[0]?.url 
      : `https://placehold.co/1200x500/10B981/FFFFFF?text=${encodeURIComponent(data.title)}`;

    return {
      destination: data.title,
      country: data.subtitle || 'Unknown Country',
      description: data.overview,
      temperature: monthsData.length > 0 ? monthsData[0].temp.split('/')[1] || '25°C' : '25°C',
      aqi: monthsData.length > 0 ? monthsData[0].aqi : '40',
      heroImage,
      monthsData,
      bestTimeToVisit: data.best_time || 'Year-round',
      popularFeatures: [
        { name: 'Scenic Beauty', icon: Mountain },
        { name: 'Cultural Sites', icon: Landmark },
        { name: 'Local Cuisine', icon: Utensils },
        { name: 'Natural Attractions', icon: Leaf },
      ],
      tripDuration: data.suggested_trip_duration || '2-3 days',
      tripDescription: `A perfect ${data.title} getaway allows you to explore the main attractions, experience local culture, and enjoy the beauty of the region.`,
      hotels,
      activities,
      attractions,
      restaurants,
      faqs
    };
  };

  const handleCreateTripWithAI = () => {
    navigate('/ai-travel');
  };

  const handleBookFlight = () => {
    navigate(`/flights?destination=${encodeURIComponent(destinationData?.title || '')}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !destinationData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Destination Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "Sorry, we couldn't find the destination you're looking for."}
          </p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const templateData = transformToTemplateData(destinationData);

  return (
    <>
      <SEOHead 
        title={`${destinationData.title}, ${destinationData.subtitle} - Travel Guide | Utrippin.ai`}
        description={`Discover ${destinationData.title}. ${destinationData.overview} Find flights, hotels, activities and travel tips for your perfect getaway.`}
        canonical={`https://utrippin.ai/destinations/${destinationData.slug}`}
        keywords={`${destinationData.title} travel, ${destinationData.subtitle} tourism, ${destinationData.title} attractions, ${destinationData.title} hotels, ${destinationData.title} flights`}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TouristDestination",
              "name": destinationData.title,
              "description": destinationData.overview,
              "url": `https://utrippin.ai/destinations/${destinationData.slug}`,
              "touristType": "leisure"
            },
            {
              "@type": "TravelGuide",
              "name": `${destinationData.title} Travel Guide`,
              "description": `Complete travel guide for ${destinationData.title}`,
              "about": {
                "@type": "Place",
                "name": destinationData.title
              }
            }
          ]
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <DestinationPageTemplate
          data={templateData}
          onCreateTripWithAI={handleCreateTripWithAI}
          onBookFlight={handleBookFlight}
        />
        <Footer />
      </div>
    </>
  );
};

export default DestinationView;