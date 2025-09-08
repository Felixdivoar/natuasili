import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import { useI18n } from "@/i18n/I18nProvider";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import NewAuthModal from "@/components/NewAuthModal";
import T from "@/i18n/T";

const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";

const DESTINATIONS = [
  { label: "Nairobi", slug: "nairobi", image: "/src/assets/destinations/nairobi-destination.jpg" },
  { label: "Coastal Kenya", slug: "coast", image: "/src/assets/destinations/coast-destination.jpg" },
  { label: "Samburu", slug: "samburu", image: "/src/assets/destinations/samburu-destination.jpg" },
  { label: "Masai Mara", slug: "masai-mara", image: "/src/assets/destinations/masai-mara-destination.jpg" },
  { label: "Laikipia", slug: "laikipia", image: "/src/assets/destinations/laikipia-destination.jpg" },
];

const THEMES = [
  { label: "Wildlife Conservation", slug: "wildlife-conservation", desc: "Protect endangered species and habitats" },
  { label: "Conservation Education", slug: "conservation-education", desc: "Learn about conservation through hands-on experiences" },
  { label: "Community & Cultural Exploration", slug: "community-cultural-exploration", desc: "Support local communities and preserve cultural heritage" },
];

export default function HeaderMega() {
  const { t } = useI18n();
  const { user, signOut, loading } = useSimpleAuth();
  const [openMenu, setOpenMenu] = useState<null | "dest" | "theme" | "profile">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  console.log("🔐 Header: Clean auth state", { hasUser: !!user, loading });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
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
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 header-compact hidden xl:block">
      <div className="nav-inner">
        <div className="flex items-center justify-between h-14">
          {/* Left cluster */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="NatuAsili" 
                className="h-8 w-auto object-contain"
                translate="no"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6" ref={menuRef}>
              <Link to="/impact-ledger" className="nav-link text-foreground hover:text-primary transition-colors text-sm">
                {t("nav_impact")}
              </Link>
              <Link to="/partners" className="nav-link text-foreground hover:text-primary transition-colors text-sm">
                {t("nav_partners")}
              </Link>
              <Link to="/experiences" className="nav-link text-foreground hover:text-primary transition-colors text-sm">
                {t("nav_marketplace")}
              </Link>
              <a 
                href="https://open.spotify.com/show/7oKIRbsUqrDwiH47E5VZvf?si=qhIVTrJLSSKf3jChj0POyA&nd=1&flow_ctx=3b79f64c-906a-4fa4-b0b7-6e45d375433b%3A1697319493" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link text-foreground hover:text-primary transition-colors text-sm"
              >
                Conservation Voices
              </a>

              {/* Destinations Mega Menu */}
              <div className="relative">
                <button
                  className="nav-link text-foreground hover:text-primary transition-colors text-sm"
                  onMouseEnter={() => setOpenMenu("dest")}
                  onFocus={() => setOpenMenu("dest")}
                >
                  {t("nav_destinations")}
                </button>
                {openMenu === "dest" && (
                  <div 
                    className="absolute left-0 mt-2 w-[720px] rounded-xl border bg-background p-6 shadow-xl z-50"
                    onMouseEnter={() => setOpenMenu("dest")}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {DESTINATIONS.map((dest) => (
                        <Link
                          key={dest.slug}
                          to={`/destinations/${dest.slug}`}
                          className="group rounded-lg p-3 hover:bg-muted transition-colors"
                          onClick={() => setOpenMenu(null)}
                        >
                          <img 
                            src={dest.image} 
                            alt={dest.label}
                            className="w-full h-24 object-cover rounded-md mb-2"
                          />
                          <div className="font-medium">{dest.label}</div>
                          <div className="text-xs text-muted-foreground">Kenya</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Themes Mega Menu */}
              <div className="relative">
                <button
                  className="nav-link text-foreground hover:text-primary transition-colors text-sm"
                  onMouseEnter={() => setOpenMenu("theme")}
                  onFocus={() => setOpenMenu("theme")}
                >
                  {t("nav_themes")}
                </button>
                {openMenu === "theme" && (
                  <div 
                    className="absolute left-0 mt-2 w-[520px] rounded-xl border bg-background p-6 shadow-xl z-50"
                    onMouseEnter={() => setOpenMenu("theme")}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {THEMES.map((theme) => (
                        <Link
                          key={theme.slug}
                          to={`/themes/${theme.slug}`}
                          className="group rounded-lg p-3 hover:bg-muted transition-colors"
                          onClick={() => setOpenMenu(null)}
                        >
                          <div className="font-medium">{theme.label}</div>
                          <div className="text-xs text-muted-foreground">{theme.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Currency - all screen sizes */}
            <div className="hidden lg:block">
              <CurrencySelector />
            </div>

            {/* Search - all screen sizes */}
            <div className="relative" ref={searchRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg p-4 z-50">
                  <form onSubmit={handleSearch} className="space-y-3">
                    <input
                      name="search"
                      type="text"
                      placeholder={t("search_placeholder")}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                    <Button type="submit" size="sm" className="w-full">
                      <T k="search_button" />
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Profile or Sign In - all screen sizes */}
            {!loading && (
              user ? (
                <div className="relative hidden lg:block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 p-2 profile-chip"
                    onMouseEnter={() => setOpenMenu("profile")}
                    onFocus={() => setOpenMenu("profile")}
                    aria-label="Open your dashboard"
                    onClick={() => {
                      console.log("🎯 Profile clicked", { role: user.role });
                      const dashboardUrl = user.role === 'partner' ? '/dashboard/partner' : '/dashboard/user';
                      window.location.href = dashboardUrl;
                    }}
                  >
                    <img 
                      src={user.avatarUrl || "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png"} 
                      alt="" 
                      className="h-7 w-7 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";
                      }}
                    />
                    <span className="text-sm">Profile</span>
                  </Button>
                  {openMenu === "profile" && (
                    <div 
                      className="absolute right-0 mt-2 w-48 rounded-lg border bg-background p-2 shadow-xl z-50"
                      onMouseEnter={() => setOpenMenu("profile")}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                  <Link
                    to={user.role === 'partner' ? '/dashboard/partner' : '/dashboard/user'}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Settings className="h-4 w-4" />
                    Dashboard
                  </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 w-full justify-start px-3 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => {
                          signOut();
                          setOpenMenu(null);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors btn-auth"
                >
                  <User className="w-4 h-4" />
                  {t("nav_signin")}
                </Link>
              )
            )}

            {/* Partner CTA - always visible */}
            <Link to="/partner-entry">
              <Button size="sm" className="bg-primary hover:bg-primary-hover hidden lg:block">
                {t("nav_partner")}
              </Button>
            </Link>

            {/* Mobile Menu Toggle - only for nav menu, not bottom nav items */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 ml-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="p-4 space-y-2">
              <Link 
                to="/impact-ledger" 
                className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav_impact")}
              </Link>
              <Link 
                to="/partners" 
                className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav_partners")}
              </Link>
              <Link 
                to="/experiences" 
                className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav_marketplace")}
              </Link>
              <a 
                href="https://open.spotify.com/show/7oKIRbsUqrDwiH47E5VZvf?si=qhIVTrJLSSKf3jChj0POyA&nd=1&flow_ctx=3b79f64c-906a-4fa4-b0b7-6e45d375433b%3A1697319493" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Conservation Voices
              </a>
              
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("nav_destinations")}
                </div>
                {DESTINATIONS.map((dest) => (
                  <Link
                    key={dest.slug}
                    to={`/destinations/${dest.slug}`}
                    className="block px-6 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {dest.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("nav_themes")}
                </div>
                {THEMES.map((theme) => (
                  <Link
                    key={theme.slug}
                    to={`/themes/${theme.slug}`}
                    className="block px-6 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {theme.label}
                  </Link>
                ))}
              </div>

              {/* Mobile-only items */}
              <div className="lg:hidden space-y-2 border-t border-border pt-4 mt-4">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Settings
                </div>
                <div className="px-3 py-2">
                  <CurrencySelector />
                </div>
                {!loading && !user && (
                  <Link 
                    to="/auth"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {t("nav_signin")}
                  </Link>
                )}
                {!loading && user && (
                  <>
                    <Link
                      to={user.role === 'partner' ? '/dashboard/partner' : '/dashboard/user'}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <img 
                        src={user.avatarUrl || "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png"} 
                        alt="" 
                        className="h-4 w-4 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";
                        }}
                      />
                      Dashboard ({user.role})
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 w-full justify-start px-3 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      <NewAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </header>
  );
}