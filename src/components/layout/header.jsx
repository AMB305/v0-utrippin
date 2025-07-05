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
          <Link to="/packages" classNam
