import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function BlackCowboysHeritage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Black Cowboys: Western Heritage Tours",
          text: "Learn about the often-overlooked history of Black cowboys in the American West",
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
      
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/melanin" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Melanin Compass
          </Link>
        </div>
      </div>

      <section className="relative h-96 bg-gradient-to-r from-orange-900 to-red-700">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42d?auto=format&fit=crop&w=1200&h=400"
          alt="Black Cowboys Western Heritage"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-orange-500/30 text-orange-100 border-orange-400/50 mb-4">Heritage</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Black Cowboys: Western Heritage Tours</h1>
            <div className="flex items-center space-x-6 text-orange-100">
              <div className="flex items-center"><User className="h-4 w-4 mr-2" />Maya Rodriguez</div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />January 5, 2025</div>
              <div className="flex items-center"><Clock className="h-4 w-4 mr-2" />9 min read</div>
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Learn about the often-overlooked history of Black cowboys in the American West, where approximately one in four cowboys was African American during the height of the cattle drive era.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Hidden History</h2>
          <p className="text-gray-700 mb-6">
            Between 1866 and 1895, an estimated 35,000 Black cowboys worked the cattle trails and ranches of the American West. These men, many of them formerly enslaved, found opportunities for freedom and economic advancement on the frontier that were denied to them in the post-Civil War South.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bill Pickett and the 101 Ranch</h2>
          <p className="text-gray-700 mb-6">
            Bill Pickett, inventor of bulldogging (steer wrestling), became one of the most famous rodeo performers of his era. Tours of Oklahoma's 101 Ranch site tell his story and that of other Black cowboys who helped shape Western culture and the modern rodeo.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Button onClick={handleShare} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white">
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
