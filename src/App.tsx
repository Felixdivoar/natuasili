import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useEffect } from "react";
import CookieBanner from "@/components/CookieBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import RootLayout from "@/layouts/RootLayout";
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
import SamburuDestination from "./pages/destination/Samburu";
import MasaiMaraDestination from "./pages/destination/MasaiMara";
import CoastDestination from "./pages/destination/Coast";
import NairobiDestination from "./pages/destination/Nairobi";
import LaikipiaDestination from "./pages/destination/Laikipia";
import Destinations from "./pages/Destinations";
import ExperienceHub from "./pages/ExperienceHub";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Search from "./pages/Search";
import PartnerEntry from "./pages/PartnerEntry";

const queryClient = new QueryClient();

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CookieBanner />
            <ScrollToTop />
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/marketplace" element={<Browse />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/experience/:slug" element={<ExperienceDetail />} />
                <Route path="/checkout/:slug" element={<Checkout />} />
                <Route path="/confirmation/:slug" element={<ConfirmationPage />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/impact-ledger" element={<ImpactLedger />} />
                <Route path="/dashboard" element={<TravelerDashboard />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
                <Route path="/partner-dashboard" element={<PartnerDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/partner/:slug" element={<PartnerProfile />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/blog/category/:category" element={<BlogCategory />} />
                <Route path="/partners/success-stories/:slug" element={<PartnerSuccessStory />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/samburu" element={<SamburuDestination />} />
                <Route path="/destinations/masai-mara" element={<MasaiMaraDestination />} />
                <Route path="/destinations/coast" element={<CoastDestination />} />
                <Route path="/destinations/nairobi" element={<NairobiDestination />} />
                <Route path="/destinations/laikipia" element={<LaikipiaDestination />} />
                <Route path="/experience-hub" element={<ExperienceHub />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/search" element={<Search />} />
                <Route path="/partner-entry" element={<PartnerEntry />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
