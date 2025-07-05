import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          {!logoError ? (
            <img 
              src="/UTrippin_Logo_3000px_clean.png"
              alt="UTrippin Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
              onError={() => setLogoError(true)}
              onLoad={() => console.log('Logo loaded successfully')}
            />
          ) : (
            <div className="text-[#0068EF] font-bold text-xl">
              UTrippin
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium text-[#001E3C]">
          <Link to="/hotels" className="hover:text-[#0068EF] transition-colors">Hotels</Link>
          <Link to="/cars" className="hover:text-[#0068EF] transition-colors">Cars</Link>
          <Link to="/flights" className="hover:text-[#0068EF] transition-colors">Flights</Link>
          <Link to="/packages" className="hover:text-[#0068EF] transition-colors">Packages</Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0068EF]"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link to="/hotels" className="block px-3 py-2 text-base font-medium text-[#001E3C] hover:text-[#0068EF] hover:bg-gray-50">Hotels</Link>
            <Link to="/cars" className="block px-3 py-2 text-base font-medium text-[#001E3C] hover:text-[#0068EF] hover:bg-gray-50">Cars</Link>
            <Link to="/flights" className="block px-3 py-2 text-base font-medium text-[#001E3C] hover:text-[#0068EF] hover:bg-gray-50">Flights</Link>
            <Link to="/packages" className="block px-3 py-2 text-base font-medium text-[#001E3C] hover:text-[#0068EF] hover:bg-gray-50">Packages</Link>
          </div>
        </div>
      )}
    </header>
  );
}
