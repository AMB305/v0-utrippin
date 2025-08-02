import { SEODashboard } from "@/components/SEODashboard";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SEOReports = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "SEO Reports" }
  ];

  return (
    <>
      <SEOHead
        title="SEO Performance Reports & Analytics | Utrippin.ai"
        description="Monitor SEO performance, keyword rankings, and organic traffic analytics for Utrippin.ai travel booking platform."
        keywords="SEO reports, analytics, keyword rankings, organic traffic, search performance"
        canonical="https://utrippin.ai/seo-reports"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <SEODashboard />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SEOReports;
