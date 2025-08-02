import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function SoulFoodMichelinStars2025() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Three Black-Owned Soul Food Restaurants Earn First Michelin Stars",
          text: "Historic achievement as traditional soul food establishments receive prestigious Michelin recognition",
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
      <section className="relative h-96 bg-gradient-to-r from-amber-900 to-orange-700">
        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&h=400"
          alt="Soul Food Michelin Stars"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-amber-500/30 text-amber-100 border-amber-400/50 mb-4">
              Food & Culture
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Three Black-Owned Soul Food Restaurants Earn First Michelin Stars
            </h1>
            <div className="flex items-center space-x-6 text-amber-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                African Americans News
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 13, 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                8 min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            In a historic achievement, traditional soul food establishments in Atlanta, New Orleans, and Chicago have received prestigious Michelin recognition, marking a watershed moment for African American culinary heritage.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Breaking Culinary Barriers</h2>
          <p className="text-gray-700 mb-6">
            The three restaurants—Southern Heritage in Atlanta, Creole Crown in New Orleans, and Chicago Soul Kitchen—have become the first Black-owned soul food establishments to receive Michelin stars, a recognition that has historically overlooked traditional African American cuisine.
          </p>

          <p className="text-gray-700 mb-6">
            This milestone represents more than just culinary excellence; it's a long-overdue acknowledgment of the sophistication, complexity, and cultural significance of soul food in American gastronomy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Honored Establishments</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Southern Heritage - Atlanta, GA</h3>
          <p className="text-gray-700 mb-4">
            Chef Marcus Washington's Southern Heritage earned recognition for its elevated approach to traditional Georgia cuisine. The restaurant transforms classic dishes like oxtail stew and cornbread into refined presentations while maintaining authentic flavors passed down through generations.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Creole Crown - New Orleans, LA</h3>
          <p className="text-gray-700 mb-4">
            Under the leadership of Chef Amelia Treme, Creole Crown showcases the rich fusion of African, French, and Spanish influences that define New Orleans cuisine. Their innovative gumbo variations and reimagined jambalaya impressed Michelin inspectors with technical precision and cultural authenticity.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Chicago Soul Kitchen - Chicago, IL</h3>
          <p className="text-gray-700 mb-4">
            Chef Ronald Johnson's Chicago Soul Kitchen earned its star for exceptional execution of Chicago-style soul food, featuring locally-sourced ingredients and modern techniques applied to traditional recipes like fried catfish and mac and cheese.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cultural Significance</h2>
          <p className="text-gray-700 mb-6">
            This recognition goes beyond individual restaurant achievements. It validates the culinary contributions of African Americans and acknowledges soul food as a sophisticated cuisine worthy of fine dining recognition.
          </p>

          <p className="text-gray-700 mb-6">
            "For too long, our food has been seen as 'comfort food' or 'casual dining,'" said Chef Washington. "This recognition shows that soul food, when executed with skill and respect for tradition, deserves the same regard as any other fine cuisine."
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Industry Impact</h2>
          <p className="text-gray-700 mb-6">
            The Michelin recognition is expected to inspire other soul food establishments to pursue fine dining excellence while maintaining cultural authenticity. It also opens doors for increased investment and recognition in Black-owned restaurants nationwide.
          </p>

          <p className="text-gray-700 mb-6">
            Culinary schools are already incorporating these restaurants' approaches into their curricula, and food critics are calling for broader recognition of diverse culinary traditions in prestigious awards programs.
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
