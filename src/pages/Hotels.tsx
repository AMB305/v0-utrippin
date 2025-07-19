
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import styles from "../styles/hotels.module.css";
import { featuredStays, popularDestinations } from "../config/hotels";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, Star, MessageCircle, Clock, Globe2, MapPin, DollarSign } from "lucide-react";
import { BackToTop } from '@/components/BackToTop';
import ExpediaWidget from "@/components/ExpediaWidget";

// Import the city images
import washingtonDC from "@/assets/washington-dc.jpg";
import newYorkCity from "@/assets/new-york-city.jpg";
import nashville from "@/assets/nashville.jpg";
import atlanta from "@/assets/atlanta.jpg";

export default function HotelOriginal() {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    // Fade-in animations on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in").forEach((el) => {
      el.classList.add("opacity-0", "translate-y-4", "transition", "duration-700");
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  return (
    <>
      <SEOHead 
        title="Best Hotel Deals & Booking Online | Utrippin.ai"
        description="Discover top hotel deals worldwide with Utrippin.ai. Curated stays, popular destinations, and secure bookings with partner hotels. Best prices guaranteed."
        canonical="https://utrippin.ai/hotels"
        keywords="hotel booking, cheap hotels, hotel deals, accommodation, luxury hotels, budget hotels"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://utrippin.ai"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Hotels",
                  "item": "https://utrippin.ai/hotels"
                }
              ]
            },
            {
              "@type": "TravelAgency",
              "name": "Utrippin.ai",
              "url": "https://utrippin.ai/hotels",
              "description": "Book hotels worldwide with Utrippin.ai. Partnered with Hotels.com and Expedia for secure, optimized bookings.",
              "brand": "Utrippin.ai",
              "serviceType": "Hotel Booking",
              "areaServed": "Worldwide"
            },
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/hotels#webpage",
              "url": "https://utrippin.ai/hotels",
              "name": "Best Hotel Deals & Booking Online | Utrippin.ai",
              "description": "Discover top hotel deals worldwide with Utrippin.ai. Curated stays, popular destinations, and secure bookings with partner hotels. Best prices guaranteed.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />

      <div className="text-foreground">
        {/* Enhanced Header with Parallax Background */}
        <section className={`${styles.container} text-center pt-16 pb-4 md:pt-24 md:pb-6`}>
          <div className="max-w-3xl mx-auto relative z-10 px-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
              Soon, you'll be trippin!
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 mb-8">
              Book with confidence through our exclusive Expedia partnership.
            </p>
            <div className="mt-8">
              <ExpediaWidget />
            </div>
          </div>
        </section>

        {/* Trust Statistics Section */}
        <section className="max-w-7xl mx-auto py-12 sm:py-16 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="fade-in">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=40&h=40&fit=crop&crop=face" alt="Major hotel booking partner logo" className="w-8 h-8 rounded" />
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=40&h=40&fit=crop&crop=face" alt="Leading travel platform brand logo" className="w-8 h-8 rounded" />
                <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=40&h=40&fit=crop&crop=face" alt="Trusted hotel comparison site logo" className="w-8 h-8 rounded" />
                <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=40&h=40&fit=crop&crop=face" alt="International hotel chain partner logo" className="w-8 h-8 rounded" />
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=40&h=40&fit=crop&crop=face" alt="Premium accommodation booking service logo" className="w-8 h-8 rounded" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Save when you compare</h3>
              <p className="text-muted-foreground">More deals. More sites. One search</p>
            </div>
            
            <div className="fade-in">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=40&h=40&fit=crop&crop=face" alt="Happy traveler profile photo from recent hotel review" className="w-10 h-10 rounded-full" />
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=40&h=40&fit=crop&crop=face" alt="Satisfied customer profile photo from hotel booking experience" className="w-10 h-10 rounded-full" />
                <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=40&h=40&fit=crop&crop=face" alt="Verified traveler profile photo from positive hotel stay review" className="w-10 h-10 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">41,000,000+</h3>
              <p className="text-muted-foreground">searches this week</p>
            </div>
            
            <div className="fade-in">
              <div className="flex items-center justify-center gap-1 mb-4">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Travelers love us</h3>
              <p className="text-muted-foreground">1M+ ratings on our app</p>
            </div>
          </div>
        </section>

        {/* Travel Deals Section */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold text-foreground">Travel deals under $97</h2>
            <a href="#" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1">
              Explore more →
            </a>
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            *Sample deals based on recent data. Prices subject to change and may vary by dates.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={washingtonDC}
                  alt="Washington D.C. skyline with monuments and federal buildings"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-foreground mb-1">Washington, D.C.</h3>
                <p className="text-sm text-muted-foreground mb-1">2h 49m, non-stop</p>
                <p className="text-sm text-muted-foreground mb-3">Fri 8/22 • Mon 8/25</p>
                <p className="text-lg font-bold text-foreground">from $48</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={newYorkCity}
                  alt="New York City skyline with Manhattan skyscrapers and iconic landmarks"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-foreground mb-1">New York</h3>
                <p className="text-sm text-muted-foreground mb-1">3h 17m, non-stop</p>
                <p className="text-sm text-muted-foreground mb-3">Wed 8/27 • Sat 8/30</p>
                <p className="text-lg font-bold text-foreground">from $73</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={nashville}
                  alt="Nashville Tennessee downtown skyline with music venues and attractions"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-foreground mb-1">Nashville</h3>
                <p className="text-sm text-muted-foreground mb-1">2h 22m, non-stop</p>
                <p className="text-sm text-muted-foreground mb-3">Thu 8/14 • Sun 8/17</p>
                <p className="text-lg font-bold text-foreground">from $74</p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={atlanta}
                  alt="Atlanta Georgia downtown business district with modern skyscrapers"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-foreground mb-1">Atlanta</h3>
                <p className="text-sm text-muted-foreground mb-1">2h 18m, non-stop</p>
                <p className="text-sm text-muted-foreground mb-3">Thu 8/7 • Sun 8/10</p>
                <p className="text-lg font-bold text-foreground">from $78</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* For Travel Pros Section */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12">For travel pros</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                UTrippin.ai <Badge variant="secondary" className="ml-1">BETA</Badge>
              </h3>
              <p className="text-muted-foreground">Get travel questions answered</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Best Time to Travel</h3>
              <p className="text-muted-foreground">Know when to save</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <Globe2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Explore</h3>
              <p className="text-muted-foreground">See destinations on your budget</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Trips</h3>
              <p className="text-muted-foreground">Keep all your plans in one place</p>
            </Card>
          </div>
        </section>

        {/* Search by Destination Section */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4">Search for places to stay by destination</h2>
          <p className="text-lg text-muted-foreground mb-2">Find Accommodations</p>
          
          <div className="mb-8">
            <p className="text-muted-foreground mb-6">
              Can I really save on places to stay near me and lodging in other popular destinations by using UTrippin? Yes! UTrippin searches for accommodation deals on hundreds of accommodation comparison sites to help you find deals on{" "}
              <a href="#" className="text-primary hover:underline">hotels</a>,{" "}
              <a href="#" className="text-primary hover:underline">vacation rentals</a> and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Las Vegas Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Boston Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Paris Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Amsterdam Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Washington, D.C. Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Barcelona Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  San Francisco Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="py-2">
                <a href="#" className="text-foreground hover:text-primary">United States Hotels</a>
              </div>
              <div className="py-2">
                <a href="#" className="text-foreground hover:text-primary">Iceland Hotels</a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  New York Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  London Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Los Angeles Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Orlando Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <Link 
                  to="/hotels/miami" 
                  className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary block"
                >
                  Miami Hotels
                  <span>→</span>
                </Link>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Honolulu Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Ocean City Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="py-2">
                <a href="#" className="text-foreground hover:text-primary">Japan Hotels</a>
              </div>
              <div className="py-2">
                <a href="#" className="text-foreground hover:text-primary">Turks and Caicos Islands Hotels</a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Chicago Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  San Diego Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Seattle Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Nashville Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Key West Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Tokyo Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="border-b pb-2">
                <button className="w-full text-left flex justify-between items-center py-2 text-foreground hover:text-primary">
                  Myrtle Beach Hotels
                  <span>⌄</span>
                </button>
              </div>
              <div className="py-2">
                <a href="#" className="text-foreground hover:text-primary">Aruba Hotels</a>
              </div>
              <div className="py-2">
                <a href="#" className="text-foreground hover:text-primary">Canada Hotels</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      <BackToTop />
    </>
  );
}
