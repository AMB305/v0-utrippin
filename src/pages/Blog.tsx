import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";

// Sample blog data - in a real app this would come from your CMS/database
const blogPosts = [
  {
    id: "greece-travel-guide",
    title: "Ultimate Greece Travel Guide: From Athens to Santorini",
    excerpt: "Discover the magic of Greece with our comprehensive guide covering ancient history, stunning islands, and culinary delights that will make your trip unforgettable.",
    image: "/src/assets/greece-hero.jpg",
    author: "Travel Team",
    date: "2024-01-15",
    category: "Destinations",
    readTime: "8 min read",
    featured: true,
    slug: "greece"
  },
  {
    id: "florida-beaches",
    title: "Best Florida Beaches: A Complete Guide to Paradise",
    excerpt: "From the crystal-clear waters of the Keys to the vibrant nightlife of Miami Beach, explore Florida's most stunning coastal destinations.",
    image: "/src/assets/florida-beach-hero.jpg",
    author: "Beach Explorer",
    date: "2024-01-10",
    category: "Beach",
    readTime: "6 min read",
    featured: true,
    slug: "florida"
  },
  {
    id: "travel-tips",
    title: "Essential Travel Tips for First-Time International Travelers",
    excerpt: "Master the art of international travel with our expert tips on packing, budgeting, and navigating foreign destinations like a pro.",
    image: "/src/assets/travel-buddy-1.jpg",
    author: "Travel Expert",
    date: "2024-01-05",
    category: "Tips",
    readTime: "5 min read",
    featured: false
  },
  {
    id: "budget-travel",
    title: "How to Travel the World on a Budget: 15 Money-Saving Strategies",
    excerpt: "Learn proven strategies to explore amazing destinations without breaking the bank. From finding cheap flights to budget accommodations.",
    image: "/src/assets/budget-travel.jpg",
    author: "Budget Traveler",
    date: "2023-12-28",
    category: "Budget",
    readTime: "7 min read",
    featured: false
  },
  {
    id: "family-travel",
    title: "Family Travel Made Easy: Tips for Traveling with Kids",
    excerpt: "Make family vacations stress-free with our comprehensive guide to traveling with children of all ages.",
    image: "/src/assets/family-friendly.jpg",
    author: "Family Travel",
    date: "2023-12-20",
    category: "Family",
    readTime: "6 min read",
    featured: false
  },
  {
    id: "solo-travel",
    title: "Solo Travel Guide: Your Journey to Independence and Discovery",
    excerpt: "Embrace the freedom of solo travel with our guide to safety, planning, and making the most of your solo adventures.",
    image: "/src/assets/solo-travel.jpg",
    author: "Solo Explorer",
    date: "2023-12-15",
    category: "Solo Travel",
    readTime: "9 min read",
    featured: false
  }
];

const categories = ["All", "Destinations", "Tips", "Budget", "Beach", "Family", "Solo Travel"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <SEOHead 
        title="Travel Blog - Expert Guides & Tips | Utrippin.ai"
        description="Discover amazing travel destinations, expert tips, and comprehensive guides to make your next adventure unforgettable. From budget travel to luxury escapes - your ultimate travel inspiration source."
        canonical="https://utrippin.ai/blog"
        keywords="travel blog, travel guides, destinations, travel tips, vacation planning, travel inspiration"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Blog",
              "@id": "https://utrippin.ai/blog#blog",
              "url": "https://utrippin.ai/blog",
              "name": "Utrippin.ai Travel Blog",
              "description": "Expert travel guides, destination tips, and travel inspiration",
              "publisher": {
                "@type": "Organization",
                "name": "Utrippin.ai"
              },
              "inLanguage": "en-US"
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://utrippin.ai"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://utrippin.ai/blog"
                }
              ]
            },
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/blog#webpage",
              "url": "https://utrippin.ai/blog",
              "name": "Travel Blog - Expert Guides & Tips | Utrippin.ai",
              "description": "Discover amazing travel destinations, expert tips, and comprehensive guides to make your next adventure unforgettable. From budget travel to luxury escapes - your ultimate travel inspiration source.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              UTrippin Travel Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover amazing destinations, expert travel tips, and inspiring stories to fuel your wanderlust
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{post.readTime}</span>
                        <Button asChild variant="ghost">
                          <Link to={`/${post.slug}`} className="group">
                            <span>
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{post.readTime}</span>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/${post.slug}`} className="group">
                          <span>
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No articles found matching your search.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest travel tips, destination guides, and exclusive deals delivered to your inbox.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
