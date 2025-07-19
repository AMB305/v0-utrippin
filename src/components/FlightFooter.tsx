import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const FlightFooter = () => {
  return (
    <footer className="bg-travel-navy text-white">
      
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Get Exclusive Flight Deals</h2>
            <p className="text-white/80 mb-6">
              Subscribe to our newsletter and be the first to know about special offers, price drops, and travel tips.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-travel-gold"
              />
              <Button className="bg-travel-gold hover:bg-travel-gold/90 text-travel-navy font-semibold px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-travel-gold rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-travel-navy" />
              </div>
              <span className="text-xl font-bold">UTrippin</span>
            </div>
            <p className="text-white/80 text-sm">
              Your trusted partner for finding the best flight deals worldwide. 
              We compare millions of flights to get you the perfect journey at the best price.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="w-4 h-4" />
                <span>1-800-FLY-NOW (24/7)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Mail className="w-4 h-4" />
                <span>support@skysearch.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="w-4 h-4" />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Search Flights", href: "/flights" },
                { label: "My Bookings", href: "/bookings" },
                { label: "Flight Status", href: "/flight-status" },
                { label: "Check-in", href: "/check-in" },
                { label: "Travel Guides", href: "/guides" },
                { label: "Mobile App", href: "/app" }
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm text-white/80 hover:text-travel-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Customer Support</h3>
            <div className="space-y-2">
              {[
                { label: "Help Center", href: "/help" },
                { label: "Contact Us", href: "/contact" },
                { label: "Booking Assistance", href: "/booking-help" },
                { label: "Refunds", href: "/refunds" },
                { label: "Travel Insurance", href: "/insurance" },
                { label: "Special Assistance", href: "/special-assistance" }
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm text-white/80 hover:text-travel-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="font-semibold mb-4">Popular Destinations</h3>
            <div className="space-y-2">
              {[
                { label: "Flights to New York", href: "/flights/nyc" },
                { label: "Flights to London", href: "/flights/london" },
                { label: "Flights to Paris", href: "/flights/paris" },
                { label: "Flights to Tokyo", href: "/flights/tokyo" },
                { label: "Flights to Dubai", href: "/flights/dubai" },
                { label: "View All Destinations", href: "/destinations" }
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm text-white/80 hover:text-travel-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-sm text-white/60">
              © 2024 UTrippin. All rights reserved. | 
              <Link to="/privacy" className="hover:text-travel-gold ml-1">Privacy Policy</Link> | 
              <Link to="/terms" className="hover:text-travel-gold ml-1">Terms of Service</Link> | 
              <Link to="/cookies" className="hover:text-travel-gold ml-1">Cookie Policy</Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">Follow us:</span>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:text-travel-gold hover:bg-white/10">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:text-travel-gold hover:bg-white/10">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:text-travel-gold hover:bg-white/10">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:text-travel-gold hover:bg-white/10">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FlightFooter;