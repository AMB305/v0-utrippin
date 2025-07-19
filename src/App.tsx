import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorBoundaryEnhanced } from "@/components/ErrorBoundaryEnhanced";
import { KeyboardNavigationIndicator } from "@/components/AccessibilityEnhancements";
import CriticalBugFixes from "@/components/CriticalBugFixes";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import ProfileSetup from "./pages/ProfileSetup";
import TravelBuddy from "./pages/TravelBuddy";
import TravelBuddyTest from "./pages/TravelBuddyTest";
import TravelBuddies from "./pages/TravelBuddies";
import TravelBuddiesEnhanced from "./pages/TravelBuddiesEnhanced";
import Premium from "./pages/Premium";
import AIRecommendations from "./pages/AIRecommendations";
import Trips from "./pages/Trips";
import ProtectedRoute from "./components/ProtectedRoute";
import Flights from "./pages/Flights";
import FlightResults from "./pages/FlightResults";
import FlightBooking from "./pages/FlightBooking";
import FlightBookingSuccess from "./pages/FlightBookingSuccess";
import Cars from "./pages/Cars";
import CarResults from "./pages/CarResults";
import CarBooking from "./pages/CarBooking";
import Hotels from "./pages/Hotels";
import HotelResults from "./pages/HotelResults";
import HotelBooking from "./pages/HotelBooking";
import Packages from "./pages/Packages";
import PackageResults from "./pages/PackageResults";
import PackageBooking from "./pages/PackageBooking";
import Experiences from "./pages/Experiences";
import ExperienceResults from "./pages/ExperienceResults";
import Cruises from "./pages/Cruises";
import Deals from "./pages/Deals";
import Widgets from "./pages/Widgets";
import Destination from "./pages/Destination";
import Category from "./pages/Category";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SEOReports from "./pages/SEOReports";
import BeachCategory from "./pages/BeachCategory";
import CultureCategory from "./pages/CultureCategory";
import SkiCategory from "./pages/SkiCategory";
import FamilyCategory from "./pages/FamilyCategory";
import WellnessCategory from "./pages/WellnessCategory";
import Florida from "./pages/Florida";
import Greece from "./pages/Greece";
import DuffelTest from "./pages/DuffelTest";
import TravelTips from "./pages/TravelTips";
import Melanin from "./pages/Melanin";
import BudgetTravel from "./pages/BudgetTravel";
import FamilyTravel from "./pages/FamilyTravel";
import SoloTravel from "./pages/SoloTravel";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import HotelsMiami from "./pages/HotelsMiami";
import AiTravel from "./pages/AiTravel";
import UploadTrips from "./pages/admin/UploadTrips";
import ImageGeneration from "./pages/ImageGeneration";
import Bookings from "./pages/Bookings";
import Legal from "./pages/Legal";
import VirtualTour from "./pages/VirtualTour";

import SearchHistory from "./pages/SearchHistory";

import NotFound from "./pages/NotFound";
import ExploreMerged from "@/pages/ExploreMerged";
import AiTravelResults from "./pages/AiTravelResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <KeyboardNavigationIndicator />
              <Toaster />
              <Sonner />
              <ErrorBoundaryEnhanced>
                <CriticalBugFixes />
                <ScrollToTop />
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/email-verification" element={<EmailVerification />} />
                  <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
                  <Route path="/travel-buddy" element={<ProtectedRoute><TravelBuddy /></ProtectedRoute>} />
                  <Route path="/travel-buddy-test" element={<TravelBuddyTest />} />
                  <Route path="/travel-buddies" element={<TravelBuddiesEnhanced />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/ai-recommendations" element={<ProtectedRoute><AIRecommendations /></ProtectedRoute>} />
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/flights" element={<Flights />} />
                  <Route path="/flights/results" element={<FlightResults />} />
                  <Route path="/flights/booking" element={<FlightBooking />} />
                  <Route path="/flight-booking-success" element={<FlightBookingSuccess />} />
                  <Route path="/cars" element={<Cars />} />
                  <Route path="/cars/results" element={<CarResults />} />
                  <Route path="/cars/booking" element={<CarBooking />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/hotels/miami" element={<HotelsMiami />} />
                  <Route path="/hotels/results" element={<HotelResults />} />
                  <Route path="/hotels/booking" element={<HotelBooking />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/packages/results" element={<PackageResults />} />
                  <Route path="/packages/booking" element={<PackageBooking />} />
                  <Route path="/experiences" element={<Experiences />} />
                  <Route path="/experiences/results" element={<ExperienceResults />} />
                  <Route path="/cruises" element={<Cruises />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/widgets" element={<Widgets />} />
                  <Route path="/destinations/:slug" element={<Destination />} />
                  <Route path="/categories/:category" element={<Category />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/categories/beach" element={<BeachCategory />} />
                  <Route path="/categories/culture" element={<CultureCategory />} />
                  <Route path="/categories/ski" element={<SkiCategory />} />
                  <Route path="/categories/family" element={<FamilyCategory />} />
                  <Route path="/categories/wellness" element={<WellnessCategory />} />
                  <Route path="/florida" element={<Florida />} />
                  <Route path="/greece" element={<Greece />} />
                  <Route path="/duffel" element={<DuffelTest />} />
                  <Route path="/travel-tips" element={<TravelTips />} />
                  <Route path="/budget-travel" element={<BudgetTravel />} />
                  <Route path="/family-travel" element={<FamilyTravel />} />
                  <Route path="/solo-travel" element={<SoloTravel />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/ai-travel" element={<AiTravelResults />} />
                  <Route path="/name-your-price" element={<ExploreMerged />} />
                  <Route path="/melanin" element={<Melanin />} />
                  <Route path="/seo-reports" element={<SEOReports />} />
                  <Route path="/admin/upload-trips" element={<UploadTrips />} />
                  <Route path="/image-generation" element={<ImageGeneration />} />
                  <Route path="/explore" element={<ExploreMerged />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/virtual-tour" element={<VirtualTour />} />
                  <Route path="/search-history" element={<SearchHistory />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundaryEnhanced>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
