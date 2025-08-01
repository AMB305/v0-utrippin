import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function BlackBeachTowns() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Black Beach Towns: Martha's Vineyard to Sag Harbor",
          text: "Discover historic Black beach communities along the East Coast",
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
      <section className="relative h-96 bg-gradient-to-r from-teal-900 to-blue-700">
        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&h=400"
          alt="Historic Black Beach Communities"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-teal-500/30 text-teal-100 border-teal-400/50 mb-4">
              Destinations
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Black Beach Towns: Martha's Vineyard to Sag Harbor
            </h1>
            <div className="flex items-center space-x-6 text-teal-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Amara Johnson
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 10, 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                10 min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Discover historic Black beach communities along the East Coast, where generations of African American families have created lasting legacies of culture, community, and coastal tradition.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Martha's Vineyard: The Crown Jewel</h2>
          <p className="text-gray-700 mb-6">
            Martha's Vineyard, particularly the Oak Bluffs area, has been a beacon for Black vacationers since the late 1800s. The island's inclusive Methodist camp meetings attracted Black families who found refuge from mainland discrimination in this island paradise.
          </p>

          <p className="text-gray-700 mb-6">
            The colorful gingerbread cottages of Oak Bluffs tell stories of generations of Black families who built summer traditions here. Today, the island continues to attract prominent Black Americans, from business leaders to entertainers, who value both its natural beauty and its welcoming history.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sag Harbor: The Hamptons' Hidden Gem</h2>
          <p className="text-gray-700 mb-6">
            Sag Harbor in the Hamptons has quietly maintained its status as a summer haven for Black professionals and families for over 50 years. The SANS (Sag Harbor Hills, Azurest, and Ninevah Beach) community represents one of the most significant concentrations of Black beachfront property ownership in the country.
          </p>

          <p className="text-gray-700 mb-6">
            This enclave was developed in the 1940s and 1950s when Black families were excluded from other Hamptons communities. Today, it's home to a close-knit community that includes judges, doctors, entrepreneurs, and celebrities who gather each summer to maintain traditions of fellowship and cultural celebration.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Highland Beach, Maryland: The First Resort</h2>
          <p className="text-gray-700 mb-6">
            Often called the "first Black beach resort," Highland Beach was founded in 1893 by Charles Douglass, son of Frederick Douglass, after the family was turned away from a whites-only resort. This Chesapeake Bay community became a summer retreat for Black intellectuals, professionals, and activists.
          </p>

          <p className="text-gray-700 mb-6">
            The community attracted luminaries like Langston Hughes, Paul Laurence Dunbar, and Supreme Court Justice Thurgood Marshall. Today, Highland Beach maintains its exclusive character while continuing to serve as a gathering place for prominent Black families.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Oak Beach, New York: Long Island's Legacy</h2>
          <p className="text-gray-700 mb-6">
            Oak Beach, located on Long Island's Fire Island, has been a summer destination for Black New Yorkers since the 1960s. The community developed as an affordable alternative to more expensive coastal areas, allowing middle-class Black families to establish beachfront traditions.
          </p>

          <p className="text-gray-700 mb-6">
            The area is known for its relaxed atmosphere, family-friendly environment, and strong sense of community. Annual events like the Labor Day celebration have become legendary gatherings that attract visitors from across the tri-state area.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">American Beach, Florida: Amelia Island's Treasure</h2>
          <p className="text-gray-700 mb-6">
            American Beach on Amelia Island was founded in 1935 by the Afro-American Life Insurance Company as a beach resort for Black families during segregation. This 30-acre beachfront community provided a place where Black families could enjoy ocean vacations without facing discrimination.
          </p>

          <p className="text-gray-700 mb-6">
            Today, American Beach is listed on the National Register of Historic Places and continues to operate as a resort community. Efforts to preserve its historic character while accommodating modern tourism have made it a model for heritage tourism development.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Atlantic Beach, South Carolina: The Grand Strand's Heart</h2>
          <p className="text-gray-700 mb-6">
            Known as "The Black Pearl," Atlantic Beach is the only historically Black-owned beach community remaining along the Grand Strand. Established in the 1930s, it became a vital destination during segregation when Black families were excluded from other coastal areas.
          </p>

          <p className="text-gray-700 mb-6">
            The town has faced challenges from development pressure and natural disasters, but the community remains committed to preserving its unique character and serving as a welcoming destination for Black families seeking authentic coastal experiences.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cultural Traditions and Community</h2>
          <p className="text-gray-700 mb-6">
            These beach communities share common traditions that strengthen their cultural bonds. Family reunions, church services on the beach, community fish fries, and annual celebrations create rhythms of connection that span generations.
          </p>

          <p className="text-gray-700 mb-6">
            The oral histories preserved in these communities tell stories of resilience, joy, and determination. Children who spent summers in these places often return as adults to continue family traditions and introduce new generations to the magic of Black beach culture.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Preservation Challenges and Opportunities</h2>
          <p className="text-gray-700 mb-6">
            Many historic Black beach communities face challenges from gentrification, climate change, and development pressure. Rising property values can displace longtime residents, while coastal erosion threatens the physical landscape that defines these places.
          </p>

          <p className="text-gray-700 mb-6">
            However, new generations of Black professionals are working to preserve these communities through conservation efforts, heritage tourism development, and community organizing. These efforts ensure that future generations can experience the unique culture and history of Black beach towns.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Planning Your Visit</h2>
          <p className="text-gray-700 mb-6">
            When visiting these historic communities, travelers can support preservation efforts by choosing Black-owned accommodations, restaurants, and tour operators. Many communities offer historical tours that provide insight into their development and cultural significance.
          </p>

          <p className="text-gray-700 mb-6">
            The best times to visit are during community festivals and celebrations when the full vibrancy of these places is on display. These events offer opportunities to experience the culture, meet longtime residents, and understand the continuing evolution of these special places.
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