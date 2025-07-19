import { SEOHead } from "@/components/SEOHead";

export default function Widgets() {
  return (
    <>
      <SEOHead 
        title="Travel Widgets & Tools | Utrippin.ai"
        description="Explore interactive travel widgets and tools for testing and development. Access various travel components and features for enhanced user experience."
        canonical="https://utrippin.ai/widgets"
        keywords="travel widgets, travel tools, development tools, travel components"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://utrippin.ai/widgets#webpage",
          "url": "https://utrippin.ai/widgets",
          "name": "Travel Widgets & Tools | Utrippin.ai",
          "description": "Explore interactive travel widgets and tools for testing and development.",
          "inLanguage": "en-US"
        }}
      />
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Widgets</h1>
      <p className="text-muted-foreground">This page is for testing widget components.</p>
    </div>
    </>
  );
}