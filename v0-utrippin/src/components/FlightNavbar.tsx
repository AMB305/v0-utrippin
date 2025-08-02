import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plane, Menu, Phone } from "lucide-react";

const FlightNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/flights' && location.pathname === '/flights') return true;
    if (path !== '/flights' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: "Search Flights", path: "/flights" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Travel Buddy", path: "/travel-buddy" },
    { label: "Support", path: "/support" }
  ];

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 w-full overflow-hidden">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between h-16 min-w-0">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground">UTrippin</span>
              <Badge variant="secondary" className="ml-2 text-xs">Flights</Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive(item.path) 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">1-800-FLY-NOW</span>
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Sign In
            </Button>
            <Button size="sm" className="bg-travel-gold hover:bg-travel-gold/90 text-travel-navy whitespace-nowrap">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden flex-shrink-0">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 pt-6">
                
                {/* Mobile Logo */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-foreground">UTrippin</span>
                    <Badge variant="secondary" className="ml-2 text-xs">Flights</Badge>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-medium transition-colors hover:text-primary py-2 ${
                        isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Contact Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>1-800-FLY-NOW</span>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                  <Button className="w-full bg-travel-gold hover:bg-travel-gold/90 text-travel-navy">
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default FlightNavbar;
