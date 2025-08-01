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
import useIsMobile from "@/hooks/use-mobile";
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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Navigation Line - Logo, Search, User Actions, Mobile Menu */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center flex-shrink-0">
                <UtrippinLogo />
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:block flex-1 max-w-lg mx-8">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                if (query.trim()) {
                  navigate(`/experiences?location=${encodeURIComponent(query)}`);
                }
              }}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    name="search"
                    placeholder="Search destinations, hotels, flights..." 
                    className="pl-12 pr-4 py-2 bg-gray-50 border-gray-200 h-9 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white shadow-sm"
                  />
                </div>
              </form>
            </div>

            {/* Right: User Actions + Mobile Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1">
                <CurrencySelector />
                <EnhancedLanguageSelector />
              </div>
              
              {user ? (
                <UserProfileDropdown />
              ) : (
                <div className="flex items-center gap-1">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground">
                      <User className="w-3 h-3 mr-1" />
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="text-xs h-6 px-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden flex-shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 bg-black/50 z-40"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-[300px] sm:w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-300">
                      <div className="flex flex-col h-full p-6">
                        {/* Close button */}
                        <div className="flex justify-end mb-4">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Mobile Search */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-3">Quick Flight Search</h3>
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
                              />
                              <button 
                                type="submit" 
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium transition-colors"
                              >
                                {mobileSearchIata ? 'Search Flights' : 'Search Destinations'}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2">
                          <Link to="/hotels" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Briefcase className="w-5 h-5 mr-3" />
                              Hotels
                            </Button>
                          </Link>
                          <Link to="/flights" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Plane className="w-5 h-5 mr-3" />
                              Flights
                            </Button>
                          </Link>
                          <Link to="/cars" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Car className="w-5 h-5 mr-3" />
                              Cars
                            </Button>
                          </Link>
                          <Link to="/packages" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Package className="w-5 h-5 mr-3" />
                              Packages
                            </Button>
                          </Link>
                          <Link to="/experiences" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Sparkles className="w-5 h-5 mr-3" />
                              Experiences
                            </Button>
                          </Link>
                          <Link to="/cruises" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Ship className="w-5 h-5 mr-3" />
                              Cruises
                            </Button>
                          </Link>
                          <Link to="/ai-travel" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Bot className="w-5 h-5 mr-3" />
                              AI Travel
                            </Button>
                          </Link>
                          <Link to="/travel-buddies" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Users className="w-5 h-5 mr-3" />
                              Travel Buddies
                            </Button>
                          </Link>
                          <Link to="/deals" onClick={closeMobileMenu}>
                            <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                              <Tag className="w-5 h-5 mr-3" />
                              Deals
                            </Button>
                          </Link>
                        </nav>

                        {/* Mobile User Section */}
                        <div className="border-t pt-4 mt-4">
                          {user ? (
                            <div className="space-y-2">
                              <div className="px-4 py-2 text-sm text-muted-foreground">
                                Signed in as: {user.email}
                              </div>
                              <Link to="/profile" onClick={closeMobileMenu}>
                                <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                                  <User className="w-5 h-5 mr-3" />
                                  Profile
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-base py-3 hover:bg-accent"
                                onClick={handleSignOut}
                              >
                                <LogOut className="w-5 h-5 mr-3" />
                                Sign Out
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Link to="/auth" onClick={closeMobileMenu}>
                                <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent">
                                  Sign In
                                </Button>
                              </Link>
                              <Link to="/auth" onClick={closeMobileMenu}>
                                <Button className="w-full text-base py-3">
                                  JOIN VIP
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Line - Desktop Only */}
      <div className="hidden lg:block bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-1">
            {/* Main Navigation - Desktop */}
            <nav className="flex items-center gap-4">
              {bookingTabs.slice(0, 5).map((tab) => (
                <Link 
                  key={tab.key} 
                  to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}
                  className="group"
                >
                  <Button 
                    variant="ghost" 
                    className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                      currentActiveTab === tab.key
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </Button>
                </Link>
              ))}
              
              {/* AI Travel and Travel Buddies - Now on main nav */}
              <Link to="/ai-travel">
                <Button 
                  variant="ghost" 
                  className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    currentActiveTab === 'ai'
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  AI Travel
                </Button>
              </Link>
              
              <Link to="/travel-buddies">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  Travel Buddies
                </Button>
              </Link>
              
              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                    More
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                  <Link to="/experiences">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                      <Sparkles className="w-4 h-4" />
                      Experiences
                    </DropdownMenuItem>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link to="/deals">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                      <Tag className="w-4 h-4" />
                      Deals
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/support">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                      <Users className="w-4 h-4" />
                      Support
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/partnership">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                      <Briefcase className="w-4 h-4" />
                      Partnership
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/blog">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-gray-700 hover:text-black hover:bg-gray-50">
                      <Package className="w-4 h-4" />
                      Blog
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
