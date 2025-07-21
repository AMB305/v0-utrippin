import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import UtrippinLogo from './UtrippinLogo';

const LuxuryNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Flights', href: '/flights' },
    { name: 'Hotels', href: '/hotels' },
    { name: 'Cars', href: '/cars' },
    { name: 'Packages', href: '/packages' },
    { name: 'Cruises', href: '/cruises' },
    { name: 'AI Travel Buddy', href: '/ai-travel' },
    { name: 'Melanin & Trippin', href: '/melanin' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <UtrippinLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white font-light hover:text-gray-300 transition-colors duration-300 text-sm tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-sm rounded-lg mt-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-3 text-white font-light hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default LuxuryNav; 