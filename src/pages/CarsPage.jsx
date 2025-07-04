import React from "react";

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Header with Navigation and Hero Search */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">Road Trip Season!</span>
          <span>Save up to 40% on car rentals. Book your adventure today! <span className="underline">Learn More</span></span>
        </div>
      </div>

      {/* Header Navigation */}
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
                <li><a href="/cars" className="px-3 py-3 rounded-full text-[#0068EF] font-medium bg-blue-50">Cars</a></li>
                <li><a href="/flights" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Flights</a></li>
                <li><a href="/packages" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Packages</a></li>
                <li><a href="/cruises" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cruises</a></li>
                <li><a href="/experiences" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Experiences</a></li>
              </ul>
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center gap-2">
              <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">P</div>
                <span className="hidden lg:block text-gray-700">Penny</span>
              </button>
              <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-700">Sign In</div>
                  <div className="text-[#003C8A] font-bold text-xs uppercase">Join VIP</div>
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section with Search Form */}
      <div className="relative bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 flex gap-8">
          {/* Search Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex-1 max-w-2xl">
            <h1 className="text-3xl font-bold text-[#003C8A] mb-6">Find your next car rental deal</h1>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Pick-up Location */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0068EF]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Pick-up location" 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
                />
              </div>

              {/* Pick-up and Drop-off Dates */}
              <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
                <div className="flex-1">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm text-gray-600 focus:border-[#0068EF] focus:outline-none hover:border-gray-400">
                    <svg className="w-5 h-5 text-[#0068EF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    <span>Pick-up date</span>
                  </button>
                </div>
                <div className="flex-1">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm text-gray-600 focus:border-[#0068EF] focus:outline-none hover:border-gray-400">
                    <svg className="w-5 h-5 text-[#0068EF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    <span>Drop-off date</span>
                  </button>
                </div>
              </div>

              {/* Driver Age */}
              <div className="relative">
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none appearance-none">
                  <option>Driver age: 25+</option>
                  <option>Driver age: 21-24</option>
                  <option>Driver age: 18-20</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6-6-6L7.4 8z"/>
                  </svg>
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2">
                🚗 Search Cars
              </button>
            </div>
          </div>

          {/* Right Side - Promotional Card */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-orange-500 to-red-600">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Road Trip Ready!</h3>
                  <p className="text-sm">Premium cars at economy prices!</p>
                  <button className="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Browse Cars
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Recent Car Searches */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003C8A]">Pick up where you left off</h2>
          <button className="text-[#0068EF] font-medium hover:underline">View All Recent Activity</button>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Los Angeles Airport (LAX) - Compact Car</h3>
                <p className="text-sm text-gray-600">Economy rental car</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase">Pick-up</div>
                <div className="font-bold">Sat, Aug 16, 2025</div>
                <div className="text-sm text-gray-600">10:00 AM</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase">Drop-off</div>
                <div className="font-bold">Wed, Aug 20, 2025</div>
                <div className="text-sm text-gray-600">10:00 AM</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase">Duration</div>
                <div className="font-bold">4 Days</div>
              </div>
              <button className="bg-[#0068EF] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Continue Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Car Rental Deals */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#003C8A] mb-8">Great Car Rental Deals</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Car Deal 1 */}
          <div className="min-w-[300px] border-2 border-gray-200 rounded-2xl overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=300&h=200" 
              alt="Economy Car" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">Economy</h3>
                  <div className="text-sm text-gray-600">Nissan Versa or similar</div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  SAVE 30%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs line-through text-gray-500">$45/day</div>
                <div className="text-2xl font-bold text-green-600">$32</div>
                <div className="text-xs text-gray-600">per day</div>
              </div>
              <button className="w-full bg-gray-100 text-[#0068EF] font-bold py-2 rounded-full text-sm hover:bg-gray-200 mt-3">
                Select Car
              </button>
            </div>
          </div>

          {/* Car Deal 2 */}
          <div className="min-w-[300px] border-2 border-gray-200 rounded-2xl overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300&h=200" 
              alt="Compact Car" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">Compact</h3>
                  <div className="text-sm text-gray-600">Toyota Corolla or similar</div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  SAVE 25%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs line-through text-gray-500">$52/day</div>
                <div className="text-2xl font-bold text-green-600">$39</div>
                <div className="text-xs text-gray-600">per day</div>
              </div>
              <button className="w-full bg-gray-100 text-[#0068EF] font-bold py-2 rounded-full text-sm hover:bg-gray-200 mt-3">
                Select Car
              </button>
            </div>
          </div>

          {/* Car Deal 3 */}
          <div className="min-w-[300px] border-2 border-gray-200 rounded-2xl overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200" 
              alt="SUV" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">SUV</h3>
                  <div className="text-sm text-gray-600">Ford Explorer or similar</div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  SAVE 20%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs line-through text-gray-500">$89/day</div>
                <div className="text-2xl font-bold text-green-600">$71</div>
                <div className="text-xs text-gray-600">per day</div>
              </div>
              <button className="w-full bg-gray-100 text-[#0068EF] font-bold py-2 rounded-full text-sm hover:bg-gray-200 mt-3">
                Select Car
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Email Signup and App Promotion */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Email Signup Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#003C8A] mb-4">Sign up for Exclusive Car Rental Deals</h2>
            <p className="text-gray-600 mb-8">Get access to member-only rates and special offers.</p>
            
            <div className="flex max-w-md mx-auto gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0068EF]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <input 
                  type="email" 
                  placeholder="example@example.com" 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0068EF] focus:outline-none"
                />
              </div>
              <button className="bg-[#0068EF] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">
                send me deals
              </button>
            </div>
          </div>

          {/* App Promotion Section */}
          <div className="bg-white rounded-2xl p-8 flex items-center gap-8">
            <div className="flex-1">
              <div className="text-sm text-gray-500 uppercase font-bold mb-2">MOBILE EXCLUSIVE</div>
              <h3 className="text-3xl font-bold text-[#003C8A] mb-4">Last-Minute Car Deals. Only in the App.</h3>
              <p className="text-gray-600 mb-6">
                Find the best car rental deals and manage your bookings on the go. Download our app today!
              </p>
              <div className="flex gap-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-12"
                />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Our products */}
            <div>
              <h3 className="font-bold text-lg mb-4">Our products</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Hotel Express Deals™</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Hotels</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Cars</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Flights</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Packages</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Cruises</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Experiences</a></li>
              </ul>
            </div>

            {/* About UTrippin */}
            <div>
              <h3 className="font-bold text-lg mb-4">About UTrippin</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Our Story</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Press Center</a></li>
              </ul>
            </div>

            {/* Partner with UTrippin */}
            <div>
              <h3 className="font-bold text-lg mb-4">Partner with UTrippin</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Add Your Hotel</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">UTrippin Partner Solutions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Advertise</a></li>
              </ul>
            </div>

            {/* Connect with UTrippin */}
            <div>
              <h3 className="font-bold text-lg mb-4">Connect with UTrippin</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">UTrippin for iOS</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">UTrippin for Android</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Instagram</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-xs text-gray-500 text-center">
              © 2025 UTrippin.com LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}