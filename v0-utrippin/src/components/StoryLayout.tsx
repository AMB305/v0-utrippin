import { ArrowLeft, Share2, Calendar, Clock, User, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Helmet } from "react-helmet-async"
import { ReactNode } from "react"

interface StoryLayoutProps {
  title: string
  excerpt: string
  author: string
  readTime: string
  publishDate: string
  category: string
  heroImage: string
  seoKeywords: string[]
  children: ReactNode
}

export default function StoryLayout({
  title,
  excerpt,
  author,
  readTime,
  publishDate,
  category,
  heroImage,
  seoKeywords,
  children
}: StoryLayoutProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": excerpt,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": publishDate,
    "publisher": {
      "@type": "Organization",
      "name": "Utrippin",
      "logo": {
        "@type": "ImageObject",
        "url": "https://utrippin.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "image": heroImage
  }

  return (
    <>
      <Helmet>
        <title>{title} | Melanin Compass - Utrippin</title>
        <meta name="description" content={excerpt} />
        <meta name="keywords" content={seoKeywords.join(', ')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={heroImage} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <Link to="/melanin" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Melanin Compass
            </Link>
          </nav>

          {/* Hero Section */}
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
            <img 
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border border-white/30">
                {category}
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                {title}
              </h1>
            </div>
          </div>

          {/* Article Meta */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-gray-900">{author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Like</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
                <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed border-l-4 border-blue-500 pl-6 bg-blue-50 py-4 rounded-r-lg">
                  {excerpt}
                </p>
                {children}
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-xl p-6 mt-8 shadow-sm border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Enjoyed this story?</h3>
                <p className="text-gray-600">Share it with your network</p>
              </div>
              <Button onClick={handleShare} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Share2 className="w-4 h-4" />
                Share this article
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
