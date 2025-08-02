import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { createBlogPostSchema } from "@/utils/structuredData";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title }
  ];

  const structuredData = createBlogPostSchema(post);

  return (
    <>
      <SEOHead
        title={`${post.title} | Utrippin.ai Blog`}
        description={post.excerpt}
        keywords={post.tags?.join(", ")}
        canonical={`https://utrippin.ai/blog/${post.slug}`}
        type="article"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <article className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              />
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.publishedAt}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {post.title}
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {previousPost && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Previous Post
                    </div>
                    <Link to={`/blog/${previousPost.slug}`} className="story-link">
                      <h3 className="font-semibold">{previousPost.title}</h3>
                    </Link>
                  </CardContent>
                </Card>
              )}
              
              {nextPost && (
                <Card className={!previousPost ? "md:col-start-2" : ""}>
                  <CardContent className="p-6 text-right">
                    <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                      Next Post
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                    <Link to={`/blog/${nextPost.slug}`} className="story-link">
                      <h3 className="font-semibold">{nextPost.title}</h3>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* CTA Section */}
            <Card className="text-center p-8 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold">Ready to Plan Your Trip?</h3>
                <p className="text-muted-foreground">
                  Use our AI-powered travel planner to create your perfect itinerary
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/flights">
                    <Button>Book Flights</Button>
                  </Link>
                  <Link to="/hotels">
                    <Button variant="outline">Find Hotels</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
