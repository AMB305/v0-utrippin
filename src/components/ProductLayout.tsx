import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ProductLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
  className?: string;
}

const ProductLayout = ({ children, breadcrumbs, className = "" }: ProductLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="border-b bg-travel-light py-4">
          <div className="container mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={index}>
                    <BreadcrumbItem>
                      {breadcrumb.isActive ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.href || "#"}>
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}
      
      <div className={className}>
        {children}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductLayout;