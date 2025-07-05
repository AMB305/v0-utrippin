import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/UTrippin_Logo_3000px_clean.png"
            alt="UTrippin Logo"
            className="h-8 w-auto max-w-[160px] transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback to text logo if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="text-[#0068EF] font-bold text-xl" style={{ display: 'none' }}>
            UTrippin
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium text-[#001E3C]">
          <Link to="/hotels" className="hover:text-[#0068EF] transition-colors">Hotels</Link>
          <Link to="/cars" className="hover:text-[#0068EF] transition-colors">Cars</Link>
          <Link to="/flights" className="hover:text-[#0068EF] transition-colors">Flights</Link>
          <Link to="/packages" className="hover:text-[#0068EF] transition-colors">Packages</Link>
          <Link to="/cruises" className="hover:text-[#0068EF] transition-colors">Cruises</Link>
          <Link to="/experiences" className="hover:text-[#0068EF] transition-colors">Experiences</Link>
          <Link to="/deals" className="hover:text-[#0068EF] transition-colors">Deals</Link>
          <Link to="/ai-travel" className="hover:text-[#0068EF] transition-colors">🤖 AI Travel</Link>
          <Link to="/travel-buddy" className="hover:text-[#0068EF] transition-colors">🧑‍🤝‍🧑 Find Buddies</Link>
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
            <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            <div className="text-left">
              <div className="text-xs text-gray-700">Sign In</div>
              <div className="text-[#003C8A] font-bold text-xs uppercase">Join VIP</div>
            </div>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0068EF]"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-4 pt-2 pb-4 space-y-2">
          <Link to="/hotels" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Hotels</Link>
          <Link to="/cars" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Cars</Link>
          <Link to="/flights" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Flights</Link>
          <Link to="/packages" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Packages</Link>
          <Link to="/cruises" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Cruises</Link>
          <Link to="/experiences" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Experiences</Link>
          <Link to="/deals" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>Deals</Link>
          <Link to="/ai-travel" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>🤖 AI Travel</Link>
          <Link to="/travel-buddy" className="block py-2 text-[#001E3C] hover:text-[#0068EF]" onClick={() => setIsOpen(false)}>🧑‍🤝‍🧑 Find Buddies</Link>
          
          {/* Mobile User Actions */}
          <div className="border-t pt-4 mt-4">
            <button className="w-full bg-white border-2 border-gray-300 rounded-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-700">Sign In</div>
                <div className="text-[#003C8A] font-bold text-xs uppercase">Join VIP</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}