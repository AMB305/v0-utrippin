import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function NewBlackOwnedHotelsJanuary2025() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "January 2025: New Black-Owned Hotels Opening This Month",
          text: "Meet the Black American entrepreneurs launching luxury hotels and boutique accommodations",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to="/melanin" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Melanin Compass
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-900 to-pink-700">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=400"
          alt="New Black Owned Hotels 2025"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/50 mb-4">
              Business & Hospitality
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              January 2025: New Black-Owned Hotels Opening This Month
            </h1>
            <div className="flex items-center space-x-6 text-purple-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Utrippin Community
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 14, 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                12 min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Meet the Black American entrepreneurs launching luxury hotels and boutique accommodations across the US and Caribbean this month, representing a new wave of hospitality excellence and cultural celebration.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Heritage Collective - Charleston, SC</h2>
          <p className="text-gray-700 mb-6">
            Opening January 20th, The Heritage Collective represents the vision of husband-and-wife team Michael and Jasmine Roberts. This 45-room boutique hotel in Charleston's historic district celebrates Gullah culture and Low Country heritage through its design, dining, and guest experiences.
          </p>

          <p className="text-gray-700 mb-6">
            The hotel features locally-sourced materials, artwork from Black Southern artists, and a restaurant helmed by James Beard-nominated chef bringing modern interpretations to traditional Gullah cuisine. Each room tells a story of Charleston's rich African American history.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Melanin Manor - Martha's Vineyard, MA</h2>
          <p className="text-gray-700 mb-6">
            Entrepreneur Keisha Thompson transforms a historic Oak Bluffs property into Melanin Manor, a 12-room luxury inn celebrating the island's significance to Black American vacation traditions. Opening January 25th, the inn pays homage to the generations of Black families who made Martha's Vineyard their summer sanctuary.
          </p>

          <p className="text-gray-700 mb-6">
            The property features period furnishings, a private beach club, and curated experiences including historical tours and connections with longtime Black Vineyard residents who share stories of the island's unique cultural legacy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sankofa Suites - Accra, Ghana</h2>
          <p className="text-gray-700 mb-6">
            Ghanaian-American entrepreneur Kwame Asante opens Sankofa Suites in Accra on January 30th, specifically designed for Black Americans visiting Ghana for heritage tourism. The 30-suite property offers concierge services specializing in genealogy research, cultural immersion, and ancestral site visits.
          </p>

          <p className="text-gray-700 mb-6">
            The hotel partners with local historians and cultural experts to provide guests with meaningful connections to Ghanaian culture and potential family lineages, making it more than just accommodation—it's a bridge to ancestral heritage.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Jazz Quarter Residences - New Orleans, LA</h2>
          <p className="text-gray-700 mb-6">
            Former jazz musician turned entrepreneur Marcus Dufresne opens Jazz Quarter Residences on January 15th, offering luxury extended-stay accommodations in historic Treme. The property celebrates New Orleans' musical heritage with soundproof practice rooms, vintage instrument collections, and partnerships with local music schools.
          </p>

          <p className="text-gray-700 mb-6">
            Each suite is themed around different jazz legends, featuring original artwork, vinyl collections, and custom playlists. The property serves as both accommodation and cultural center, hosting weekly jazz sessions and music history discussions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Paradise Cove Resort - Barbados</h2>
          <p className="text-gray-700 mb-6">
            Caribbean hospitality veteran Angela Clarke opens Paradise Cove Resort on January 28th, a 25-room beachfront property on Barbados' platinum coast. The resort emphasizes wellness, featuring spa treatments using traditional Caribbean herbs and healing practices passed down through generations.
          </p>

          <p className="text-gray-700 mb-6">
            The property offers unique experiences including traditional fishing expeditions with local fishermen, cooking classes featuring Bajan cuisine, and historical tours exploring the island's African heritage and cultural traditions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Supporting Black Hospitality</h2>
          <p className="text-gray-700 mb-6">
            These openings represent more than new accommodations—they're symbols of economic empowerment and cultural preservation. Each property creates jobs in their communities while providing travelers with authentic, culturally-rich experiences that celebrate Black heritage and excellence.
          </p>

          <p className="text-gray-700 mb-6">
            The success of these ventures demonstrates the growing market for culturally-conscious hospitality, where travelers seek accommodations that reflect their values and provide meaningful connections to local communities and histories.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Booking Information</h2>
          <p className="text-gray-700 mb-6">
            All properties are now accepting reservations through their individual websites and major booking platforms. Several offer grand opening promotions throughout January, including complimentary cultural experiences and special rates for extended stays.
          </p>

          <p className="text-gray-700 mb-6">
            These hotels represent the future of Black hospitality—spaces that honor heritage, celebrate culture, and provide exceptional service while contributing to their communities' economic development and cultural preservation.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Button
              onClick={handleShare}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share this article
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}