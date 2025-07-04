import React from "react";

export default function FlightsPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero search section */}
      <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">
          ✈️ Find your next flight deal
        </h1>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 bg-blue-900 text-white rounded">Round-trip</button>
          <button className="px-4 py-2 bg-gray-100 rounded">One-way</button>
          <button className="px-4 py-2 bg-gray-100 rounded">Multi-destination</button>
        </div>

        <div className="flex justify-between items-center bg-green-100 p-3 rounded mb-4">
          <div className="flex space-x-4 items-center">
            <label className="flex items-center space-x-1">
              <input type="checkbox" />
              <span>Bundle + Save</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="checkbox" />
              <span>Add hotel</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="checkbox" />
              <span>Add car</span>
            </label>
          </div>
          <div className="font-semibold text-green-800">Save up to $625</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="From" className="border p-2 rounded w-full" />
          <input type="text" placeholder="To" className="border p-2 rounded w-full" />
          <input type="date" className="border p-2 rounded w-full" />
          <input type="date" className="border p-2 rounded w-full" />
          <select className="border p-2 rounded w-full md:col-span-2">
            <option>1 Adult, Economy</option>
          </select>
        </div>

        <button className="w-full bg-blue-900 text-white py-3 rounded mt-2 hover:bg-blue-800">
          🔍 Search Flights
        </button>

        <p className="mt-4 text-center text-sm">
          Looking for international deals? Call us at 
          <span className="text-orange-600 font-bold"> (833) 203-5879</span>
        </p>
      </div>

      {/* Recent search */}
      <div className="bg-blue-50 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Pick up where you left off</h2>
            <button className="border border-blue-900 text-blue-900 rounded-full px-4 py-1 hover:bg-blue-900 hover:text-white">
              View All Recent Activity
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 flex flex-wrap items-center shadow">
            <div className="flex items-center space-x-4 mb-4 md:mb-0 md:w-1/3">
              <div className="bg-blue-100 p-3 rounded-full">
                ✈️
              </div>
              <div>
                <div className="font-bold">Fort Lauderdale, FL (FLL) - Christiansted, VQ (STX)</div>
                <div className="text-sm text-gray-600">Round trip flight</div>
              </div>
            </div>
            <div className="flex space-x-6 md:w-1/3">
              <div className="text-center">
                <div className="text-xs font-bold text-gray-600">DEPART</div>
                <div className="font-semibold">Thu, Jul 17, 2025</div>
                <div className="text-xs">FLL → STX</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-600">RETURN</div>
                <div className="font-semibold">Fri, Aug 22, 2025</div>
                <div className="text-xs">STX → FLL</div>
              </div>
            </div>
            <div className="md:w-1/6 text-center">
              <div className="font-bold">1 Adult</div>
              <div className="text-sm text-gray-600">Economy</div>
            </div>
            <div className="md:w-1/6 text-center mt-4 md:mt-0">
              <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                Continue Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Deals */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Featured Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: "https://images.unsplash.com/photo-1576085898321-f74c4d07b128",
              title: "Tokyo Adventure",
              desc: "Round-trip flights + 5 nights hotel",
              price: "$1,299",
              oldPrice: "$1,599",
              discount: "19%"
            },
            {
              img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
              title: "Paris Romance",
              desc: "Luxury hotel + Seine river cruise",
              price: "$899",
              oldPrice: "$1,199",
              discount: "25%"
            },
            {
              img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
              title: "Bali Escape",
              desc: "Beach resort + spa treatments",
              price: "$749",
              oldPrice: "$999",
              discount: "25%"
            }
          ].map((deal, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={deal.img} alt={deal.title} className="w-full h-56 object-cover"/>
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                {deal.discount} off
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
                <h3 className="font-bold text-lg">{deal.title}</h3>
                <p className="text-sm">{deal.desc}</p>
                <div className="mt-1 font-bold">{deal.price} <span className="line-through font-light">{deal.oldPrice}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
