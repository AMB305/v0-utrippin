import React from "react";

export default function FlightsPage() {
  return (
    <div className="font-sans">
      {/* NAVBAR */}
      <div className="bg-[#0068EF] text-white py-4 px-6 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Priceline_logo.svg/2560px-Priceline_logo.svg.png"
            alt="Priceline"
            className="h-6"
          />
          <nav className="hidden md:flex gap-4">
            <a className="hover:underline" href="#">Hotels</a>
            <a className="hover:underline" href="#">Cars</a>
            <a className="font-bold border-b-2 border-white pb-1" href="#">Flights</a>
            <a className="hover:underline" href="#">Packages</a>
            <a className="hover:underline" href="#">Cruises</a>
            <a className="hover:underline" href="#">Experiences</a>
          </nav>
        </div>
        <button className="bg-white text-[#0068EF] px-4 py-1 rounded-full font-bold">
          Sign In / Join VIP
        </button>
      </div>

      {/* HERO + SEARCH */}
      <div className="bg-[#004499] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto py-20 px-6">
          <h1 className="text-4xl font-bold mb-4">Find your next flight deal</h1>
          <div className="flex gap-4 text-sm mb-4">
            <button className="bg-white text-[#004499] px-4 py-2 rounded-full font-bold">Round-trip</button>
            <button className="bg-[#004499] border border-white px-4 py-2 rounded-full">One-way</button>
            <button className="bg-[#004499] border border-white px-4 py-2 rounded-full">Multi-destination</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Departing from?"
              className="p-4 rounded-xl w-full text-black"
            />
            <input
              type="text"
              placeholder="Going to?"
              className="p-4 rounded-xl w-full text-black"
            />
            <input
              type="text"
              placeholder="Departing - Returning"
              className="p-4 rounded-xl w-full text-black md:col-span-2"
            />
          </div>
          <div className="flex gap-4 mb-4 flex-col md:flex-row">
            <select className="p-4 rounded-xl w-full text-black">
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First</option>
            </select>
            <button className="bg-[#00AA00] hover:bg-green-700 px-8 py-4 rounded-xl w-full font-bold">
              Find Your Flight
            </button>
          </div>
          <div className="bg-[#D0F1AC] text-[#006600] px-6 py-3 rounded-xl inline-flex gap-4 items-center text-sm font-bold">
            <span>Bundle + Save</span>
            <label><input type="checkbox" className="accent-[#0068EF] mr-1" /> Add hotel</label>
            <label><input type="checkbox" className="accent-[#0068EF] mr-1" /> Add car</label>
          </div>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="bg-[#F4F6F8] text-center py-4 text-sm font-semibold text-[#001023]">
        Looking for international flight deals? Call us at 1 (833) 203-5879
      </div>

      {/* PRICE DROP DEALS */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-[#003C8A] mb-6">Price Drop Deals Near You</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              city: "Prince George",
              dates: "Aug 31 - Sep 7",
              price: "$145",
              oldPrice: "$483.07",
              img: "https://s1.pclncdn.com/email/images/air_missing_city_image_800x450_8.jpg?auto=compress&cs=tinysrgb&w=600",
              drop: "70% PRICE DROP",
            },
            {
              city: "Edmonton",
              dates: "Aug 4 - Aug 12",
              price: "$171",
              oldPrice: "$196.56",
              img: "https://s1.pclncdn.com/pcln/promotions/promotionsV2/SEM/CITY_ALL/CA-AB-EDMONTON-3000031161-900010106_city_shutterstock_1445647262.jpg?auto=compress&cs=tinysrgb&w=600",
              drop: "13% PRICE DROP",
            },
            {
              city: "Las Vegas",
              dates: "Jul 17 - Jul 22",
              price: "$189",
              oldPrice: "$389.79",
              img: "https://s1.pclncdn.com/pcln/promotions/promotionsV2/SEM/CITY_ALL/US-NV-LAS%20VEGAS-3000015284-900000011_city_pricelinehero.jpg?auto=compress&cs=tinysrgb&w=600",
              drop: "55% PRICE DROP",
            },
          ].map((deal, i) => (
            <div key={i} className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <img src={deal.img} alt={deal.city} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-[#003C8A] mb-1">{deal.city}</h3>
                <div className="text-xs bg-[#D0F1AC] text-[#006600] px-2 py-1 rounded-full inline-block mb-2">{deal.drop}</div>
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span>{deal.dates}</span>
                  <div className="text-right">
                    <s>{deal.oldPrice}</s><br/>
                    <span className="text-[#00AA00] font-bold text-lg">{deal.price}</span>
                  </div>
                </div>
                <button className="w-full bg-[#EDF0F3] text-[#0068EF] font-bold py-2 rounded-full hover:bg-[#d9e4f2]">
                  Search Flight Times
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}