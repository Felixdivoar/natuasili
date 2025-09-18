import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, LogOut, Settings, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import { useI18n } from "@/i18n/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarMenu } from "@/components/auth/AvatarMenu";
import { getDashboardPath } from "@/lib/auth";
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
  const { user, profile, signOut, loading } = useAuth();
  const [openMenu, setOpenMenu] = useState<null | "dest" | "theme" | "profile">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  console.log("🔐 Header: Clean auth state", { hasUser: !!user, hasProfile: !!profile, loading });

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
    <header className="bg-background border-b border-border sticky top-0 z-50 header-compact">
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
              <Link to="/experiences" className="nav-link text-foreground hover:text-primary transition-colors text-sm">
                {t("nav_marketplace")}
              </Link>
              <a 
                href="https://open.spotify.com/show/7oKIRbsUqrDwiH47E5VZvf?si=qhIVTrJLSSKf3jChj0POyA&nd=1&flow_ctx=3b79f64c-906a-4fa4-b0b7-6e45d375433b%3A1697319493" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link text-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
              >
                <Headphones className="w-4 h-4" />
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
            {/* Currency - desktop only */}
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

            {/* Profile or Sign In - desktop only */}
            {!loading && (
              user && profile ? (
                <div className="hidden lg:block">
                  <AvatarMenu profile={profile} />
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

            {/* Mobile Menu Toggle */}
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

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              {/* Top: Search */}
              <div className="border-b border-border p-4">
                <form onSubmit={handleSearch} className="space-y-3">
                  <input
                    name="search"
                    type="text"
                    placeholder={t("search_placeholder")}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button type="submit" size="sm" className="w-full">
                    <T k="search_button" />
                  </Button>
                </form>
              </div>

              {/* Main navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link 
                  to="/" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/experiences" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav_marketplace")}
                </Link>
                <Link 
                  to="/impact-ledger" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Impact Ledger
                </Link>
                <Link 
                  to="/partner-entry" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add your experience
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/privacy" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Privacy
                </Link>
                <Link 
                  to="/terms" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Terms
                </Link>

                {/* Currency converter */}
                <div className="pt-4 border-t border-border mt-4">
                  <div className="px-3 py-2">
                    <CurrencySelector />
                  </div>
                </div>
              </nav>

              {/* Bottom: Auth CTAs */}
              <div className="border-t border-border p-4 space-y-3">
                {!loading && (
                  user && profile ? (
                    <div className="space-y-2">
                      <Link 
                        to={getDashboardPath(profile.role)} 
                        className="block w-full text-center px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link 
                      to="/auth"
                      className="block w-full text-center px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In / Sign Up
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </header>
  );
}