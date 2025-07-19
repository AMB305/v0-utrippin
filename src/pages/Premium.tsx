import { SEOHead } from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PremiumSubscription } from '@/components/PremiumSubscription';

export default function Premium() {
  return (
    <>
      <SEOHead 
        title="Premium Plans - Upgrade Your Travel Experience | Utrippin.ai"
        description="Upgrade to Utrippin.ai Premium and unlock unlimited travel buddy matching, advanced AI trip planning, priority support, and exclusive travel deals. Join our premium community today."
        canonical="https://utrippin.ai/premium"
        keywords="premium travel, travel subscription, unlimited matching, AI travel premium, travel buddy premium"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "name": "Utrippin.ai Premium",
              "description": "Premium travel planning and buddy matching service",
              "brand": {
                "@type": "Brand",
                "name": "Utrippin.ai"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": "9.99",
                "priceValidUntil": "2025-12-31"
              }
            },
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/premium#webpage",
              "url": "https://utrippin.ai/premium",
              "name": "Premium Plans - Upgrade Your Travel Experience | Utrippin.ai",
              "description": "Upgrade to Utrippin.ai Premium and unlock unlimited travel buddy matching, advanced AI trip planning, priority support, and exclusive travel deals.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      
      <div className="min-h-screen bg-utrippin-navy">
        <Header />
        
        <main className="pt-20">
          <PremiumSubscription />
        </main>
        
        <Footer />
      </div>
    </>
  );
}