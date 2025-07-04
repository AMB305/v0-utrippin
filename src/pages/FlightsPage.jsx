import React from "react";

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">July 4th Getaways!</span>
          <span>Take an extra $10 off Flight Express Deals®. Use code: <strong>EXTRA10</strong> <span className="underline">Learn More</span></span>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto">
        <nav className="px-2 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center px-3 py-2 rounded-full">
                <div className="text-[#0068EF] font-bold text-xl">UTrippin</div>
              </a>
              <ul className="hidden lg:flex items-center gap-2 text-sm">
                <li><a href="/hotels" className="px-3 py-3 rounded-full text-[#001833]">Hotels</a></li>
                <li><a href="/cars" className="px-3 py-3 rounded-full text-[#001833]">Cars</a></li>
                <li><a href="/flights" className="px-3 py-3 rounded-full text-[#0068EF] font-medium">Flights</a></li>
                <li><a href="/packages" className="px-3 py-3 rounded-full text-[#001833]">Packages</a></li>
                <li><a href="/destinations" className="px-3 py-3 rounded-full text-[#001833]">Experiences</a></li>
              </ul>
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center gap-2">
              <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <span className="hidden lg:block">Penny</span>
              </button>
              <button className="bg-white border-2 border-gray-300 rounded-full px-3 py-2 text-sm flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <div className="text-left">
                  <div className="text-xs">Sign In</div>
                  <div className="text-[#003C8A] font-bold text-xs uppercase">Join VIP</div>
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative mb-8">
        {/* Background */}
        <div className="absolute inset-0 bg-[#004499] -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 lg:flex lg:gap-8">
          {/* Search Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex-1">
            <h1 className="text-3xl font-bold text-[#003C8A] mb-6">Find your next flight deal</h1>
            
            {/* Trip Type Radio Buttons */}
            <div className="flex gap-6 mb-6 text-sm text-gray-600 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 rounded-full border-2 border-[#0068EF] bg-[#0068EF] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-[#0068EF]">Round-trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-transparent rounded-full"></div>
                </div>
                <span>One-way</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-transparent rounded-full"></div>
                </div>
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
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Departing from?" 
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0068EF]">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.8l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16 5.9 13.1 3 9.5 3S3 5.9 3 9.5 5.9 16 9.5 16c1.6 0 3.1-.6 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Going to?" 
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date and Passenger Fields */}
              <div className="flex flex-col lg:flex-row lg:gap-4 gap-4">
                <div className="flex-1">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-4 border-2 border-gray-300 rounded-xl text-sm text-gray-600 focus:border-[#0068EF] focus:outline-none">
                    <svg className="w-6 h-6 text-[#0068EF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    <span>Departing - Returning</span>
                  </button>
                </div>
                <div className="flex-1">
                  <button className="w-full flex items-center justify-start gap-3 px-4 py-4 border-2 border-gray-300 rounded-xl text-sm text-gray-600 focus:border-[#0068EF] focus:outline-none">
                    <svg className="w-6 h-6 text-[#0068EF]" fill="currentColor" viewBox="0 0 24 24">
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
                  <select className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-sm focus:border-[#0068EF] focus:outline-none appearance-none">
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6-6-6L7.4 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bundle + Save */}
              <div className="bg-[#D0F1AC] rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 12l-2.4 2.7.3 3.5-3.6.8-1.9 3-3.4-1.4L8.6 22l-1.9-3-3.6-.8.3-3.5L1 12l2.4-2.7-.3-3.5L6.7 5l1.9-3L12 3.4 15.4 2l1.9 3 3.6.8-.3 3.5L23 12zm-10.8-.6c-1.3-.3-1.8-.7-1.8-1.3 0-.6.6-1.1 1.6-1.1s1.4.5 1.5 1.2h1.3c0-1-.7-1.9-1.9-2.2V6.7h-1.8V8c-1.1.2-2 1-2 2.1 0 1.3 1.1 2 2.8 2.4 1.5.4 1.8.9 1.8 1.4 0 .4-.3 1-1.6 1-1.2 0-1.7-.5-1.8-1.2H9c.1 1.3 1 2 2.2 2.2v1.3H13V16c1.1-.2 2.1-.9 2.1-2.1-.1-1.6-1.5-2.2-2.9-2.5z"/>
                  </svg>
                  <span className="text-green-700 font-bold text-sm">Bundle + Save</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 text-[#0068EF] border-2 border-gray-400 rounded focus:ring-[#0068EF]" />
                    <span>Add a hotel</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 text-[#0068EF] border-2 border-gray-400 rounded focus:ring-[#0068EF]" />
                    <span>Add a car</span>
                  </label>
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full bg-[#0068EF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors">
                Find Your Flight
              </button>
            </div>
          </div>

          {/* Right Side - Ad Space (hidden on mobile) */}
          <div className="hidden lg:block w-72 mt-8 lg:mt-0">
            <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
              <span>Advertisement Space</span>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="bg-white mx-4 lg:mx-auto max-w-6xl rounded-2xl shadow-lg p-4 text-center text-sm text-gray-700">
          Looking for international flight deals? Call us at <span className="text-[#FF6200] font-semibold">(833) 203-5879</span>
        </div>
      </div>

      {/* Price Drop Deals Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h3 className="text-3xl font-bold text-[#003C8A] mb-6">Price Drop Deals Near You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Deal Card 1 */}
          <div className="border-2 border-gray-300 rounded-2xl p-4">
            <div className="flex mb-3">
              <img 
                src="https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Prince George" 
                className="w-24 h-18 rounded-xl object-cover"
              />
              <div className="ml-3 pt-2">
                <div className="font-bold mb-2">Prince George</div>
                <div className="bg-[#D0F1AC] text-green-900 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  70% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-right">
                    <div className="font-bold">Aug 31</div>
                    <div className="text-xs text-gray-600">YVR</div>
                  </div>
                  <div className="flex-1 relative mx-2">
                    <div className="border-t-2 border-gray-300 absolute top-1/2 w-full"></div>
                    <div className="text-center">
                      <div className="text-xs mb-1">7 Days</div>
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Sep 07</div>
                    <div className="text-xs text-gray-600">YXS</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs font-bold line-through text-gray-500">$483.07</div>
                <div className="text-xs font-bold">now only</div>
                <div className="text-xl font-bold text-green-600">$145</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-200 text-[#0068EF] font-bold py-2 rounded-full text-xs hover:bg-gray-300 transition-colors">
              Search Flight Times
            </button>
          </div>

          {/* Deal Card 2 */}
          <div className="border-2 border-gray-300 rounded-2xl p-4">
            <div className="flex mb-3">
              <img 
                src="https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Edmonton" 
                className="w-24 h-18 rounded-xl object-cover"
              />
              <div className="ml-3 pt-2">
                <div className="font-bold mb-2">Edmonton</div>
                <div className="bg-[#D0F1AC] text-green-900 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  13% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-right">
                    <div className="font-bold">Aug 04</div>
                    <div className="text-xs text-gray-600">YCD</div>
                  </div>
                  <div className="flex-1 relative mx-2">
                    <div className="border-t-2 border-gray-300 absolute top-1/2 w-full"></div>
                    <div className="text-center">
                      <div className="text-xs mb-1">8 Days</div>
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Aug 12</div>
                    <div className="text-xs text-gray-600">YEG</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs font-bold line-through text-gray-500">$196.56</div>
                <div className="text-xs font-bold">now only</div>
                <div className="text-xl font-bold text-green-600">$171</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-200 text-[#0068EF] font-bold py-2 rounded-full text-xs hover:bg-gray-300 transition-colors">
              Search Flight Times
            </button>
          </div>

          {/* Deal Card 3 */}
          <div className="border-2 border-gray-300 rounded-2xl p-4">
            <div className="flex mb-3">
              <img 
                src="https://images.pexels.com/photos/161772/las-vegas-strip-nevada-gambling-161772.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Las Vegas" 
                className="w-24 h-18 rounded-xl object-cover"
              />
              <div className="ml-3 pt-2">
                <div className="font-bold mb-2">Las Vegas</div>
                <div className="bg-[#D0F1AC] text-green-900 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  55% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-right">
                    <div className="font-bold">Jul 17</div>
                    <div className="text-xs text-gray-600">YVR</div>
                  </div>
                  <div className="flex-1 relative mx-2">
                    <div className="border-t-2 border-gray-300 absolute top-1/2 w-full"></div>
                    <div className="text-center">
                      <div className="text-xs mb-1">5 Days</div>
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Jul 22</div>
                    <div className="text-xs text-gray-600">LAS</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs font-bold line-through text-gray-500">$389.79</div>
                <div className="text-xs font-bold">now only</div>
                <div className="text-xl font-bold text-green-600">$177</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-200 text-[#0068EF] font-bold py-2 rounded-full text-xs hover:bg-gray-300 transition-colors">
              Search Flight Times
            </button>
          </div>

          {/* Deal Card 4 */}
          <div className="border-2 border-gray-300 rounded-2xl p-4">
            <div className="flex mb-3">
              <img 
                src="https://images.pexels.com/photos/161772/las-vegas-strip-nevada-gambling-161772.jpeg?auto=compress&cs=tinysrgb&w=96&h=72" 
                alt="Las Vegas" 
                className="w-24 h-18 rounded-xl object-cover"
              />
              <div className="ml-3 pt-2">
                <div className="font-bold mb-2">Las Vegas</div>
                <div className="bg-[#D0F1AC] text-green-900 text-xs font-bold px-2 py-1 rounded-full uppercase">
                  55% PRICE DROP
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-right">
                    <div className="font-bold">Jul 18</div>
                    <div className="text-xs text-gray-600">YVR</div>
                  </div>
                  <div className="flex-1 relative mx-2">
                    <div className="border-t-2 border-gray-300 absolute top-1/2 w-full"></div>
                    <div className="text-center">
                      <div className="text-xs mb-1">5 Days</div>
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Jul 23</div>
                    <div className="text-xs text-gray-600">LAS</div>
                  </div>
                </div>
              </div>
              <div className="text-center ml-4">
                <div className="text-xs font-bold line-through text-gray-500">$392.97</div>
                <div className="text-xs font-bold">now only</div>
                <div className="text-xl font-bold text-green-600">$177</div>
                <div className="text-xs text-gray-600">Round Trip</div>
              </div>
            </div>
            <button className="w-full bg-gray-200 text-[#0068EF] font-bold py-2 rounded-full text-xs hover:bg-gray-300 transition-colors">
              Search Flight Times
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}