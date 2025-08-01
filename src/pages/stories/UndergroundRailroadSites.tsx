import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function UndergroundRailroadSites() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Underground Railroad Sites You Can Visit Today",
          text: "Educational travel to preserved Underground Railroad stations and safe houses",
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

      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-green-800">
        <img
          src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1200&h=400"
          alt="Underground Railroad Historical Sites"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-green-500/30 text-green-100 border-green-400/50 mb-4">History</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Underground Railroad Sites You Can Visit Today</h1>
            <div className="flex items-center space-x-6 text-green-100">
              <div className="flex items-center"><User className="h-4 w-4 mr-2" />Dr. Samuel Davis</div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />January 8, 2025</div>
              <div className="flex items-center"><Clock className="h-4 w-4 mr-2" />12 min read</div>
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Educational travel to preserved Underground Railroad stations and safe houses offers powerful opportunities to connect with the courage and determination of freedom seekers and their allies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Harriet Tubman National Historical Park</h2>
          <p className="text-gray-700 mb-6">
            Located in Auburn, New York, this park preserves the home and final resting place of Harriet Tubman. Visitors can tour the Harriet Tubman Home for the Aged, which she established, and learn about her incredible legacy as a conductor on the Underground Railroad.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">National Underground Railroad Freedom Center</h2>
          <p className="text-gray-700 mb-6">
            Cincinnati's Freedom Center offers comprehensive exhibits about slavery, the Underground Railroad, and contemporary freedom movements. The museum's location in Cincinnati is significant as the city was a major crossing point for freedom seekers traveling from Kentucky to Ohio.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Levi Coffin House</h2>
          <p className="text-gray-700 mb-6">
            Known as the "Grand Central Station" of the Underground Railroad, Levi Coffin's home in Fountain City, Indiana, helped more than 2,000 enslaved people reach freedom. The preserved house offers guided tours that detail the ingenious methods used to hide freedom seekers.
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