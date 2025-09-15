import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useEffect } from "react";
import CookieBanner from "@/components/CookieBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import RootLayout from "@/layouts/RootLayout";
import HeaderMega from "@/components/HeaderMega";
import HeaderNew from "@/components/HeaderNew";
import Footer from "@/components/Footer";
import { useHtmlLang } from "@/hooks/useHtmlLang";
import { BookingProvider, useBooking } from "@/contexts/BookingContext";
import { MultiCartProvider } from "@/contexts/MultiCartContext";
import StickyReserveButton from "@/components/StickyReserveButton";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import ExperienceDetail from "./pages/ExperienceDetail";
import Checkout from "./pages/Checkout";
import ConfirmationPage from "./pages/ConfirmationPage";
import PesapalCallback from "./pages/PesapalCallback";
import BookingSuccess from "./pages/BookingSuccess";
import ImpactLedger from "./pages/ImpactLedger";
import NotFound from "./pages/NotFound";
import TravelerDashboard from "./pages/TravelerDashboard";
import ProjectDetail from "./pages/ProjectDetail";
import PartnerDashboard from "./pages/PartnerDashboard";
import About from "./pages/About";
import Partners from "./pages/Partners";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import PartnerSuccessStory from "./pages/PartnerSuccessStory";
import SamburuDestination from "./pages/destination/Samburu";
import MasaiMaraDestination from "./pages/destination/MasaiMara";
import CoastDestination from "./pages/destination/Coast";
import NairobiDestination from "./pages/destination/Nairobi";
import LaikipiaDestination from "./pages/destination/Laikipia";
import Destinations from "./pages/Destinations";
import ExperienceHub from "./pages/ExperienceHub";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import TermsAndConditions from "./pages/TermsAndConditions";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Search from "./pages/Search";
import PartnerEntry from "./pages/PartnerEntry";
import ContentStub from "./pages/ContentStub";
import Auth from "./pages/Auth";
import PartnerWithUs from "./pages/PartnerWithUs";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDynamic from "./pages/PartnerDynamic";
import Profile from "./pages/Profile";
import CartCheckout from "./pages/CartCheckout";
import ConservationChatbotPage from "./pages/ConservationChatbot";
import ReferPartner from "./pages/ReferPartner";
import AsiliChatWidget from "./components/AsiliChatWidget";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout with new header
function AppLayout({ children }: { children: React.ReactNode }) {
  useHtmlLang();
  
  return (
    <div className="min-h-screen bg-background">
      <HeaderNew />
      <main className="flex-1 main-content">
        {children}
      </main>
      <Footer />
      
      {/* Global Sticky Reserve Button - shows when there's an active booking */}
      <GlobalStickyReserveButton />
    </div>
  );
}

// Global component that shows the sticky button based on booking context
function GlobalStickyReserveButton() {
  const { bookingState, hasActiveBooking } = useBooking();
  
  if (!hasActiveBooking || !bookingState) return null;
  
  return (
    <StickyReserveButton
      experienceSlug={bookingState.experienceSlug}
      experienceName="Your Experience" // We could enhance this with experience data lookup
      basePrice={bookingState.totalPrice}
    />
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <CurrencyProvider>
          <AuthProvider>
            <MultiCartProvider>
              <BookingProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
              <BrowserRouter>
                <CookieBanner />
                <ScrollToTop />
              <Routes>
                <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                <Route path="/marketplace" element={<AppLayout><Browse /></AppLayout>} />
                <Route path="/browse" element={<AppLayout><Browse /></AppLayout>} />
                <Route path="/experiences" element={<AppLayout><Browse /></AppLayout>} />
                <Route path="/listings" element={<AppLayout><Listings /></AppLayout>} />
                <Route path="/listings/:slug" element={<AppLayout><ListingDetail /></AppLayout>} />
                <Route path="/experience/:slug" element={<AppLayout><ExperienceDetail /></AppLayout>} />
                <Route path="/checkout/:slug" element={<AppLayout><Checkout /></AppLayout>} />
                <Route path="/cart/checkout" element={
                  <ProtectedRoute>
                    <AppLayout><CartCheckout /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/confirmation/:slug" element={<AppLayout><ConfirmationPage /></AppLayout>} />
                <Route path="/pesapal-callback" element={<AppLayout><PesapalCallback /></AppLayout>} />
                <Route path="/pesapal/callback" element={<AppLayout><PesapalCallback /></AppLayout>} />
                <Route path="/booking-success" element={<AppLayout><BookingSuccess /></AppLayout>} />
                <Route path="/impact-ledger" element={<AppLayout><ImpactLedger /></AppLayout>} />
                <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
                <Route path="/auth" element={<AppLayout><Auth /></AppLayout>} />
                <Route path="/conservation-chatbot" element={<AppLayout><ConservationChatbotPage /></AppLayout>} />
                <Route path="/refer-partner" element={<AppLayout><ReferPartner /></AppLayout>} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout><UserDashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AppLayout><AdminDashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/partner" element={
                  <ProtectedRoute allowedRoles={['partner']}>
                    <AppLayout><PartnerDashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/traveler" element={
                  <ProtectedRoute allowedRoles={['traveler']}>
                    <AppLayout><UserDashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/user" element={
                  <ProtectedRoute allowedRoles={['traveler']}>
                    <AppLayout><UserDashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/projects/:projectId" element={<AppLayout><ProjectDetail /></AppLayout>} />
                <Route path="/partner-dashboard" element={<AppLayout><PartnerDashboard /></AppLayout>} />
                <Route path="/about" element={<AppLayout><About /></AppLayout>} />
                <Route path="/partners" element={<AppLayout><Partners /></AppLayout>} />
                <Route path="/partners/:slug" element={<Navigate to="/partner/:slug" replace />} />
                <Route path="/partner/:slug" element={<AppLayout><PartnerDynamic /></AppLayout>} />
                <Route path="/blog" element={<AppLayout><Blog /></AppLayout>} />
                <Route path="/blog/:slug" element={<AppLayout><BlogPost /></AppLayout>} />
                <Route path="/blog/category/:category" element={<AppLayout><BlogCategory /></AppLayout>} />
                <Route path="/partners/success-stories/:slug" element={<AppLayout><PartnerSuccessStory /></AppLayout>} />
                <Route path="/destinations" element={<AppLayout><Destinations /></AppLayout>} />
                <Route path="/destinations/samburu" element={<AppLayout><SamburuDestination /></AppLayout>} />
                <Route path="/destinations/masai-mara" element={<AppLayout><MasaiMaraDestination /></AppLayout>} />
                <Route path="/destinations/coast" element={<AppLayout><CoastDestination /></AppLayout>} />
                <Route path="/destinations/nairobi" element={<AppLayout><NairobiDestination /></AppLayout>} />
                <Route path="/destinations/laikipia" element={<AppLayout><LaikipiaDestination /></AppLayout>} />
                <Route path="/themes/wildlife-conservation" element={<AppLayout><Browse /></AppLayout>} />
                <Route path="/themes/conservation-education" element={<AppLayout><Browse /></AppLayout>} />
                <Route path="/themes/community-cultural-exploration" element={<AppLayout><Browse /></AppLayout>} />
                <Route path="/themes/:theme" element={<AppLayout><ContentStub title="Theme Page" description="This theme page is being developed. Check back soon for curated experiences and stories." /></AppLayout>} />
                <Route path="/experience-hub" element={<AppLayout><ExperienceHub /></AppLayout>} />
                <Route path="/terms" element={<AppLayout><TermsAndConditions /></AppLayout>} />
                <Route path="/terms-of-service" element={<AppLayout><TermsOfService /></AppLayout>} />
                <Route path="/privacy-policy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
                <Route path="/cookie-policy" element={<AppLayout><CookiePolicy /></AppLayout>} />
                <Route path="/search" element={<AppLayout><Search /></AppLayout>} />
                <Route path="/partner-with-us" element={<AppLayout><PartnerWithUs /></AppLayout>} />
                <Route path="/partner-entry" element={<AppLayout><PartnerEntry /></AppLayout>} />
                <Route path="/listings" element={<AppLayout><Listings /></AppLayout>} />
                <Route path="/listings/:slug" element={<AppLayout><ListingDetail /></AppLayout>} />
                <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
              </Routes>
              <AsiliChatWidget />
              </BrowserRouter>
            </TooltipProvider>
          </BookingProvider>
        </MultiCartProvider>
      </AuthProvider>
      </CurrencyProvider>
    </I18nProvider>
  </QueryClientProvider>
  
</ErrorBoundary>
);

export default App;
