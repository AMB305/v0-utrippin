import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function BlackTravelTrends2025() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "2025 Black Travel Trends: Where Melanin Travelers Are Heading This Year",
          text: "Discover the hottest destinations and travel trends for Black Americans in 2025.",
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/melanin" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Melanin Compass
        </Link>

        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <img 
            src="/placeholder.svg?height=400&width=800&text=2025+Black+Travel+Trends" 
            alt="2025 Black Travel Trends"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <Badge className="mb-3 bg-green-600">Trends</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                2025 Black Travel Trends: Where Melanin Travelers Are Heading This Year
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>By Utrippin Editorial Team</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>January 20, 2025</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>12 min read</span>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            As we enter 2025, Black travelers are reshaping the tourism landscape with new priorities, destinations, and travel styles. From heritage tourism to luxury experiences, here are the top trends defining Black travel this year.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Heritage Tourism Renaissance</h2>
          <p className="mb-4">
            More Black travelers are seeking connections to their roots through heritage tourism. Popular destinations include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Ghana's Year of Return:</strong> Extended programs welcoming African diaspora</li>
            <li><strong>Civil Rights Trail:</strong> Sites across the American South gaining renewed interest</li>
            <li><strong>Caribbean Heritage Tours:</strong> Exploring ancestral connections in Jamaica, Barbados, and Trinidad</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Luxury Black Travel Experiences</h2>
          <p className="mb-4">
            The luxury travel market is seeing unprecedented growth among Black travelers:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Private villa rentals in destinations like Martha's Vineyard and Sag Harbor</li>
            <li>High-end safari experiences in Kenya and Tanzania</li>
            <li>Luxury cruise ships with specialized programming for Black travelers</li>
            <li>Michelin-starred restaurants owned by Black chefs becoming travel destinations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Solo Black Female Travel</h2>
          <p className="mb-4">
            Black women are leading the solo travel revolution with:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Safety-focused travel apps and communities</li>
            <li>Women-only group tours to destinations like Morocco and India</li>
            <li>Wellness retreats combining travel with self-care</li>
            <li>Photography tours designed for content creation</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Sustainable and Conscious Travel</h2>
          <p className="mb-4">
            Environmental consciousness is driving travel choices:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Eco-lodges in Costa Rica and Rwanda</li>
            <li>Carbon-neutral travel options</li>
            <li>Supporting Black-owned businesses as a form of economic tourism</li>
            <li>Volunteer tourism combining travel with community service</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Tech-Enhanced Travel Planning</h2>
          <p className="mb-4">
            Technology is revolutionizing how Black travelers plan and experience trips:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>AI-powered travel assistants understanding cultural preferences</li>
            <li>VR previews of destinations and accommodations</li>
            <li>Blockchain-based travel rewards programs</li>
            <li>Real-time safety and cultural awareness apps</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top Destinations for 2025</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">International Hotspots:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Dubai, UAE - Luxury shopping and dining</li>
              <li>Lagos, Nigeria - Business and cultural tourism</li>
              <li>São Paulo, Brazil - Art, culture, and nightlife</li>
              <li>Cape Town, South Africa - Wine country and history</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-3">Domestic Favorites:</h3>
            <ul className="list-disc pl-6">
              <li>Atlanta, Georgia - Black business capital</li>
              <li>New Orleans, Louisiana - Culture and cuisine</li>
              <li>Oakland, California - Tech and innovation</li>
              <li>Nashville, Tennessee - Music and emerging food scene</li>
            </ul>
          </div>

          <p className="text-lg text-gray-700 mt-8">
            These trends reflect a mature, diverse, and influential travel market that's driving innovation across the tourism industry. As Black travelers continue to prioritize authentic experiences, cultural connections, and luxury amenities, we can expect to see even more tailored offerings in the years to come.
          </p>
        </article>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share this article
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}