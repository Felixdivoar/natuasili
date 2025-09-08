import React from 'react';
import Header from '@/components/Header';
import HeaderMega from '@/components/HeaderMega';
import Footer from '@/components/Footer';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { I18nProvider } from '@/i18n/I18nProvider';
import CookieBanner from '@/components/CookieBanner';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <CurrencyProvider>
      <I18nProvider>
        <div className="min-h-screen bg-background">
          <HeaderMega />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </div>
      </I18nProvider>
    </CurrencyProvider>
  );
}