import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <div className="flex gap-1">
            {"UTRIPPIN".split("").map((char, index) => (
              <div
                key={index}
                className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-white font-bold rounded-sm transition-all text-xs md:text-sm"
                style={{
                  backgroundColor: `hsl(${210 + index * 5}, 90%, 50%)`
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-4 ml-4 text-sm">
          <Link to="/hotels" className="hover:text-[#0068EF] transition-colors">Hotels</Link>
          <Link to="/cars" className="hover:text-[#0068EF] transition-colors">Cars</Link>
          <Link to="/flights" className="hover:text-[#0068EF] transition-colors">Flights</Link>
          <Link to="/packages" className="hover:text-[#0068EF] transition-colors">Packages</Link>
          <Link to="/cruises" className="hover:text-[#0068EF] transition-colors">Cruises</Link>
          <Link to="/experiences" className="hover:text-[#0068EF] transition-colors">Experiences</Link>
          <Link to="/deals" className="hover:text-[#0068EF] transition-colors">Deals</Link>
          <Link to="/ai-travel" className="font-medium hover:text-[#FF6200] transition-colors">🤖 AI Travel</Link>
          <Link to="/travel-buddy" className="font-medium hover:text-[#FF6200] transition-colors">👫 Find Buddies</Link>
        </nav>

        {/* Desktop User */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 border rounded-full px-3 py-1">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">J</div>
            <span>John</span>
          </div>
          <button className="border rounded-full px-4 py-1 hover:bg-gray-50">Sign Out</button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-gray-600">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4">
          <Link to="/hotels" className="block hover:text-[#0068EF] transition-colors">Hotels</Link>
          <Link to="/cars" className="block hover:text-[#0068EF] transition-colors">Cars</Link>
          <Link to="/flights" className="block hover:text-[#0068EF] transition-colors">Flights</Link>
          <Link to="/packages" className="block hover:text-[#0068EF] transition-colors">Packages</Link>
          <Link to="/cruises" className="block hover:text-[#0068EF] transition-colors">Cruises</Link>
          <Link to="/experiences" className="block hover:text-[#0068EF] transition-colors">Experiences</Link>
          <Link to="/deals" className="block hover:text-[#0068EF] transition-colors">Deals</Link>
          <Link to="/ai-travel" className="block font-semibold hover:text-[#FF6200] transition-colors">🤖 AI Travel</Link>
          <Link to="/travel-buddy" className="block font-semibold hover:text-[#FF6200] transition-colors">👫 Find Buddies</Link>
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2 border rounded-full px-3 py-1 w-fit">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">J</div>
              <span>John</span>
            </div>
            <button className="mt-3 border rounded-full px-4 py-1 hover:bg-gray-50 w-full">Sign Out</button>
          </div>
        </div>
      )}
    </header>
  );
}