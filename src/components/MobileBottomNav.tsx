import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, DollarSign, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CurrencySelector from "@/components/CurrencySelector";
import AuthModal from "@/components/AuthModal";
import { useI18n } from "@/i18n/I18nProvider";

const MobileBottomNav: React.FC = () => {
  const { t } = useI18n();
  const { user, userRole } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const query = formData.get("search") as string;
    if (query?.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      setSearchOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      const dashboardUrl = userRole === 'partner' ? '/dashboard/partner' : '/dashboard/user';
      window.location.href = dashboardUrl;
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav className="mobile-bottom-nav lg:hidden">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            className="nav-button w-full"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search experiences"
          >
            <Search className="icon" />
            <span>Search</span>
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
          className="nav-button w-full"
          onClick={handleProfileClick}
          aria-label={user ? "Open your dashboard" : "Sign in"}
        >
          {user ? (
            <>
              <Avatar className="w-5 h-5">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {user.user_metadata?.full_name ? 
                    user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 
                    user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>Profile</span>
            </>
          ) : (
            <>
              <User className="icon" />
              <span>Sign In</span>
            </>
          )}
        </button>

        {/* Currency */}
        <div className="relative" ref={currencyRef}>
          <button
            className="nav-button w-full"
            onClick={() => setCurrencyOpen(!currencyOpen)}
            aria-label="Change currency"
          >
            <DollarSign className="icon" />
            <span>Currency</span>
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
};

export default MobileBottomNav;