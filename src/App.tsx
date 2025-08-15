import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import ExperienceDetail from "./pages/ExperienceDetail";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import ImpactLedger from "./pages/ImpactLedger";
import NotFound from "./pages/NotFound";
import TravelerDashboard from "./pages/TravelerDashboard";
import ProjectDetail from "./pages/ProjectDetail";
import PartnerDashboard from "./pages/PartnerDashboard";
import About from "./pages/About";
import Partners from "./pages/Partners";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/experience/:slug" element={<ExperienceDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/impact-ledger" element={<ImpactLedger />} />
            <Route path="/dashboard" element={<TravelerDashboard />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/partners" element={<Partners />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
