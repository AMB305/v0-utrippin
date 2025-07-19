import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, Heart, User, Bot, Users, Briefcase, Car, Plane, Package, Ship, Sparkles, Tag, ChevronDown, LogOut, X, LayoutDashboard, Settings } from "lucide-react";
import { FaCar, FaSuitcaseRolling, FaRobot } from "react-icons/fa";
import { GiBoatFishing } from "react-icons/gi";
import { MdFlight, MdHotel } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import UtrippinLogo from "@/components/UtrippinLogo";
import EnhancedLanguageSelector from "@/components/EnhancedLanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import AirportAutocomplete from "@/components/AirportAutocomplete";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps = {}) => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const [mobileSearchIata, setMobileSearchIata] = useState("");

  // Determine active tab based on current route
  const currentPath = location.pathname;
  const getActiveTab = () => {
    if (currentPath.startsWith('/flights')) return 'flights';
    if (currentPath.startsWith('/hotels')) return 'hotels';
    if (currentPath.startsWith('/cars')) return 'cars';
    if (currentPath.startsWith('/packages')) return 'packages';
    if (currentPath.startsWith('/cruises')) return 'cruises';
    if (currentPath.startsWith('/ai-travel')) return 'ai';
    return activeTab || ''; // fallback to prop or empty
  };

  const currentActiveTab = getActiveTab();

  const bookingTabs = [
    { key: "flights", label: "Flights", icon: <MdFlight className="w-4 h-4" /> },
    { key: "hotels", label: "Hotels", icon: <MdHotel className="w-4 h-4" /> },
    { key: "cars", label: "Cars", icon: <FaCar className="w-4 h-4" /> },
    { key: "packages", label: "Packages", icon: <FaSuitcaseRolling className="w-4 h-4" /> },
    { key: "cruises", label: "Cruises", icon: <GiBoatFishing className="w-4 h-4" /> },
    { key: "ai", label: "AI Buddy", icon: <FaRobot className="w-4 h-4" /> }
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchValue.trim()) {
      // If we have an IATA code, go to flights page with the airport pre-filled
      if (mobileSearchIata) {
        navigate(`/flights?destination=${encodeURIComponent(mobileSearchIata)}`);
      } else {
        // Otherwise do a general destination search
        navigate(`/experiences?location=${encodeURIComponent(mobileSearchValue)}`);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      {/* Top Navigation Line - Secondary Actions */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Left: Logo + Secondary Links */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center flex-shrink-0">
                <UtrippinLogo />
              </Link>
              
              <div className="hidden lg:flex items-center gap-4 text-xs">
                <Link to="/deals" className="text-gray-700 hover:text-black transition-colors flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Deals
                </Link>
                <Link to="/support" className="text-gray-700 hover:text-black transition-colors">
                  Support
                </Link>
                <Link to="/partnership" className="text-gray-700 hover:text-black transition-colors">
                  Partnership
                </Link>
                <Link to="/blog" className="text-gray-700 hover:text-black transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:block flex-1 max-w-md mx-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                if (query.trim()) {
                  navigate(`/experiences?location=${encodeURIComponent(query)}`);
                }
              }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    name="search"
                    placeholder="Search destinations, hotels, flights..." 
                    className="pl-10 bg-gray-50 border-gray-200 h-9 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <CurrencySelector />
                <EnhancedLanguageSelector />
              </div>
              
              {user ? (
                <UserProfileDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-3 text-muted-foreground hover:text-foreground">
                      <User className="w-3 h-3 mr-1" />
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="text-xs h-7 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Line */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">{/* Main Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {bookingTabs.slice(0, 5).map((tab) => (
              <Link 
                key={tab.key} 
                to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}
                className="group"
              >
                <Button 
                  variant="ghost" 
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                    currentActiveTab === tab.key
                      ? 'text-black bg-gray-100 shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              </Link>
            ))}
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50">
                  More
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
                <Link to="/experiences">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                    <Sparkles className="w-4 h-4" />
                    Experiences
                  </DropdownMenuItem>
                </Link>
                <Link to="/ai-travel">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                    <Bot className="w-4 h-4" />
                    AI Travel
                  </DropdownMenuItem>
                </Link>
                <Link to="/travel-buddies">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                    <Users className="w-4 h-4" />
                    Travel Buddies
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Navigation - Horizontal Scrollable */}
          <nav className="lg:hidden flex-1 max-w-[60%] overflow-x-auto mx-4">
            <div className="flex space-x-2 whitespace-nowrap no-scrollbar">
              {bookingTabs.slice(0, 4).map((tab) => (
                <Link
                  key={tab.key}
                  to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs whitespace-nowrap min-w-0 flex-shrink-0 transition-all duration-200 ${
                    currentActiveTab === tab.key
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  {tab.icon}
                  <span className="mt-1 font-medium">{tab.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
              <div className="flex flex-col h-full text-foreground">
                  {/* Mobile Search */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-3">Quick Flight Search</h3>
                    <form onSubmit={handleMobileSearch}>
                      <div className="space-y-3">
                        <AirportAutocomplete
                          name="mobile-search"
                          placeholder="Search airports or cities"
                          value={mobileSearchValue}
                          onChange={(value, iataCode) => {
                            setMobileSearchValue(value);
                            setMobileSearchIata(iataCode);
                          }}
                          className="bg-white border-border text-foreground"
                        />
                        <button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                          {mobileSearchIata ? 'Search Flights' : 'Search Destinations'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 space-y-2">
                    <Link to="/hotels" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Briefcase className="w-5 h-5 mr-3" />
                        Hotels
                      </Button>
                    </Link>
                    <Link to="/flights" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Plane className="w-5 h-5 mr-3" />
                        Flights
                      </Button>
                    </Link>
                    <Link to="/cars" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Car className="w-5 h-5 mr-3" />
                        Cars
                      </Button>
                    </Link>
                    <Link to="/packages" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Package className="w-5 h-5 mr-3" />
                        Packages
                      </Button>
                    </Link>
                    <Link to="/experiences" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Sparkles className="w-5 h-5 mr-3" />
                        Experiences
                      </Button>
                    </Link>
                    <Link to="/cruises" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Ship className="w-5 h-5 mr-3" />
                        Cruises
                      </Button>
                    </Link>
                    <Link to="/ai-recommendations" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Bot className="w-5 h-5 mr-3" />
                        AI Recommendations
                      </Button>
                    </Link>
                    <Link to="/deals" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        <Tag className="w-5 h-5 mr-3" />
                        Deals
                      </Button>
                    </Link>
                    <Link to="/blog" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                        Blog
                      </Button>
                    </Link>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <Link to="/ai-travel" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                          <Bot className="w-5 h-5 mr-3" />
                          AI Travel
                        </Button>
                      </Link>
                      <Link to="/travel-buddies" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                          <Users className="w-5 h-5 mr-3" />
                          Travel Buddies
                        </Button>
                      </Link>
                      <Link to="/dashboard" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                          <LayoutDashboard className="w-5 h-5 mr-3" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/trips" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-gray-700 hover:text-black hover:bg-gray-100">
                          <Briefcase className="w-5 h-5 mr-3" />
                          My Trips
                        </Button>
                      </Link>
                    </div>
                  </nav>

                  {/* Mobile User Section */}
                  <div className="border-t border-border pt-4 mt-4">
                    {user ? (
                      <div className="space-y-2">
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Signed in as: {user.email}
                        </div>
                        <Link to="/profile" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                            <User className="w-5 h-5 mr-3" />
                            Profile
                          </Button>
                        </Link>
                        <Link to="/settings" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/auth" onClick={closeMobileMenu}>
                          <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/auth" onClick={closeMobileMenu}>
                          <Button className="w-full text-base py-3 bg-primary hover:bg-primary-hover text-primary-foreground">
                            JOIN VIP
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Header;
