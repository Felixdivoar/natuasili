"use client";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Sparkles, User, DollarSign, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModal from "@/components/AuthModal";
import { useI18n } from "@/i18n/I18nProvider";
import { SUPPORTED, SYMBOL, type Currency } from "@/lib/currency";

export default function MobileBottomNav() {
  const { user, userRole } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [aiSearchOpen, setAiSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const aiSearchRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Add bottom padding for safe area and nav height
  useEffect(() => {
    const updatePadding = () => {
      const isMobile = window.matchMedia("(max-width: 991px)").matches;
      const main = document.querySelector("main");
      if (main) {
        if (isMobile) {
          main.style.paddingBottom = "calc(80px + env(safe-area-inset-bottom, 0))";
        } else {
          main.style.removeProperty("padding-bottom");
        }
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => {
      window.removeEventListener("resize", updatePadding);
      const main = document.querySelector("main");
      if (main) main.style.removeProperty("padding-bottom");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiSearchRef.current && !aiSearchRef.current.contains(event.target as Node)) {
        setAiSearchOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide on certain routes
  const hideOn = ["/checkout", "/auth"];
  if (hideOn.some(p => location.pathname?.startsWith(p))) return null;

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const query = formData.get("search") as string;
    if (query?.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setAiSearchOpen(false);
    }
  };

  const handleProfile = () => {
    if (user) {
      const dashboardUrl = userRole === 'partner' ? '/dashboard/partner' : '/dashboard/user';
      navigate(dashboardUrl);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 xl:hidden z-[60] bg-background/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-t border-border shadow-[0_-6px_16px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        role="navigation"
        aria-label="Mobile bottom navigation"
        data-na="mobile-bottom-nav"
      >
        <div className="mx-auto max-w-screen-lg">
          <div className="grid grid-cols-3 h-16">
            
            {/* AI Search */}
            <div className="relative" ref={aiSearchRef}>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 w-full h-full select-none active:opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-primary"
                onClick={() => setAiSearchOpen(!aiSearchOpen)}
                aria-label="AI Search"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] leading-none font-medium">AI Search</span>
              </button>
              
              {aiSearchOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 max-w-[90vw] bg-background border border-border rounded-xl shadow-xl p-4 z-50">
                  <form onSubmit={handleAiSearch} className="space-y-3">
                    <input
                      name="search"
                      type="text"
                      placeholder={t("search_placeholder")}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                    <Button type="submit" size="sm" className="w-full">
                      Search
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Profile / Auth */}
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-1 w-full h-full select-none active:opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-primary"
              onClick={handleProfile}
              aria-label={user ? "Profile" : "Sign in or Sign up"}
            >
              {user ? (
                <>
                  <Avatar className="h-5 w-5" aria-hidden="true">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {user.user_metadata?.full_name ? 
                        user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 
                        user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] leading-none font-medium">Profile</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                  <span className="text-[11px] leading-none font-medium">Sign in / Sign up</span>
                </>
              )}
            </button>

            {/* Currency */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 w-full h-full select-none active:opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-primary"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                aria-label="Currency selector"
              >
                <DollarSign className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] leading-none font-medium">Currency: {currency}</span>
              </button>
              
              {currencyOpen && (
                <div
                  role="menu"
                  aria-label="Choose currency"
                  className="absolute bottom-full right-2 left-2 mx-auto max-w-xs mb-2 rounded-xl border border-border bg-background shadow-xl p-1 z-50"
                >
                  {SUPPORTED.map((currencyCode) => (
                    <button
                      key={currencyCode}
                      className={[
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        currencyCode === currency
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted",
                      ].join(" ")}
                      onClick={() => {
                        setCurrency(currencyCode);
                        setCurrencyOpen(false);
                      }}
                      role="menuitemradio"
                      aria-checked={currencyCode === currency}
                    >
                      <span className="font-medium">{SYMBOL[currencyCode]}</span>
                      <span className="ml-2">{currencyCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}

