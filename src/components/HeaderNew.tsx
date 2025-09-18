import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import AISearchComponent from "@/components/AISearchComponent";
import { useI18n } from "@/i18n/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarMenu } from "@/components/auth/AvatarMenu";
import { getDashboardPath } from "@/lib/auth";
import { useMultiCart } from "@/contexts/MultiCartContext";
import CartDrawer from "@/components/CartDrawer";
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

export default function HeaderNew() {
  const { t } = useI18n();
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<null | "marketplace" | "mobile-marketplace">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [desktopHamburgerOpen, setDesktopHamburgerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setDesktopHamburgerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Full-width, sticky header */}
      <header className="w-screen fixed top-0 left-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <nav className="w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 h-16">
              
              {/* LEFT: LOGO */}
              <Link to="/" className="shrink-0 flex items-center min-w-[120px]">
                <img 
                  src={logoImage} 
                  alt="NatuAsili" 
                  className="h-8 w-auto" 
                />
              </Link>

              {/* CENTER: SEARCH (flex-grow so it stays centered) */}
              <div className="flex-1 flex justify-center">
                <form action="/search" className="w-full max-w-3xl" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('q') as string;
                  if (query?.trim()) {
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }}>
                  <label className="sr-only" htmlFor="site-search">Search</label>
                  <div className="flex items-center rounded-full border border-black/10 shadow-sm overflow-hidden">
                    <input 
                      id="site-search" 
                      name="q" 
                      placeholder="Search experiences, parks, conservancies…" 
                      className="w-full px-4 py-2.5 outline-none text-sm" 
                    />
                    <button type="submit" className="px-4 py-2.5 text-sm font-medium bg-black text-white">
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: LINKS + BUTTONS */}
              <div className="ml-3 flex items-center gap-3">
                <Link to="/marketplace" className="hidden lg:inline-block text-sm font-medium hover:opacity-80">
                  {t("nav_marketplace")}
                </Link>

                {/* Currency */}
                <div className="hidden lg:block">
                  <CurrencySelector />
                </div>

                {/* Login */}
                {!loading && (
                  user && profile ? (
                    <div className="hidden lg:block">
                      <AvatarMenu profile={profile} />
                    </div>
                  ) : (
                    <Link to="/auth" className="hidden lg:inline-block text-sm font-medium hover:opacity-80">
                      Log in
                    </Link>
                  )
                )}

                {/* Hamburger */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border lg:border-0"
                  aria-label="Open menu"
                >
                  <span className="sr-only">Menu</span>
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                      <path d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Push content below fixed header */}
      <div className="h-16"></div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="NatuAsili" 
                  className="h-8 w-auto object-contain" 
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="w-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="border-b border-border p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg"
                onClick={() => { setIsMobileMenuOpen(false); setMobileSearchOpen(true); }}
                aria-label="Open search"
              >
                <Search className="h-4 w-4 mr-2" />
                <span>Search...</span>
              </Button>
            </div>

            {/* Main navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {/* Marketplace with dropdown */}
              <div className="space-y-2">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center justify-between"
                  onClick={() => setOpenMenu(openMenu === "mobile-marketplace" ? null : "mobile-marketplace")}
                >
                  {t("nav_marketplace")}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "mobile-marketplace" ? "rotate-180" : ""}`} />
                </button>
                {openMenu === "mobile-marketplace" && (
                  <div className="ml-4 space-y-1">
                    <div className="text-xs font-medium text-muted-foreground px-3 py-1">Destinations</div>
                    {DESTINATIONS.map((dest) => (
                      <Link
                        key={dest.slug}
                        to={`/destinations/${dest.slug}`}
                         className="block px-3 py-1 text-sm hover:bg-muted rounded-md pointer-events-auto"
                         onClick={() => { setIsMobileMenuOpen(false); setOpenMenu(null); }}
                      >
                        {dest.label}
                      </Link>
                    ))}
                    <div className="text-xs font-medium text-muted-foreground px-3 py-1 mt-2">Themes</div>
                    {THEMES.map((theme) => (
                      <Link
                        key={theme.slug}
                        to={`/listings?theme=${encodeURIComponent(theme.label)}`}
                         className="block px-3 py-1 text-sm hover:bg-muted rounded-md pointer-events-auto"
                         onClick={() => { setIsMobileMenuOpen(false); setOpenMenu(null); }}
                      >
                        {theme.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/impact-ledger" 
                className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav_impact")}
              </Link>
              
              <Link 
                to="/partner-entry" 
                className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add your experience
              </Link>
              
              <button
                className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => {
                  console.log('Mobile AsiliChat button clicked');
                  const event = new CustomEvent('asili-chat:toggle');
                  document.dispatchEvent(event);
                  console.log('Mobile AsiliChat event dispatched');
                  setIsMobileMenuOpen(false);
                }}
              >
                AsiliChat
              </button>

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
                      to={profile ? getDashboardPath(profile.role) : "/user-dashboard"} 
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
                    Log in
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <AISearchComponent
          variant="mobile"
          onClose={() => setMobileSearchOpen(false)}
        />
      )}

      <CartDrawer />
    </>
  );
}