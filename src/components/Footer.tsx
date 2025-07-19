
import UtrippinLogo from "@/components/UtrippinLogo";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Rss } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Legal, Privacy, & Copyright", href: "/legal" }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Rss, label: "RSS" },
    { icon: Youtube, label: "YouTube" },
    { icon: Instagram, label: "Instagram" },
    { icon: Linkedin, label: "LinkedIn" }
  ];

  return (
    <footer className="border-t bg-travel-navy border-travel-navy/20">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Layout - Stacked */}
        <div className="block md:hidden space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <UtrippinLogo />
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-white hover:text-white/90 transition-colors duration-300 text-sm font-medium uppercase tracking-wider text-center"
                style={{ color: '#ffffff' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-white/60 text-sm text-center">
            © 2025 UTrippin. All rights reserved.
          </div>
        </div>

        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden md:grid grid-cols-3 items-center py-6">
          {/* Left side - Navigation Links */}
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-white hover:text-white/90 transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                style={{ color: '#ffffff' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <UtrippinLogo />
          </div>

          {/* Right side - Copyright */}
          <div className="text-white/60 text-sm text-right">
            © 2025 UTrippin. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
