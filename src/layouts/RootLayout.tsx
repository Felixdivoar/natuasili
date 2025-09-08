import { Outlet } from "react-router-dom";
import HeaderMega from "@/components/HeaderMega";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { I18nProvider } from "@/contexts/I18nContext";

export default function RootLayout() {
  return (
    <I18nProvider>
      <div className="min-h-dvh flex flex-col">
        <MobileHeader />
        <HeaderMega />
        <main className="flex-1 page-content">
          <Outlet />
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </I18nProvider>
  );
}