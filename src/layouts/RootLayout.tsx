import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/contexts/I18nContext";

export default function RootLayout() {
  return (
    <I18nProvider>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 page-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}