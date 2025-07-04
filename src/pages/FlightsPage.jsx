import React from "react";

export default function FlightsPage() {
  return (
    <div className="font-sans">
      {/* NAV */}
      <header className="bg-[#0068EF] text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="text-2xl font-bold">Utrippin</div>
        <nav className="space-x-6 font-semibold hidden md:block">
          <a href="/flights" className="border-b-2 border-white pb-1">Flights</a>
          <a href="/hotels" className="hover:underline">Hotels</a>
          <a href="/cars" className="hover:underline">Cars</a>
          <a href="/packages" className="hover:underline">Packages</a>
          <a href="/destinations" className="hover:underline">Destinations</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="bg-[#004499] text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Find your next flight deal</h1>
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-white text-[#004499] font-bold px-6 py-2 rounded-full">Round-trip</button>
          <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#004499]">One-way</button>
          <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#004499]">Multi-destination</button>
        </div>

        <div className="max-w-3xl mx-auto bg-white text-black rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Departing from?" className="border p-4 rounded-full flex-1 focus:ring-2 focus:ring-[#004499]" />
            <input type="text" placeholder="Going to?" className="border p-4 rounded-full flex-1 focus:ring-2 focus:ring-[#004499]" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Depart - Return" className="border p-4 rounded-full flex-1 focus:ring-2 focus:ring-[#004499]" />
            <select className="border p-4 rounded-full flex-1 focus:ring-2 focus:ring-[#004499]">
              <option>1 Adult</option>
              <option>2 Adults</option>
            </select>
            <select className="border p-4 rounded-full flex-1 focus:ring-2 focus:ring-[#004499]">
              <option>Economy</option>
              <option>Business</option>
            </select>
          </div>

          {/* BUNDLE */}
          <div className="bg-[#D0F1AC] text-[#006600] px-6 py-4 rounded-xl font-semibold flex flex-wrap gap-4 items-center justify-center">
            💰 Bundle + Save
            <label><input type="checkbox" className="accent-[#0068EF] mr-2" /> Add hotel</label>
            <label><input type="checkbox" className="accent-[#0068EF] mr-2" /> Add car</label>
          </div>

          <button className="bg-[#00AA00] hover:bg-green-700 text-white w-full py-4 rounded-full font-bold mt-2">
            Find Your Flight
          </button>
        </div>
      </section>

      {/* PROMO BAR */}
      <div className="bg-gray-100 text-center py-4 text-[#001023] font-semibold">
        Looking for international flight deals? Call us at (833) 203-5879
      </div>

      {/* FEATURED DEALS */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-[#003C8A] mb-6">Price Drop Deals Near You</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              city: "Prince George",
              dates: "Aug 31 - Sep 7",
              price: "$145",
              oldPrice: "$483.07",
              img: "https://s1.pclncdn.com/email/images/air_missing_city_image_800x450_8.jpg?auto=compress&cs=tinysrgb&w=600",
              drop: "70% PRICE DROP"
            },
            {
              city: "Edmonton",
              dates: "Aug 4 - Aug 12",
              price: "$171",
              oldPrice: "$196.56",
              img: "https://s1.pclncdn.com/pcln/promotions/promotionsV2/SEM/CITY_ALL/CA-AB-EDMONTON-3000031161-900010106_city_shutterstock_1445647262.jpg?auto=compress&cs=tinysrgb&w=600",
              drop: "13% PRICE DROP"
            },
            {
              city: "Las Vegas",
              dates: "Jul 17 - Jul 22",
              price: "$189",
              oldPrice: "$389.79",
              img: "https://s1.pclncdn.com/pcln/promotions/promotionsV2/SEM/CITY_ALL/US-NV-LAS%20VEGAS-3000015284-900000011_city_pricelinehero.jpg?auto=compress&cs=tinysrgb&w=600",
              drop: "55% PRICE DROP"
            }
          ].map((deal, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">
              <img src={deal.img} alt={deal.city} className="h-48 w-full object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#003C8A] text-lg">{deal.city}</h3>
                  <div className="text-xs bg-[#D0F1AC] text-[#006600] px-2 py-1 rounded-full">{deal.drop}</div>
                </div>
                <div className="text-sm text-gray-600 mb-1">{deal.dates}</div>
                <div className="text-right">
                  <s className="text-sm text-gray-500">{deal.oldPrice}</s>
                  <div className="text-[#00AA00] text-xl font-bold">{deal.price}</div>
                </div>
                <button className="w-full mt-3 bg-[#EDF0F3] text-[#0068EF] py-2 rounded-full font-bold hover:bg-[#d9e4f2]">
                  Search Flight Times
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#003366] text-white py-6 text-center mt-10">
        © 2025 Utrippin. All rights reserved.
      </footer>
    </div>
  );
}
