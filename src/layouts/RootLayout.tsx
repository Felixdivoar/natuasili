import { Outlet } from "react-router-dom";
import HeaderMega from "@/components/HeaderMega";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/contexts/I18nContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import AdminLink from "@/components/AdminLink";

export default function RootLayout() {
  return (
    <SimpleAuthProvider>
      <I18nProvider>
        <CurrencyProvider>
          <div className="min-h-dvh flex flex-col">
            <HeaderMega />
            <main className="flex-1 page-content">
              <Outlet />
            </main>
            <Footer />
            <AdminLink />
          </div>
        </CurrencyProvider>
      </I18nProvider>
    </SimpleAuthProvider>
  );
}