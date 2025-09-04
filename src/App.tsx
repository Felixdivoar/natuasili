import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useEffect } from "react";
import CookieBanner from "@/components/CookieBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import RootLayout from "@/layouts/RootLayout";
import HeaderMega from "@/components/HeaderMega";
import HeaderCompact from "@/components/HeaderCompact";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import ExperienceDetail from "./pages/ExperienceDetail";
import Checkout from "./pages/Checkout";
import ConfirmationPage from "./pages/ConfirmationPage";
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
import PartnerProfile from "./pages/PartnerProfile";
import PartnerDetail from "./pages/PartnerDetail";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Search from "./pages/Search";
import PartnerEntry from "./pages/PartnerEntry";
import ContentStub from "./pages/ContentStub";

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
  return (
    <div className="min-h-screen bg-background">
      <HeaderCompact />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <CurrencyProvider>
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
                <Route path="/experience/:slug" element={<AppLayout><ExperienceDetail /></AppLayout>} />
                <Route path="/checkout/:slug" element={<AppLayout><Checkout /></AppLayout>} />
                <Route path="/confirmation/:slug" element={<AppLayout><ConfirmationPage /></AppLayout>} />
                <Route path="/booking-success" element={<AppLayout><BookingSuccess /></AppLayout>} />
                <Route path="/impact-ledger" element={<AppLayout><ImpactLedger /></AppLayout>} />
                <Route path="/dashboard" element={<AppLayout><TravelerDashboard /></AppLayout>} />
                <Route path="/projects/:projectId" element={<AppLayout><ProjectDetail /></AppLayout>} />
                <Route path="/partner-dashboard" element={<AppLayout><PartnerDashboard /></AppLayout>} />
                <Route path="/about" element={<AppLayout><About /></AppLayout>} />
                <Route path="/partners" element={<AppLayout><Partners /></AppLayout>} />
                <Route path="/partners/:slug" element={<AppLayout><PartnerDetail /></AppLayout>} />
                <Route path="/partner/:slug" element={<AppLayout><PartnerProfile /></AppLayout>} />
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
                <Route path="/themes/:theme" element={<AppLayout><ContentStub title="Theme Page" description="This theme page is being developed. Check back soon for curated experiences and stories." /></AppLayout>} />
                <Route path="/experience-hub" element={<AppLayout><ExperienceHub /></AppLayout>} />
                <Route path="/terms" element={<AppLayout><TermsAndConditions /></AppLayout>} />
                <Route path="/privacy-policy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
                <Route path="/cookie-policy" element={<AppLayout><CookiePolicy /></AppLayout>} />
                <Route path="/search" element={<AppLayout><Search /></AppLayout>} />
                <Route path="/partner-entry" element={<AppLayout><PartnerEntry /></AppLayout>} />
                <Route path="/listings" element={<AppLayout><Listings /></AppLayout>} />
                <Route path="/listings/:slug" element={<AppLayout><ListingDetail /></AppLayout>} />
                <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyProvider>
      </I18nProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
