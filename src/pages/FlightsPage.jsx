import React from "react";

export default function FlightsPage() {
  return (
    <div className="bg-[#f5f7fa] min-h-screen font-['Roboto']">
      {/* TOP NAV */}
      <header className="bg-[#003580] text-white py-4 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <div className="text-2xl font-bold">Utrippin</div>
          <nav className="space-x-6 font-semibold">
            <a href="/flights" className="border-b-2 border-white pb-1">Flights</a>
            <a href="/hotels" className="hover:text-[#ffb700]">Hotels</a>
            <a href="/cars" className="hover:text-[#ffb700]">Cars</a>
            <a href="/packages" className="hover:text-[#ffb700]">Packages</a>
            <a href="/destinations" className="hover:text-[#ffb700]">Destinations</a>
          </nav>
        </div>
      </header>

      {/* SEARCH BOX */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-[#003580]">Find cheap flights</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="From"
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#003580]"
          />
          <input
            type="text"
            placeholder="To"
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#003580]"
          />
          <input
            type="date"
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#003580]"
          />
          <input
            type="date"
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#003580]"
          />
          <select className="md:col-span-2 border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#003580]">
            <option>1 Adult, Economy</option>
            <option>2 Adults, Business</option>
          </select>
        </div>
        <button className="w-full bg-[#003580] text-white font-bold py-3 rounded hover:bg-[#002f6c]">
          🔍 Search Flights
        </button>
      </div>

      {/* RECENT SEARCHES */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-[#003580] mb-4">
          Recent searches
        </h2>
        <div className="flex justify-between items-center bg-[#eaf1fb] p-4 rounded">
          <div>
            <div className="font-semibold">Miami to London</div>
            <div className="text-sm text-gray-600">1 Adult · Economy</div>
          </div>
          <button className="bg-[#003580] text-white px-4 py-2 rounded hover:bg-[#002f6c]">
            Continue
          </button>
        </div>
      </div>

      {/* FEATURED DEALS */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-[#003580] mb-6">
          Featured flight deals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "New York → Paris",
              desc: "Round-trip · Direct flight",
              price: "$450",
              img: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde"
            },
            {
              title: "LA → Tokyo",
              desc: "Round-trip · 1 stop",
              price: "$890",
              img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
            },
            {
              title: "Chicago → Rome",
              desc: "Round-trip · Direct",
              price: "$720",
              img: "https://images.unsplash.com/photo-1533049022227-6cbadaf94f32"
            },
          ].map((deal, i) => (
            <div key={i} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <img
                src={`${deal.img}?auto=format&fit=crop&w=800&q=80`}
                alt={deal.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-[#003580]">{deal.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{deal.desc}</p>
                <div className="font-bold text-[#ff6200]">{deal.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12"></div>
    </div>
  );
}
