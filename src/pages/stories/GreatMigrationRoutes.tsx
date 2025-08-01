import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function GreatMigrationRoutes() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "The Great Migration Routes: Tracing Our Ancestors' Journey",
          text: "Follow the historic paths taken by millions of African Americans during the Great Migration.",
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
            src="/placeholder.svg?height=400&width=800&text=Great+Migration+Routes" 
            alt="The Great Migration Routes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <Badge className="mb-3 bg-blue-600">History</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                The Great Migration Routes: Tracing Our Ancestors' Journey
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>By Dr. Keisha Brown</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>January 15, 2025</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>8 min read</span>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            Between 1910 and 1970, approximately six million African Americans moved from the rural South to urban areas in the North, Midwest, and West. Today, travelers can follow these historic routes and visit significant sites that tell the story of this transformative period in American history.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Northern Route</h2>
          <p className="mb-4">
            The Northern route primarily led from Mississippi, Alabama, and Tennessee to Chicago, Detroit, and other Midwest cities. Key stops along this route include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Chicago's Bronzeville:</strong> Visit the historic heart of Black Chicago, including the Chicago Defender newspaper building</li>
            <li><strong>Detroit's Black Bottom:</strong> Explore the former neighborhood that housed many migrants</li>
            <li><strong>Mississippi Delta:</strong> Start your journey where many migrants began theirs</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Eastern Route</h2>
          <p className="mb-4">
            This path took migrants from Georgia, South Carolina, and Florida to New York, Philadelphia, and Boston:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Harlem, New York:</strong> The cultural capital of Black America during the migration period</li>
            <li><strong>Philadelphia's North Side:</strong> A major destination for Southern migrants</li>
            <li><strong>Savannah, Georgia:</strong> An important departure point</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Western Route</h2>
          <p className="mb-4">
            From Texas, Louisiana, and Arkansas to California and the Pacific Northwest:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Los Angeles' Central Avenue:</strong> The jazz and cultural hub of Black LA</li>
            <li><strong>Oakland, California:</strong> Home to many migrants who worked in shipyards</li>
            <li><strong>Seattle's Central District:</strong> The heart of Black Seattle</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Planning Your Great Migration Journey</h2>
          <p className="mb-4">
            Modern travelers can trace these routes using scenic highways and visiting museums, cultural centers, and historic neighborhoods. Consider these travel tips:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Start at the National Museum of African American History and Culture in Washington, D.C.</li>
            <li>Use the Green Book Heritage Trail to find historic Black-owned businesses</li>
            <li>Visit local historical societies and museums in migration destinations</li>
            <li>Connect with local communities to hear family migration stories</li>
          </ul>

          <p className="text-lg text-gray-700 mt-8">
            The Great Migration represents one of the largest internal movements of people in American history. By retracing these routes, we honor our ancestors' courage and better understand how their journeys shaped the America we know today.
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