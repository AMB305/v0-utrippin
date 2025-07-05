import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="max-w-7xl mx-auto">
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center px-3 py-2 rounded-full">
              <img 
                src="/UTrippin_Logo_new.png"
                alt="UTrippin Logo"
                className="h-10 w-auto bg-transparent"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-2 text-sm">
              <li><Link to="/hotels" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Hotels</Link></li>
              <li><Link to="/cars" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Cars</Link></li>
              <li><Link to="/flights" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Flights</Link></li>
              <li><Link to="/packages" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Packages</Link></li>
              <li><Link to="/cruises" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Cruises</Link></li>
              <li><Link to="/experiences" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Experiences</Link></li>
              <li><Link to="/deals" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors">Deals</Link></li>
              <li><Link to="/ai-travel" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors font-medium">🤖 AI Travel</Link></li>
              <li><Link to="/travel-buddy" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors font-medium">🧑‍🤝‍🧑 Find Buddies</Link></li>
              <li><Link to="/travel-planner" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 hover:text-[#0068EF] transition-colors font-medium">📋 My Trips</Link></li>
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0068EF]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Right side - User actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                    {user.firstName?.[0] || 'U'}
                  </div> 
                  <span className="text-gray-700">{user.firstName}</span>
                </button>
                <button 
                  onClick={logout}
                  className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-700">Sign In</div>
                  <div className="text-[#003C8A] font-bold text-xs uppercase">Join VIP</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              <Link to="/hotels" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Hotels</Link>
              <Link to="/cars" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Cars</Link>
              <Link to="/flights" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Flights</Link>
              <Link to="/packages" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Packages</Link>
              <Link to="/cruises" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Cruises</Link>
              <Link to="/experiences" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Experiences</Link>
              <Link to="/deals" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>Deals</Link>
              <Link to="/ai-travel" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors font-medium" onClick={() => setIsOpen(false)}>🤖 AI Travel</Link>
              <Link to="/travel-buddy" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors font-medium" onClick={() => setIsOpen(false)}>🧑‍🤝‍🧑 Find Buddies</Link>
              <Link to="/travel-matches" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors" onClick={() => setIsOpen(false)}>💕 Your Matches</Link>
              <Link to="/travel-planner" className="block py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors font-medium" onClick={() => setIsOpen(false)}>📋 My Trips</Link>
              
              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        {user.firstName?.[0] || 'U'}
                      </div>
                      <span className="text-gray-700">{user.firstName}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button className="block w-full text-left py-2 text-[#001E3C] hover:text-[#0068EF] transition-colors">
                    Sign In / Join VIP
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}