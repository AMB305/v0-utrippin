
import React, { useState } from 'react';
import UtrippinLogo from "@/components/UtrippinLogo";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Trips", href: "/deals" },
    { name: "AI Travel Buddy", href: "/ai-travel" },
    { name: "The Melanin Compass", href: "/melanin" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Support", href: "/support" }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/utrippin" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/utrippin" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/utrippin" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/utrippin" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Stay Connected */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">STAY CONNECTED</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Join our community for exclusive travel deals and AI-powered tips.
            </p>
            
            {/* Newsletter Signup */}
            <form onSubmit={handleNewsletterSignup} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-none text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                required
              />
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-medium tracking-wider uppercase rounded-none"
              >
                Sign-Up
              </Button>
            </form>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Our Mission */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">OUR MISSION</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              We believe in making travel accessible to everyone. Through innovative AI and expert guidance, 
              we're democratizing travel one trip at a time.
            </p>
            <div className="pt-4">
              <UtrippinLogo />
            </div>
          </div>

          {/* Column 3: Navigate */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">NAVIGATE</h3>
            <div className="grid grid-cols-2 gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Utrippin
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
