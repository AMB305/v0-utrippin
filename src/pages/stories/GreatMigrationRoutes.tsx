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
          text: "Follow the historic paths taken by millions of African Americans during the Great Migration",
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
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-blue-800">
        <img
          src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1200&h=400"
          alt="Great Migration Historical Routes"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-blue-500/30 text-blue-100 border-blue-400/50 mb-4">
              History
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Great Migration Routes: Tracing Our Ancestors' Journey
            </h1>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Dr. Keisha Brown
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 15, 2025
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
            Follow the historic paths taken by millions of African Americans during the Great Migration, one of the most significant demographic movements in American history that reshaped the cultural landscape of our nation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding the Great Migration</h2>
          <p className="text-gray-700 mb-6">
            Between 1916 and 1970, approximately six million African Americans left the rural South for urban areas in the North, Midwest, and West. This massive population shift was driven by economic opportunities, escape from Jim Crow laws, and the search for a better life.
          </p>

          <p className="text-gray-700 mb-6">
            The migration occurred in two main waves: the first from 1916-1940 and the second from 1940-1970. Each wave had distinct characteristics and destinations, creating a complex network of routes that connected Southern communities to Northern cities.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Major Routes</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Atlantic Coast Route</h3>
          <p className="text-gray-700 mb-4">
            This route carried migrants from Virginia, the Carolinas, Georgia, and Florida to cities like New York, Philadelphia, Boston, and Washington D.C. The Pennsylvania Railroad and Atlantic Coast Line were crucial transportation networks for this movement.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Mississippi River Route</h3>
          <p className="text-gray-700 mb-4">
            Following the Mississippi River north, this route connected the Deep South—Mississippi, Alabama, Louisiana, and Arkansas—to Chicago, Detroit, Cleveland, and other Midwest industrial centers. The Illinois Central Railroad was a primary carrier for this migration stream.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Western Route</h3>
          <p className="text-gray-700 mb-4">
            Less traveled but significant, this route took migrants from Texas and Louisiana to California, particularly Los Angeles and San Francisco. The Santa Fe Railway and other western lines facilitated this westward movement.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Destinations and Their Stories</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Chicago: The Promised Land</h3>
          <p className="text-gray-700 mb-4">
            Chicago became the symbol of Northern opportunity, with its South Side becoming a vibrant center of Black culture. The Chicago Defender newspaper actively encouraged migration, and the city's industrial jobs attracted hundreds of thousands of Southern migrants.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Harlem: Cultural Renaissance</h3>
          <p className="text-gray-700 mb-4">
            New York's Harlem neighborhood became the epicenter of Black intellectual and cultural life. The concentration of migrants from across the South created a unique environment that fostered the Harlem Renaissance.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Detroit: Motor City Dreams</h3>
          <p className="text-gray-700 mb-4">
            The automobile industry's growth made Detroit a major destination. Henry Ford's $5 per day wage attracted thousands of Southern migrants seeking economic advancement in the Motor City's factories.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tracing Your Family's Journey</h2>
          <p className="text-gray-700 mb-6">
            Many African American families have Great Migration stories in their histories. Census records, railroad employment documents, and city directories can help trace these movements. Key resources include:
          </p>

          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>National Archives railroad employment records</li>
            <li>City directories from destination cities</li>
            <li>Census records from 1920, 1930, and 1940</li>
            <li>Newspaper archives, particularly the Chicago Defender</li>
            <li>Church records from both origin and destination communities</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Visiting Historical Sites</h2>
          <p className="text-gray-700 mb-6">
            Today, travelers can visit numerous sites that commemorate the Great Migration experience:
          </p>

          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>The National Museum of African American History and Culture in Washington, D.C.</li>
            <li>The Chicago History Museum's Great Migration exhibit</li>
            <li>Union Station in Chicago, a major arrival point for migrants</li>
            <li>The Apollo Theater in Harlem</li>
            <li>The Motown Museum in Detroit</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cultural Impact and Legacy</h2>
          <p className="text-gray-700 mb-6">
            The Great Migration fundamentally changed American culture, spreading Southern musical traditions, foodways, and religious practices across the nation. It created the cultural foundations for the Civil Rights Movement and continues to influence American art, music, and literature today.
          </p>

          <p className="text-gray-700 mb-6">
            Understanding these routes helps us appreciate the courage and determination of our ancestors who left everything familiar in search of better opportunities and dignity. Their journeys shaped the America we know today.
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