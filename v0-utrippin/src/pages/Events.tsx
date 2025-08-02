import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { buildHotelUrl } from "@/utils/buildAffiliateUrl.js";

const events = [
  {
    name: "Essence Festival",
    location: "New Orleans, USA",
    coordinates: { lng: -90.0715, lat: 29.9511 },
    date: "July every year",
    description: "The largest celebration of African American culture and music in the United States",
    destinationQuery: "New%20Orleans",
  },
  {
    name: "Afrochella",
    location: "Accra, Ghana", 
    coordinates: { lng: -0.186964, lat: 5.603717 },
    date: "December every year",
    description: "Africa's premier multi-cultural festival celebrating contemporary African culture",
    destinationQuery: "Accra",
  },
  {
    name: "Carnival",
    location: "Rio de Janeiro, Brazil",
    coordinates: { lng: -43.1729, lat: -22.9068 },
    date: "February every year", 
    description: "The world's largest carnival celebration with samba parades and street parties",
    destinationQuery: "Rio%20de%20Janeiro",
  },
  {
    name: "Notting Hill Carnival",
    location: "London, UK",
    coordinates: { lng: -0.2057, lat: 51.5095 },
    date: "August every year",
    description: "Europe's largest street festival celebrating Caribbean culture",
    destinationQuery: "London",
  },
  {
    name: "Roots Picnic",
    location: "Philadelphia, USA", 
    coordinates: { lng: -75.1652, lat: 39.9526 },
    date: "June every year",
    description: "Hip-hop festival curated by The Roots featuring music, food, and culture",
    destinationQuery: "Philadelphia",
  },
];

export default function Events() {
  const [mapboxToken, setMapboxToken] = useState<string>("");

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data } = await supabase.functions.invoke('get-mapbox-token');
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    fetchMapboxToken();
  }, []);

  const getMapUrl = (lng: number, lat: number) => {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},12,0/600x300?access_token=${mapboxToken}`;
  };


  return (
    <>
      <SEOHead 
        title="Black Culture Events & Festivals Worldwide | Utrippin.ai"
        description="Discover upcoming Black culture events worldwide. From Essence Festival to Afrochella, plan your cultural journey and book your stay. Find the best travel deals for cultural festivals."
        canonical="https://utrippin.ai/events"
        keywords="black culture events, essence festival, afrochella, carnival, notting hill carnival, cultural festivals, music festivals"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EventSeries",
              "name": "Black Culture Events Worldwide",
              "description": "Annual cultural festivals and events celebrating Black excellence worldwide",
              "url": "https://utrippin.ai/events"
            },
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/events#webpage",
              "url": "https://utrippin.ai/events",
              "name": "Black Culture Events & Festivals Worldwide | Utrippin.ai",
              "description": "Discover upcoming Black culture events worldwide. From Essence Festival to Afrochella, plan your cultural journey and book your stay.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <section className="py-16 px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Upcoming Black Culture Events
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Festivals, carnivals, music events and gatherings celebrating Black excellence worldwide. 
              Plan your trip and secure your stay!
            </p>
          </div>

          <div className="space-y-12">
            {events.map((event, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {event.name}
                    </h2>
                    <p className="text-xl text-muted-foreground mb-4">
                      {event.location}
                    </p>
                    <p className="text-primary font-semibold mb-4">
                      {event.date}
                    </p>
                    <p className="text-muted-foreground mb-6">
                      {event.description}
                    </p>
                    <a
                      href={buildHotelUrl({ destination: event.destinationQuery.replace('%20', ' ') })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                    >
                      Book Hotels in {event.location.split(',')[0]}
                    </a>
                  </div>
                  
                  <div className="order-first md:order-last">
                    {mapboxToken ? (
                      <img
                        src={getMapUrl(event.coordinates.lng, event.coordinates.lat)}
                        alt={`Map of ${event.location}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-center px-4">
                          Loading map preview...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
      
      <Footer />
    </>
  );
}
