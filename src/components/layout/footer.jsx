import React from "react";

export default function Footer() {
  return (
    <>
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
    </>
  );
}