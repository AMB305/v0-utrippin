import { ArrowLeft, Share2, Calendar, Clock, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function BlackTravelSafetyApp2025() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "New 'Safe Travels' App Launches for Black Travelers Worldwide",
          text: "A comprehensive safety app providing real-time information for Black travelers",
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
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=400"
          alt="Travel Safety App"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Badge className="bg-blue-500/30 text-blue-100 border-blue-400/50 mb-4">
              Technology
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              New 'Safe Travels' App Launches for Black Travelers Worldwide
            </h1>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                African Americans News
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                January 15, 2025
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
            A comprehensive safety app providing real-time information, community reviews, and emergency contacts specifically designed for Black travelers has officially launched worldwide.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Revolutionary Safety Features</h2>
          <p className="text-gray-700 mb-6">
            The 'Safe Travels' app represents a groundbreaking approach to travel safety for Black travelers, incorporating crowd-sourced data, real-time safety alerts, and culturally-aware travel guidance. The app addresses long-standing concerns about safety and discrimination that Black travelers often face when visiting unfamiliar destinations.
          </p>

          <p className="text-gray-700 mb-6">
            Key features include neighborhood safety ratings based on community experiences, verified reviews from Black travelers, emergency contact networks, and real-time alerts about incidents or safety concerns in specific areas.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Community-Driven Approach</h2>
          <p className="text-gray-700 mb-6">
            What sets Safe Travels apart is its community-driven approach. The app relies on contributions from Black travelers worldwide who share their experiences, rate locations, and provide valuable insights about cultural sensitivity, discrimination incidents, and welcoming businesses.
          </p>

          <p className="text-gray-700 mb-6">
            "We're not just building an app; we're building a community safety network," said the development team. "Every review, every rating, every shared experience helps make travel safer and more enjoyable for Black travelers everywhere."
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Global Impact</h2>
          <p className="text-gray-700 mb-6">
            The app launches with coverage in over 100 countries and territories, with particularly detailed information for popular travel destinations in North America, Europe, Africa, and the Caribbean. Special attention has been given to documenting Black-owned businesses, cultural sites, and historically significant locations.
          </p>

          <p className="text-gray-700 mb-6">
            Emergency features include one-touch access to local emergency services, embassy contacts, and a network of trusted local contacts who can provide assistance in crisis situations.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Looking Forward</h2>
          <p className="text-gray-700 mb-6">
            The development team plans to continuously expand the app's features based on user feedback and emerging safety needs. Future updates will include integration with major travel booking platforms, expanded language support, and enhanced offline functionality for areas with limited internet connectivity.
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
