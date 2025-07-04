import React from "react";

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Header with Navigation and Hero Search */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">July 4th Getaways!</span>
          <span>Take an extra $10 off Flight Express Deals®. Use code: <strong>EXTRA10</strong> <span className="underline">Learn More</span></span>
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
                <li><a href="/cars" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cars</a></li>
                <li><a href="/flights" className="px-3 py-3 rounded-full text-[#0068EF] font-medium bg-blue-50">Flights</a></li>
                <li><a href="/packages" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Packages</a></li>
                <li><a href="/destinations" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Cruises</a></li>
                <li><a href="/destinations" className="px-3 py-3 rounded-full text-[#001833] hover:bg-gray-100">Experiences</a></li>
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
              <button className="hidden lg:block bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm hover:bg-gray-50">
                🇺🇸
              </button>
              <button className="hidden lg:block bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm hover:bg-gray-50">
                Help
              </button>
              <button className="hidden lg:block bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm hover:bg-gray-50">
                Find My Trip
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section with Search Form */}
      <div className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 flex gap-8">
          {/* Search Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex-1 max-w-2xl">
            <h1 className="text-3xl font-bold text-[#003C8A] mb-6">Find your next flight deal</h1>
            
            {/* Trip Type Radio Buttons */}
            <div className="flex gap-6 mb-6 text-sm text-gray-600 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-6 h-6 rounded-full border-2 border-[#0068EF] bg-[#0068EF] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-[#0068EF]">Round-trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                <span>One-way</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                <span>Multi-destination</span>
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* From/To Fields */}
              <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0068EF]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Departing from?" 
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0068EF]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Going to?" 
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date and Passenger Fields */}
              <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
                <div className="flex-1">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm text-gray-600 focus:border-[#0068EF] focus:outline-none hover:border-gray-400">
                    <svg className="w-5 h-5 text-[#0068EF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    <span>Departing - Returning</span>
                  </button>
                </div>
                <div className="flex-1">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm text-gray-600 focus:border-[#0068EF] focus:outline-none hover:border-gray-400">
                    <svg className="w-5 h-5 text-[#0068EF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
                    </svg>
                    <span>1 Adult</span>
                  </button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-600 mb-1 ml-3">Cabin Class</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none appearance-none">
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6-6-6L7.4 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bundle + Save */}
              <div className="bg-[#D0F1AC] rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 12l-2.4 2.7.3 3.5-3.6.8-1.9 3-3.4-1.4L8.6 22l-1.9-3-3.6-.8.3-3.5L1 12l2.4-2.7-.3-3.5L6.7 5l1.9-3L12 3.4 15.4 2l1.9 3 3.6.8-.3 3.5L23 12zm-10.8-.6c-1.3-.3-1.8-.7-1.8-1.3 0-.6.6-1.1 1.6-1.1s1.4.5 1.5 1.2h1.3c0-1-.7-1.9-1.9-2.2V6.7h-1.8V8c-1.1.2-2 1-2 2.1 0 1.3 1.1 2 2.8 2.4 1.5.4 1.8.9 1.8 1.4 0 .4-.3 1-1.6 1-1.2 0-1.7-.5-1.8-1.2H9c.1 1.3 1 2 2.2 2.2v1.3H13V16c1.1-.2 2.1-.9 2.1-2.1-.1-1.6-1.5-2.2-2.9-2.5z"/>
                  </svg>
                  <span className="text-green-700 font-bold text-sm">Bundle + Save</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#0068EF] border-2 border-gray-400 rounded focus:ring-[#0068EF]" />
                    <span>Add a hotel</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#0068EF] border-2 border-gray-400 rounded focus:ring-[#0068EF]" />
                    <span>Add a car</span>
                  </label>
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
                Find Your Flight
              </button>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-6 text-center text-sm text-gray-700">
              Looking for international flight deals? Call us at <span className="text-[#FF6200] font-semibold">(833) 203-5879</span>
            </div>
          </div>

          {/* Right Side - Promotional Card */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Shop fares up to $99!</h3>
                  <p className="text-sm">Your next adventure awaits!</p>
                  <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Explore now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Pick up where you left off */}
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
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Fort Lauderdale, FL (FLL) - Christiansted, VQ (STX)</h3>
                <p className="text-sm text-gray-600">Round trip flight</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase">Depart</div>
                <div className="font-bold">Thu, Jul 17, 2025</div>
                <div className="text-sm text-gray-600">FLL → STX</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase">Return</div>
                <div className="font-bold">Fri, Aug 22, 2025</div>
                <div className="text-sm text-gray-600">STX → FLL</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase">Passengers</div>
                <div className="font-bold">1 Adult</div>
              </div>
              <button className="bg-[#0068EF] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Continue Search
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 12l-2.4 2.7.3 3.5-3.6.8-1.9 3-3.4-1.4L8.6 22l-1.9-3-3.6-.8.3-3.5L1 12l2.4-2.7-.3-3.5L6.7 5l1.9-3L12 3.4 15.4 2l1.9 3 3.6.8-.3 3.5L23 12zm-10.8-.6c-1.3-.3-1.8-.7-1.8-1.3 0-.6.6-1.1 1.6-1.1s1.4.5 1.5 1.2h1.3c0-1-.7-1.9-1.9-2.2V6.7h-1.8V8c-1.1.2-2 1-2 2.1 0 1.3 1.1 2 2.8 2.4 1.5.4 1.8.9 1.8 1.4 0 .4-.3 1-1.6 1-1.2 0-1.7-.5-1.8-1.2H9c.1 1.3 1 2 2.2 2.2v1.3H13V16c1.1-.2 2.1-.9 2.1-2.1-.1-1.6-1.5-2.2-2.9-2.5z"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-green-700">BUNDLE AND SAVE</span>
                <div className="text-sm text-gray-600">Save an average of $240 per person.</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Add a hotel</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Add a car</span>
              </label>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                Book a Bundle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Price Drop Deals Near You */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#003C8A] mb-8">Price Drop Deals Near You</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Deal Card 1 - Newark */}
          <div className="min-w-[300px] border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex mb-4">
              <img 
                src="https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Newark" 
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <div className="font-bold text-lg">Newark</div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  18% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="font-bold">Aug 14</div>
                    <div className="text-xs text-gray-600">PIT</div>
                  </div>
                  <div className="flex-1 text-center mx-4">
                    <div className="text-xs mb-1">4 Days</div>
                    <div className="border-t border-gray-300 relative">
                      <div className="w-2 h-2 bg-gray-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Aug 18</div>
                    <div className="text-xs text-gray-600">EWR</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs line-through text-gray-500">$93.73</div>
                <div className="text-xs">now only</div>
                <div className="text-2xl font-bold text-green-600">$77</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-100 text-[#0068EF] font-bold py-2 rounded-full text-sm hover:bg-gray-200">
              Search Flight Times
            </button>
          </div>

          {/* Deal Card 2 - Myrtle Beach */}
          <div className="min-w-[300px] border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex mb-4">
              <img 
                src="https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Myrtle Beach" 
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <div className="font-bold text-lg">Myrtle Beach</div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  47% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="font-bold">Aug 14</div>
                    <div className="text-xs text-gray-600">CLE</div>
                  </div>
                  <div className="flex-1 text-center mx-4">
                    <div className="text-xs mb-1">4 Days</div>
                    <div className="border-t border-gray-300 relative">
                      <div className="w-2 h-2 bg-gray-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Aug 18</div>
                    <div className="text-xs text-gray-600">MYR</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs line-through text-gray-500">$149.46</div>
                <div className="text-xs">now only</div>
                <div className="text-2xl font-bold text-green-600">$78</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-100 text-[#0068EF] font-bold py-2 rounded-full text-sm hover:bg-gray-200">
              Search Flight Times
            </button>
          </div>

          {/* Deal Card 3 - Tampa */}
          <div className="min-w-[300px] border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex mb-4">
              <img 
                src="https://images.pexels.com/photos/161772/las-vegas-strip-nevada-gambling-161772.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Tampa" 
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <div className="font-bold text-lg">Tampa</div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  74% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="font-bold">Sep 01</div>
                    <div className="text-xs text-gray-600">CLE</div>
                  </div>
                  <div className="flex-1 text-center mx-4">
                    <div className="text-xs mb-1">4 Days</div>
                    <div className="border-t border-gray-300 relative">
                      <div className="w-2 h-2 bg-gray-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Sep 05</div>
                    <div className="text-xs text-gray-600">TPA</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs line-through text-gray-500">$302.16</div>
                <div className="text-xs">now only</div>
                <div className="text-2xl font-bold text-green-600">$79</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-100 text-[#0068EF] font-bold py-2 rounded-full text-sm hover:bg-gray-200">
              Search Flight Times
            </button>
          </div>

          {/* Navigation Arrow */}
          <div className="flex items-center">
            <button className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 16.6l4.6-4.6L8 7.4 9.4 6l6 6-6 6L8 16.6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Email Signup and App Promotion */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Email Signup Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#003C8A] mb-4">Sign up for Exclusive Email-only Coupons</h2>
            <p className="text-gray-600 mb-8">Exclusive access to coupons, special offers and promotions.</p>
            
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

          {/* Promotional Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Email Signup Card */}
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img 
                src="https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" 
                alt="Email signup" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                <div className="bg-black bg-opacity-60 rounded-lg p-3 mb-4">
                  <div className="text-white font-bold text-lg">UTrippin</div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Email Sign Up</h3>
                <p className="text-white text-sm">Get access to exclusive travel offers</p>
              </div>
            </div>

            {/* App Download Card */}
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img 
                src="https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" 
                alt="App download" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                <div className="bg-black bg-opacity-60 rounded-lg p-3 mb-4">
                  <div className="text-white font-bold text-lg">UTrippin</div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Download Now. Save More.</h3>
                <p className="text-white text-sm">Our best deals are in the app!</p>
              </div>
            </div>

            {/* Destination Card */}
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img 
                src="https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" 
                alt="Destination" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-xl mb-2">VISIT NUUK, GREENLAND</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm w-fit">
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* App Promotion Section */}
          <div className="bg-white rounded-2xl p-8 flex items-center gap-8">
            <div className="flex-1">
              <div className="text-sm text-gray-500 uppercase font-bold mb-2">SAVINGS ON THE GO</div>
              <h3 className="text-3xl font-bold text-[#003C8A] mb-4">Tonight Only Deals. Only in the App.</h3>
              <p className="text-gray-600 mb-6">
                Discover hotel, flight and rental car deals exclusively in the app. Download today to stay connected with important trip details — anytime, anywhere.
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
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300&h=400" 
                alt="Mobile app" 
                className="w-64 h-80 object-cover rounded-2xl"
              />
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
                <li><a href="#" className="text-gray-600 hover:text-gray-900">UTrippin VIP Rewards™ Visa® Card</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Military Members Discounts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Veterans Discounts</a></li>
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
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Learn About New Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Investor Relations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms and Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Corporate Contact Information</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Sustainability</a></li>
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
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">YouTube</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Savings percentage claims based on Express Deal bookings compared to UTrippin's lowest retail rate for the same itinerary. Express Deals® travel provider shown after booking.<br /><br />
              Package Savings based on itineraries booked as a package, compared to the price of the same itinerary booked separately on UTrippin. Savings vary.<br /><br />
              Strike through price discounts compare available discounted price to the most recent actual, or where unavailable, estimated based on average, retail price offered through UTrippin.<br /><br />
              © 2025 UTrippin.com LLC. All rights reserved. See terms and conditions for more information including on UTrippin registered marks.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Brand Section */}
      <div className="bg-[#001833] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white text-sm mb-6">UTrippin is part of Booking Holdings, the world leader in online travel related services.</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="text-white font-bold text-lg">UTrippin</div>
            <div className="text-white font-bold text-lg">Booking.com</div>
            <div className="text-white font-bold text-lg">KAYAK</div>
            <div className="text-white font-bold text-lg">Agoda</div>
            <div className="text-white font-bold text-lg">OpenTable</div>
          </div>
        </div>
      </div>
    </div>
  );
}