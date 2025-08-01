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
          text: "Explore the cultural heart of the Harlem Renaissance through guided walking tours.",
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
            src="/placeholder.svg?height=400&width=800&text=Harlem+Renaissance+Walking+Tour" 
            alt="Harlem Renaissance Walking Tour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <Badge className="mb-3 bg-purple-600">Culture</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Harlem Renaissance Walking Tour
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>By Marcus Williams</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>January 18, 2025</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>6 min read</span>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            Step into the vibrant world of the Harlem Renaissance, where jazz filled the air, literary genius flourished, and Black culture experienced an unprecedented creative explosion. These walking tours bring history to life on the very streets where it happened.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Literary Route</h2>
          <p className="mb-4">
            Follow in the footsteps of literary giants who called Harlem home:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Langston Hughes House:</strong> 20 East 127th Street - Former home of the celebrated poet</li>
            <li><strong>Schomburg Center:</strong> Research library that preserves Black history and culture</li>
            <li><strong>Countee Cullen Library:</strong> Named after the Renaissance poet</li>
            <li><strong>Zora Neale Hurston Way:</strong> Street renamed to honor the author of "Their Eyes Were Watching God"</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Jazz and Music Heritage</h2>
          <p className="mb-4">
            Experience the birthplace of legendary jazz venues:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Apollo Theater:</strong> Legendary venue where stars were born</li>
            <li><strong>Cotton Club site:</strong> Famous (though segregated) jazz club location</li>
            <li><strong>Minton's Playhouse:</strong> Birthplace of bebop jazz</li>
            <li><strong>Lenox Lounge:</strong> Historic jazz club with Art Deco interior</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Visual Arts and Culture</h2>
          <p className="mb-4">
            Discover the artistic legacy of the Renaissance:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Studio Museum in Harlem:</strong> Contemporary African American art</li>
            <li><strong>Marcus Garvey Park:</strong> Community gathering place and cultural hub</li>
            <li><strong>Harlem Heritage Tours:</strong> Local guides sharing family stories</li>
            <li><strong>Street Art Murals:</strong> Modern interpretations of Renaissance themes</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Historic Residences and Hotels</h2>
          <p className="mb-4">
            See where Renaissance figures lived and socialized:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Striver's Row:</strong> Elegant townhouses where successful Black families lived</li>
            <li><strong>Hotel Theresa:</strong> "Waldorf of Harlem" that hosted Black celebrities</li>
            <li><strong>Abyssinian Baptist Church:</strong> Spiritual and political center led by Adam Clayton Powell Jr.</li>
            <li><strong>Mother AME Zion Church:</strong> "Freedom Church" with deep historical roots</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tour Options and Tips</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Guided Tour Options:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Harlem Heritage Tours:</strong> Local historian-led walks</li>
              <li><strong>Big Onion Walking Tours:</strong> Academic-style historical tours</li>
              <li><strong>Harlem Spirituals:</strong> Music-focused gospel and jazz tours</li>
              <li><strong>Self-Guided Apps:</strong> GPS-enabled historical narratives</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-3">Best Times to Visit:</h3>
            <ul className="list-disc pl-6">
              <li>Sunday mornings for gospel church services</li>
              <li>Weekend afternoons for vibrant street life</li>
              <li>Evening tours to experience jazz venues</li>
              <li>Special events during Black History Month (February)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dining Like the Renaissance</h2>
          <p className="mb-4">
            Complete your tour with authentic Harlem dining:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Sylvia's Restaurant:</strong> Soul food institution since 1962</li>
            <li><strong>Amy Ruth's:</strong> Famous for chicken and waffles</li>
            <li><strong>Red Rooster:</strong> Modern take on Harlem classics by Marcus Samuelsson</li>
            <li><strong>Minton's:</strong> Jazz club with contemporary soul food</li>
          </ul>

          <p className="text-lg text-gray-700 mt-8">
            Walking through Harlem today, you'll find a neighborhood that honors its Renaissance legacy while continuing to evolve. These tours offer a chance to connect with a pivotal moment in American cultural history and understand how its influence continues to shape art, music, and literature today.
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