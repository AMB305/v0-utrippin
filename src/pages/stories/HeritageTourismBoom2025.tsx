import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function HeritageTourismBoom2025() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Heritage Tourism Boom: Ghana and Senegal See Record Visitors",
          text: "African countries experiencing unprecedented interest from Black American travelers",
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
      <section className="relative h-96 bg-gradient-to-r from-green-900 to-yellow-700">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42d?auto=format&fit=crop&w=1200&h=400"
          alt="Heritage Tourism Africa"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-green-500/30 text-green-100 border-green-400/50 mb-4">
              Heritage Travel
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Heritage Tourism Boom: Ghana and Senegal See Record Visitors
            </h1>
            <div className="flex items-center space-x-6 text-green-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                RSS App Custom Feed
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 12, 2025
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
            African countries are experiencing unprecedented interest from Black American travelers seeking to connect with their roots, with Ghana and Senegal leading a historic surge in heritage tourism.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Record-Breaking Numbers</h2>
          <p className="text-gray-700 mb-6">
            Ghana's tourism ministry reports a 400% increase in Black American visitors compared to 2019, with over 250,000 African Americans visiting the country in 2024. Senegal has seen similar growth, with heritage tourism accounting for 60% of all American visitors to the West African nation.
          </p>

          <p className="text-gray-700 mb-6">
            This surge represents more than just tourism statistics—it's a cultural renaissance as African Americans increasingly seek to understand their ancestral connections and explore the continent's rich history.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ghana's "Year of Return" Legacy</h2>
          <p className="text-gray-700 mb-6">
            Building on the success of Ghana's 2019 "Year of Return" campaign, which marked 400 years since the first enslaved Africans arrived in Virginia, the country has continued to develop infrastructure and programs specifically designed for heritage tourists.
          </p>

          <p className="text-gray-700 mb-6">
            Key attractions include the Cape Coast Castle, Elmina Castle, and the Panafest cultural festival. The government has also streamlined visa processes and launched the "Right of Abode" program, allowing African Americans to stay in Ghana for extended periods.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Senegal's Cultural Renaissance</h2>
          <p className="text-gray-700 mb-6">
            Senegal has positioned itself as a gateway to African heritage, with Gorée Island serving as a powerful symbol of the transatlantic slave trade. The island's House of Slaves museum has become a pilgrimage site for Black Americans seeking to understand their history.
          </p>

          <p className="text-gray-700 mb-6">
            The country's investment in cultural preservation and tourism infrastructure has created immersive experiences that go beyond traditional sightseeing, offering genealogy research services, traditional ceremonies, and connections with local communities.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Economic Impact</h2>
          <p className="text-gray-700 mb-6">
            The heritage tourism boom has generated significant economic benefits for both countries. In Ghana, heritage tourism contributes over $2 billion annually to the economy, supporting thousands of jobs in hospitality, transportation, and cultural services.
          </p>

          <p className="text-gray-700 mb-6">
            Local communities have embraced this opportunity, with many families offering homestay experiences and cultural exchanges that provide authentic connections between African Americans and their African counterparts.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Expanding Beyond Traditional Destinations</h2>
          <p className="text-gray-700 mb-6">
            The success in Ghana and Senegal has inspired other African nations to develop their own heritage tourism programs. Countries like Nigeria, Benin, and Sierra Leone are investing in historical site preservation and marketing campaigns targeting African American travelers.
          </p>

          <p className="text-gray-700 mb-6">
            This expansion promises to create a comprehensive African heritage tourism network, allowing travelers to explore multiple countries and gain a broader understanding of their ancestral connections.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Personal Transformations</h2>
          <p className="text-gray-700 mb-6">
            For many travelers, these heritage trips represent profound personal journeys. Visitors often describe feeling a deep spiritual connection to the land and experiencing a sense of homecoming that transforms their understanding of identity and belonging.
          </p>

          <p className="text-gray-700 mb-6">
            "Walking through the Door of No Return and then walking back through it—coming home—was one of the most powerful experiences of my life," shared one visitor from Atlanta. "It connected me to my ancestors in a way I never thought possible."
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
