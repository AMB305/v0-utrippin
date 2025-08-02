// BACKUP OF ORIGINAL HOMEPAGE - Created before migration on 2025-07-23
// This is a complete backup of the original src/pages/Index.tsx file

import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SmartDestinationImage } from "@/components/SmartDestinationImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TravelCategories from "@/components/TravelCategories";
import RecommendedDestinations from "@/components/RecommendedDestinations";
import VirtualTravelSection from "@/components/VirtualTravelSection";
import TravelBuddySection from "@/components/TravelBuddySection";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import AITripPlanner from "@/components/AITripPlanner";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTracking } from "@/components/ScrollTracking";
import MelaninTrippin from "@/components/MelaninTrippin";
import { usePerformanceTracking } from "@/hooks/usePerformanceTracking";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { organizationSchema, websiteSchema, createLocalBusinessSchema } from "@/utils/structuredData";
import { BackToTop } from '@/components/BackToTop';
import MobileDestinationSlider from "@/components/MobileDestinationSlider";
import { buildHotelUrl, buildCarUrl, buildPackageUrl, buildCruiseUrl, buildFlightUrl } from '@/utils/buildAffiliateUrl';
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory';
import { format } from 'date-fns';

const Index = () => {
  usePerformanceTracking("Index");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [topDestinations, setTopDestinations] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { addSearchHistory } = useSearchHistory();

  useEffect(() => {
    const fetchTopDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("top_destinations")
          .select("*");

        if (error) {
          console.error("Error fetching top destinations:", error);
        } else {
          setTopDestinations(data);
        }
      } catch (error) {
        console.error("Error fetching top destinations:", error);
      }
    };

    fetchTopDestinations();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  const handleDestinationClick = (destination: any) => {
    const destinationName = destination.name;
    const destinationId = destination.id;
    addSearchHistory(destinationName, destinationId);

    navigate(`/destination/${destinationId}`);
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Melanin Travels",
    "url": "https://melanintravels.com",
    "logo": "https://melanintravels.com/assets/logo.png",
    "description": "Discover and book unique travel experiences with Melanin Travels. Find flights, hotels, tours, and more.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Anytown",
      "addressRegion": "CA",
      "postalCode": "91234",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": ["en"]
    },
    "sameAs": [
      "https://www.facebook.com/melanintravels",
      "https://www.instagram.com/melanintravels",
      "https://twitter.com/melanintravels"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Melanin Travels",
    "url": "https://melanintravels.com",
    "description": "Discover and book unique travel experiences with Melanin Travels. Find flights, hotels, tours, and more.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://melanintravels.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Melanin Travels",
    "image": "https://melanintravels.com/assets/logo.png",
    "@id": "https://melanintravels.com",
    "url": "https://melanintravels.com",
    "telephone": "+1-555-123-4567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Anytown",
      "addressRegion": "CA",
      "postalCode": "91234",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.052235,
      "longitude": -118.243683
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    }, {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "16:00"
    }],
    "sameAs": [
      "https://www.facebook.com/melanintravels",
      "https://www.instagram.com/melanintravels",
      "https://twitter.com/melanintravels"
    ]
  };

  return (
    <>
      <SEOHead
        title="Melanin Travels: Explore, Discover, and Book Unique Travel Experiences"
        description="Discover and book unique travel experiences with Melanin Travels. Find flights, hotels, tours, and more."
        keywords="travel, flights, hotels, tours, vacation, melanin, black travel, black travelers"
        schemaOrgOrganization={organizationData}
        schemaOrgWebsite={websiteData}
        schemaOrgLocalBusiness={createLocalBusinessSchema(localBusinessData)}
        canonicalUrl="https://melanintravels.com"
      />
      <ScrollTracking />
      <Header />
      <HeroSection />
      <AITripPlanner />
      <TravelCategories />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Recommended Destinations</h2>
        {isMobile ? (
          <MobileDestinationSlider destinations={topDestinations} onDestinationClick={handleDestinationClick} />
        ) : (
          <RecommendedDestinations destinations={topDestinations} onDestinationClick={handleDestinationClick} />
        )}
      </div>
      <VirtualTravelSection />
      <TravelBuddySection />
      <MelaninTrippin />
      <NewsletterSubscription />
      <BackToTop />
      <Footer />
    </>
  );
};

export default Index;
