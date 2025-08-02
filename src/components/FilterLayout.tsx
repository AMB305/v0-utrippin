import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface FilterLayoutProps {
  filters: React.ReactNode;
  results: React.ReactNode;
  resultsHeader: {
    title: string;
    subtitle?: string;
    count: number;
    sortInfo?: string;
  };
  searchBar?: React.ReactNode;
}

const FilterLayout = ({ filters, results, resultsHeader, searchBar }: FilterLayoutProps) => {
  return (
    <div>
      {/* Search Bar */}
      {searchBar && searchBar}
      
      {/* Results Header */}
      <div className="bg-gradient-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {resultsHeader.title}
              </h1>
              {resultsHeader.subtitle && (
                <p className="text-muted-foreground">{resultsHeader.subtitle}</p>
              )}
            </div>
            
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {resultsHeader.count} results found
              </Badge>
              {resultsHeader.sortInfo && (
                <p className="text-sm text-muted-foreground">
                  {resultsHeader.sortInfo}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {filters}
            
            {/* Why Book With Us */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-travel-gold" />
                  Why Book With Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Best Price Guarantee</p>
                    <p className="text-xs text-muted-foreground">We'll match any lower price</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">24/7 Support</p>
                    <p className="text-xs text-muted-foreground">Help whenever you need it</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Secure Booking</p>
                    <p className="text-xs text-muted-foreground">Your data is protected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Area */}
          <div className="lg:col-span-3">
            {results}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterLayout;
