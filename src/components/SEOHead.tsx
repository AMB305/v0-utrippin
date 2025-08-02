import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  type?: "website" | "article";
  structuredData?: object;
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = "/social-card.jpg",
  keywords,
  type = "website",
  structuredData
}: SEOHeadProps) => {
  const fullTitle = title.includes("Utrippin") ? title : `${title} | Utrippin.ai`;
  const currentUrl = typeof window !== "undefined" ? window.location.href : canonical || "https://utrippin.ai";
  
  // Use updated social messaging for og/twitter cards
  const socialTitle = title === "Budget Deals on Hotels, Flights, Cars & Travel Buddies | Utrippin.ai" 
    ? "Budget Deals on Hotels, Flights, Cars & Travel Buddies"
    : fullTitle;
  const socialDescription = description === "Find the best deals for any budget — hotels, flights, car rentals, and even connect with fellow travelers. Powered by Utrippin."
    ? description
    : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Utrippin.ai" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
