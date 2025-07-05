import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex space-x-2 transition transform hover:scale-105 duration-300">
              <div className="flex space-x-1">
                <span className="bg-[#0068ef] group-hover:bg-[#338df3] transition text-white font-bold px-2 py-1">U</span>
                <span className="bg-[#0055a5] group-hover:bg-[#3578bd] transition text-white font-bold px-2 py-1">T</span>
                <span className="bg-[#004080] group-hover:bg-[#2e5d91] transition text-white font-bold px-2 py-1">R</span>
                <span className="bg-[#003366] group-hover:bg-[#264d73] transition text-white font-bold px-2 py-1">I</span>
                <span className="bg-[#00264d] group-hover:bg-[#1e3c5c] transition text-white font-bold px-2 py-1">P</span>
                <span className="bg-[#001933] group-hover:bg-[#14293f] transition text-white font-bold px-2 py-1">P</span>
                <span className="bg-[#001020] group-hover:bg-[#0e1a26] transition text-white font-bold px-2 py-1">I</span>
                <span className="bg-[#000d1a] group-hover:bg-[#0b141f] transition text-white font-bold px-2 py-1">N</span>
              </div>
            </Link>
            <ul className="hidden lg:flex items-center gap-2 text-sm">
              <li><a href="/hotels" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Hotels</a></li>
              <li><a href="/cars" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cars</a></li>
              <li><a href="/flights" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Flights</a></li>
              <li><a href="/packages" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Packages</a></li>
              <li><a href="/cruises" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cruises</a></li>
              <li><a href="/experiences" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Experiences</a></li>
              <li><a href="/deals" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Deals</a></li>
              <li><a href="/ai-travel" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 font-medium">🤖 AI Travel</a></li>
              <li><a href="/travel-buddy" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100 font-medium">👫 Find Buddies</a></li>
            </ul>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                    {user.firstName?.[0] || 'U'}
                  </div>
                  <span className="hidden lg:block text-gray-700">{user.firstName}</span>
                </button>
                <button 
                  onClick={logout}
                  className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-700">Sign In</div>
                  <div className="text-[#003C8A] font-bold text-xs uppercase">Join VIP</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>
      </div>
    </header>
  );
}