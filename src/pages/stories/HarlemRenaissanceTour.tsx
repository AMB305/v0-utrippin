import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function HarlemRenaissanceTour() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Harlem Renaissance Walking Tour",
          text: "Explore the cultural heart of the Harlem Renaissance through guided walking tours",
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
      <section className="relative h-96 bg-gradient-to-r from-purple-900 to-gold-700">
        <img
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1200&h=400"
          alt="Harlem Renaissance Walking Tour"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/50 mb-4">
              Culture
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Harlem Renaissance Walking Tour
            </h1>
            <div className="flex items-center space-x-6 text-purple-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Marcus Williams
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 12, 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                6 min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Explore the cultural heart of the Harlem Renaissance through guided walking tours that bring to life the extraordinary period when Harlem became the epicenter of Black intellectual, cultural, and artistic expression.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Birth of a Cultural Movement</h2>
          <p className="text-gray-700 mb-6">
            The Harlem Renaissance, spanning roughly from 1918 to 1937, transformed a Manhattan neighborhood into the "Black Mecca" of America. This cultural explosion produced some of the most influential writers, musicians, artists, and intellectuals in American history.
          </p>

          <p className="text-gray-700 mb-6">
            Our guided walking tours take you through the very streets where Langston Hughes penned his poetry, where Duke Ellington's music filled the night air, and where Marcus Garvey preached his message of Black pride and unity.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Essential Stops on the Tour</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Apollo Theater</h3>
          <p className="text-gray-700 mb-4">
            No Harlem tour is complete without visiting the legendary Apollo Theater. Since 1934, this venue has launched the careers of countless Black entertainers and remains a symbol of Harlem's enduring cultural significance.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Schomburg Center</h3>
          <p className="text-gray-700 mb-4">
            Originally the private collection of Arturo Alfonso Schomburg, this research center became a gathering place for Renaissance intellectuals. Today, it houses one of the world's largest collections of materials related to the African diaspora.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Cotton Club Site</h3>
          <p className="text-gray-700 mb-4">
            While the original Cotton Club is long gone, we visit the site where this famous jazz club once stood. Despite its segregated audience policy, the club showcased incredible Black talent and helped spread jazz music worldwide.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Langston Hughes House</h3>
          <p className="text-gray-700 mb-4">
            Visit the restored brownstone where the "Poet Laureate of Harlem" lived from 1947 until his death in 1967. Hughes captured the rhythm and spirit of Harlem life in poems that continue to resonate today.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Literary Landmarks</h2>
          <p className="text-gray-700 mb-6">
            The tour highlights the homes and gathering places of Renaissance writers including Zora Neale Hurston, Claude McKay, and Jean Toomer. We visit the sites of literary salons hosted by A'Lelia Walker and other patrons who supported emerging artists.
          </p>

          <p className="text-gray-700 mb-6">
            Learn about the magazines and publications like "The Crisis" and "Opportunity" that provided platforms for new voices and helped define the intellectual discourse of the era.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Musical Heritage</h2>
          <p className="text-gray-700 mb-6">
            Harlem's musical legacy goes beyond jazz to include gospel, blues, and early hip-hop. Our tour covers the venues where Duke Ellington, Cab Calloway, and Billie Holiday performed, as well as the churches where gospel music flourished.
          </p>

          <p className="text-gray-700 mb-6">
            We explore how the musical innovations of the Renaissance period laid the groundwork for all American popular music that followed, from bebop to R&B to hip-hop.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Visual Arts and Architecture</h2>
          <p className="text-gray-700 mb-6">
            The tour showcases the architectural beauty of Harlem's historic brownstones and examines how visual artists like Aaron Douglas and Augusta Savage contributed to the Renaissance movement through their paintings and sculptures.
          </p>

          <p className="text-gray-700 mb-6">
            We visit galleries and studios where contemporary artists continue the tradition of using art to explore and celebrate Black identity and experience.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Political and Social Movements</h2>
          <p className="text-gray-700 mb-6">
            The Renaissance wasn't just about arts and culture—it was also a time of significant political awakening. We explore Marcus Garvey's Universal Negro Improvement Association headquarters and discuss how the period laid groundwork for the later Civil Rights Movement.
          </p>

          <p className="text-gray-700 mb-6">
            Learn about the debates between different approaches to achieving racial equality, from W.E.B. Du Bois's "Talented Tenth" to Garvey's Back-to-Africa movement.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Modern Harlem and Continuing Legacy</h2>
          <p className="text-gray-700 mb-6">
            Our tour concludes by examining how the Harlem Renaissance continues to influence contemporary culture. We visit modern cultural institutions and discuss ongoing efforts to preserve Harlem's historic character while embracing its evolution.
          </p>

          <p className="text-gray-700 mb-6">
            Today's Harlem reflects both the achievements and challenges of gentrification, as long-time residents work to maintain the neighborhood's cultural identity while welcoming new development and residents.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tour Information</h2>
          <p className="text-gray-700 mb-6">
            Tours are offered daily and last approximately 2.5 hours. Experienced guides provide historical context and share stories that bring the Renaissance period to life. Group tours and private tours are available, with special rates for students and seniors.
          </p>

          <p className="text-gray-700 mb-6">
            Each tour includes stops at 8-10 significant locations, with opportunities for questions and discussion. Tours run year-round, rain or shine, so dress appropriately for the weather.
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