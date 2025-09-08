import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import RootLayout from "@/layouts/RootLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Browse from "./pages/Browse";
import ExperienceDetail from "./pages/ExperienceDetail";
import ImpactLedger from "./pages/ImpactLedger";
import PartnerWithUs from "./pages/PartnerWithUs";
import Partners from "./pages/Partners";
import PartnerDetail from "./pages/PartnerDetail";
import PartnerProfile from "./pages/PartnerProfile";
import PartnerEntry from "./pages/PartnerEntry";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerSuccessStory from "./pages/PartnerSuccessStory";
import TravelerDashboard from "./pages/TravelerDashboard";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import Blog from "./pages/Blog";
import Search from "./pages/Search";
import Destinations from "./pages/Destinations";
import Nairobi from "./pages/destination/Nairobi";
import Coast from "./pages/destination/Coast";
import MasaiMara from "./pages/destination/MasaiMara";
import Samburu from "./pages/destination/Samburu";
import Laikipia from "./pages/destination/Laikipia";
import ListingDetail from "./pages/ListingDetail";
import Listings from "./pages/Listings";
import ExperienceHub from "./pages/ExperienceHub";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import ConfirmationPage from "./pages/ConfirmationPage";
import PesapalCallback from "./pages/PesapalCallback";
import ProjectDetail from "./pages/ProjectDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/experience/:slug" element={<ExperienceDetail />} />
            <Route path="/impact-ledger" element={<ImpactLedger />} />
            <Route path="/partner-with-us" element={<PartnerWithUs />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:slug" element={<PartnerDetail />} />
            <Route path="/partners/:slug/profile" element={<PartnerProfile />} />
            <Route path="/partner-entry" element={<PartnerEntry />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/partners/:slug/success-story" element={<PartnerSuccessStory />} />
            <Route path="/traveler-dashboard" element={<TravelerDashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/category/:category" element={<BlogCategory />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/nairobi" element={<Nairobi />} />
            <Route path="/destinations/coast" element={<Coast />} />
            <Route path="/destinations/masai-mara" element={<MasaiMara />} />
            <Route path="/destinations/samburu" element={<Samburu />} />
            <Route path="/destinations/laikipia" element={<Laikipia />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/experiences" element={<ExperienceHub />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/pesapal-callback" element={<PesapalCallback />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;