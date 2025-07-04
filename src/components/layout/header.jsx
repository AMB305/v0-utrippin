import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="max-w-7xl mx-auto">
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center px-3 py-2 rounded-full">
              <div className="text-[#0068EF] font-bold text-xl">UTrippin</div>
            </a>
            <ul className="hidden lg:flex items-center gap-2 text-sm">
              <li><a href="/hotels" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Hotels</a></li>
              <li><a href="/cars" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cars</a></li>
              <li><a href="/flights" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Flights</a></li>
              <li><a href="/packages" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Packages</a></li>
              <li><a href="/cruises" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cruises</a></li>
              <li><a href="/experiences" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Experiences</a></li>
              <li><a href="/deals" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Deals</a></li>
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
    </header>
  );
}