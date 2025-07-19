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
    <div className="bg-primary sticky top-0 z-50 shadow-lg overflow-x-hidden">
      <div className="max-w-full overflow-x-hidden">
        <div className="flex items-center px-6 py-3 min-h-[64px] overflow-x-hidden">
          {/* Left Section: Logo + Core Navigation */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <UtrippinLogo />
            </Link>
            
            {/* Core Navigation - Only essential items visible on large screens */}
            <nav className="hidden xl:flex items-center gap-6">
              {bookingTabs.slice(0, 4).map((tab) => (
                <Link key={tab.key} to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}>
                  <Button 
                    variant="ghost" 
                    className={`text-sm px-4 py-2 whitespace-nowrap transition-colors border-none font-medium ${
                      currentActiveTab === tab.key
                        ? 'text-white bg-white/20 hover:bg-white/30'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Medium screens - Compact navigation with dropdown */}
            <nav className="hidden lg:flex xl:hidden items-center gap-4">
              {bookingTabs.slice(0, 2).map((tab) => (
                <Link key={tab.key} to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}>
                  <Button 
                    variant="ghost" 
                    className={`text-sm px-3 py-2 whitespace-nowrap transition-colors border-none font-medium ${
                      currentActiveTab === tab.key
                        ? 'text-white bg-white/20 hover:bg-white/30'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </Button>
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 border-none font-medium">
                    {t('nav.more')}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {bookingTabs.slice(2).map((tab) => (
                    <Link key={tab.key} to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                        {tab.icon}
                        {tab.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  <Link to="/experiences">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Sparkles className="w-4 h-4" />
                      {t('nav.experiences')}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/cruises">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Ship className="w-4 h-4" />
                      {t('nav.cruises')}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/deals">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Tag className="w-4 h-4" />
                      {t('nav.deals')}
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/ai-recommendations">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Bot className="w-4 h-4" />
                      {t('nav.aiRecommendations')}
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Mobile Navigation - Horizontal Scrollable */}
          <nav className="lg:hidden flex-1 max-w-[50%] overflow-x-auto mx-2">
            <div className="flex space-x-1 whitespace-nowrap no-scrollbar">
              {bookingTabs.map((tab) => (
                <Link
                  key={tab.key}
                  to={`/${tab.key === 'ai' ? 'ai-travel' : tab.key}`}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg text-xs whitespace-nowrap min-w-0 flex-shrink-0 transition-colors ${
                    currentActiveTab === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {tab.icon}
                  <span className="mt-1 text-[10px]">{tab.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Center Section: Desktop Search - Hidden on smaller screens */}
          <div className="hidden xl:block flex-1 max-w-sm mx-4">
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
                  placeholder="Search destinations" 
                  className="pl-10 bg-muted/50 border-muted h-9"
                />
              </div>
            </form>
          </div>

          {/* Right Section: Actions & User Menu */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Language/Currency - Hidden on small screens */}
            <div className="hidden md:block">
              <CurrencySelector />
            </div>
            <div className="hidden md:block">
              <EnhancedLanguageSelector />
            </div>
            
            {/* Additional Navigation - Only on XL screens */}
            <div className="hidden xl:flex items-center gap-2">
              <Link to="/ai-travel">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 border-none font-medium"
                >
                  <Bot className="w-4 h-4" />
                  AI Travel
                </Button>
              </Link>
              <Link to="/travel-buddies">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 border-none font-medium"
                >
                  <Users className="w-4 h-4" />
                  Travel Buddies
                </Button>
              </Link>
            </div>
            
            {/* Desktop User Menu - Stack on smaller screens */}
            {user ? (
              <UserProfileDropdown />
            ) : (
              <div className="flex items-center gap-1 lg:gap-2">
                <Link to="/auth">
                  <Button variant="outline" className="text-xs lg:text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 border-2 border-gray-400 px-2 lg:px-4 py-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-2 lg:px-4 whitespace-nowrap">
                    JOIN VIP
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0 ml-1 text-white hover:bg-white/10 border-none">
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
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Briefcase className="w-5 h-5 mr-3" />
                        Hotels
                      </Button>
                    </Link>
                    <Link to="/flights" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Plane className="w-5 h-5 mr-3" />
                        Flights
                      </Button>
                    </Link>
                    <Link to="/cars" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Car className="w-5 h-5 mr-3" />
                        Cars
                      </Button>
                    </Link>
                    <Link to="/packages" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Package className="w-5 h-5 mr-3" />
                        Packages
                      </Button>
                    </Link>
                    <Link to="/experiences" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Sparkles className="w-5 h-5 mr-3" />
                        Experiences
                      </Button>
                    </Link>
                    <Link to="/cruises" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Ship className="w-5 h-5 mr-3" />
                        Cruises
                      </Button>
                    </Link>
                    <Link to="/ai-recommendations" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Bot className="w-5 h-5 mr-3" />
                        AI Recommendations
                      </Button>
                    </Link>
                    <Link to="/deals" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        <Tag className="w-5 h-5 mr-3" />
                        Deals
                      </Button>
                    </Link>
                    <Link to="/blog" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                        Blog
                      </Button>
                    </Link>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <Link to="/ai-travel" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                          <Bot className="w-5 h-5 mr-3" />
                          AI Travel
                        </Button>
                      </Link>
                      <Link to="/travel-buddies" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                          <Users className="w-5 h-5 mr-3" />
                          Travel Buddies
                        </Button>
                      </Link>
                      <Link to="/dashboard" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
                          <LayoutDashboard className="w-5 h-5 mr-3" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/trips" onClick={closeMobileMenu}>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-foreground hover:text-foreground hover:bg-accent">
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
    </div>
  );
};

export default Header;
