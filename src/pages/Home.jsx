import { Link } from 'react-router-dom';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import SEOHead from '../components/common/seo-head';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="UTrippin - Your Personal Travel Planner & Buddy Finder"
        description="Plan trips, find travel buddies, and explore the world with AI-powered assistance. Your complete travel companion."
      />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-[#f9fafb] py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0055A5] mb-6">
            Welcome to Utrippin
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Your personal travel planner & buddy finder.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FIND BUDDY */}
            <Link
              to="/travel-buddy"
              className="group bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-8 flex flex-col items-center"
            >
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                ✈️
              </div>
              <h3 className="text-xl font-bold text-[#0055A5] mb-2">
                Find Travel Buddy
              </h3>
              <p className="text-gray-600 mb-4">
                Swipe to match with travelers who share your vibe.
              </p>
              <span className="text-[#FF6200] font-semibold mt-auto">
                Get Started →
              </span>
            </Link>

            {/* SEE MATCHES */}
            <Link
              to="/travel-matches"
              className="group bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-8 flex flex-col items-center"
            >
              <div className="bg-pink-50 p-4 rounded-full mb-4">
                ❤️
              </div>
              <h3 className="text-xl font-bold text-[#0055A5] mb-2">
                Your Matches
              </h3>
              <p className="text-gray-600 mb-4">
                View all your travel buddy connections.
              </p>
              <span className="text-[#FF6200] font-semibold mt-auto">
                View Matches →
              </span>
            </Link>

            {/* AI TRAVEL PLANNER */}
            <Link
              to="/ai-travel"
              className="group bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-8 flex flex-col items-center"
            >
              <div className="bg-green-50 p-4 rounded-full mb-4">
                🤖
              </div>
              <h3 className="text-xl font-bold text-[#0055A5] mb-2">
                AI Travel Planner
              </h3>
              <p className="text-gray-600 mb-4">
                Create trips, book flights, and plan adventures with AI.
              </p>
              <span className="text-[#FF6200] font-semibold mt-auto">
                Plan Now →
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
}