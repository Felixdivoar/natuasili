"use client";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Search, User, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CurrencySelector from "@/components/CurrencySelector";
import AuthModal from "@/components/AuthModal";
import { useI18n } from "@/i18n/I18nProvider";

export default function MobileBottomNav() {
  const { user, userRole } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Hide on desktop and add main padding for safe area
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.setAttribute("style", "padding-bottom: max(80px, env(safe-area-inset-bottom));");
    }
    return () => {
      if (main) main.style.removeProperty("padding-bottom");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optionally hide on certain routes
  const hideOn = ["/checkout", "/auth"];
  if (hideOn.some(p => location.pathname?.startsWith(p))) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const query = formData.get("search") as string;
    if (query?.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const goDashboard = () => {
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
        className="mobile-bottom-nav"
        role="navigation"
        aria-label="Mobile bottom navigation"
        data-na="mobile-bottom-nav"
      >
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            type="button"
            className="mbn-item"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search experiences"
          >
            <Search className="mbn-icon" />
            <span className="mbn-label">Search</span>
          </button>
          
          {searchOpen && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 max-w-[90vw] bg-background border border-border rounded-lg shadow-lg p-4 z-50">
              <form onSubmit={handleSearch} className="space-y-3">
                <input
                  name="search"
                  type="text"
                  placeholder={t("search_placeholder")}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                <Button type="submit" size="sm" className="w-full">
                  Search
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Profile / Sign In */}
        <button
          type="button"
          className="mbn-item"
          onClick={goDashboard}
          aria-label={user ? "Open your dashboard" : "Sign in"}
        >
          {user ? (
            <>
              <Avatar className="mbn-icon w-5 h-5">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {user.user_metadata?.full_name ? 
                    user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 
                    user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="mbn-label">Profile</span>
            </>
          ) : (
            <>
              <User className="mbn-icon" />
              <span className="mbn-label">Sign In</span>
            </>
          )}
        </button>

        {/* Currency */}
        <div className="relative" ref={currencyRef}>
          <button
            type="button"
            className="mbn-item"
            onClick={() => setCurrencyOpen(!currencyOpen)}
            aria-label="Change currency"
          >
            <DollarSign className="mbn-icon" />
            <span className="mbn-label">Currency</span>
          </button>
          
          {currencyOpen && (
            <div className="absolute bottom-full right-2 mb-2 bg-background border border-border rounded-lg shadow-lg p-2 z-50">
              <CurrencySelector />
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}

