import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock, Share2, Plane, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function BlackOwnedAirlineCaribbean() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/melanin" className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Melanin Compass
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src="/placeholder.svg?height=400&width=1200&text=Black+Owned+Airline+Caribbean+Routes"
          alt="Black-Owned Airline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">Business News</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Black-Owned Airline Announces New Caribbean Routes
            </h1>
            <div className="flex items-center space-x-6 text-gray-300">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>RSS App Custom Feed</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>January 14, 2025</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            A minority-owned airline is making waves in the aviation industry by announcing a major expansion of service
            to popular Caribbean destinations, offering competitive rates and culturally authentic travel experiences
            for Black travelers.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6">Expanding Caribbean Access</h2>
          <p className="text-gray-300 mb-6">
            Heritage Airways, founded by entrepreneur Marcus Johnson in 2020, has announced new direct routes from major
            US cities to key Caribbean destinations. The expansion represents a significant milestone for Black-owned
            businesses in the aviation sector.
          </p>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">
              <Plane className="h-5 w-5 inline mr-2" />
              New Routes Include:
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Miami to Kingston, Jamaica (Daily)</li>
              <li>• Atlanta to Bridgetown, Barbados (4x weekly)</li>
              <li>• New York to Port of Spain, Trinidad (3x weekly)</li>
              <li>• Houston to Santo Domingo, Dominican Republic (Daily)</li>
              <li>• Los Angeles to Nassau, Bahamas (3x weekly)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Cultural Connection</h2>
          <p className="text-gray-300 mb-6">
            Heritage Airways differentiates itself by offering more than just transportation. The airline provides
            culturally authentic experiences, including Caribbean cuisine on flights, partnerships with local
            Black-owned businesses at destinations, and cultural orientation materials for travelers.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6">Competitive Pricing</h2>
          <p className="text-gray-300 mb-6">
            The airline is committed to making Caribbean travel more accessible to Black families and travelers.
            Introductory fares start at $299 roundtrip, with special packages that include accommodations at Black-owned
            hotels and resorts throughout the Caribbean.
          </p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              <MapPin className="h-5 w-5 inline mr-2" />
              Community Impact:
            </h3>
            <p className="text-gray-300">
              "We're not just moving people from point A to point B," says CEO Marcus Johnson. "We're connecting the
              African diaspora, supporting Black-owned businesses, and making travel more inclusive and culturally
              meaningful."
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Launch Timeline</h2>
          <p className="text-gray-300 mb-8">
            The new routes will begin service in March 2025, with bookings opening February 1st. The airline plans to
            add additional Caribbean destinations based on demand, with potential routes to Antigua, St. Lucia, and
            Grenada under consideration for late 2025.
          </p>
        </div>

        {/* Share Section */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Share this article</h3>
              <p className="text-gray-400">Support Black-owned businesses in aviation</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
