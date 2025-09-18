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
      {/* Full-width header container */}
      <header className="w-full bg-background border-b border-border sticky top-0 z-50" style={{ height: '60px' }}>
        {/* Constrained inner content */}
        <div className="max-w-[1200px] mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left cluster - Logo + Navigation */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="NatuAsili" 
                  className="h-8 w-auto object-contain" 
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8" ref={menuRef}>
                {/* Marketplace Mega Menu */}
                <div className="relative">
                  <button
                    className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
                    onMouseEnter={() => setOpenMenu("marketplace")}
                    onFocus={() => setOpenMenu("marketplace")}
                  >
                    {t("nav_marketplace")}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {openMenu === "marketplace" && (
                    <div 
                      className="absolute left-0 mt-2 w-[720px] rounded-xl border bg-background p-6 shadow-xl z-50"
                      onMouseEnter={() => setOpenMenu("marketplace")}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <div className="grid grid-cols-2 gap-8">
                        {/* Destinations */}
                        <div>
                          <h3 className="font-medium mb-4 text-muted-foreground">{t("nav_destinations")}</h3>
                          <div className="space-y-2">
                            {DESTINATIONS.map((dest) => (
                              <Link
                                key={dest.slug}
                                to={`/destinations/${dest.slug}`}
                                className="block p-2 hover:bg-muted rounded-lg transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <div className="font-medium text-sm">{dest.label}</div>
                                <div className="text-xs text-muted-foreground">Kenya</div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Themes */}
                        <div>
                          <h3 className="font-medium mb-4 text-muted-foreground">{t("nav_themes")}</h3>
                          <div className="space-y-2">
                            {THEMES.map((theme) => (
                            <Link
                                key={theme.slug}
                                to={`/listings?theme=${encodeURIComponent(theme.label)}`}
                                className="block p-2 hover:bg-muted rounded-lg transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <div className="font-medium text-sm">{theme.label}</div>
                                <div className="text-xs text-muted-foreground">{theme.desc}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right cluster - Search + Auth + Mobile Menu */}
            <div className="flex items-center gap-4">
              
              {/* Desktop Search */}
              <div className="hidden md:block">
                {desktopSearchOpen ? (
                  <AISearchComponent 
                    variant="desktop" 
                    className="min-w-[320px]"
                    onClose={() => setDesktopSearchOpen(false)}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDesktopSearchOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg min-w-[240px] justify-start"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                  </Button>
                )}
              </div>

              {/* Currency Selector - desktop only */}
              <div className="hidden lg:block">
                <CurrencySelector />
              </div>

              {/* Sign In/Up or Avatar - desktop only */}
              {!loading && (
                user && profile ? (
                  <div className="hidden lg:block">
                    <AvatarMenu profile={profile} />
                  </div>
                ) : (
                  <Link to="/auth" className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                    <User className="w-4 h-4" />
                    <span>Log in</span>
                  </Link>
                )
              )}

              {/* Desktop Hamburger Menu */}
              <div className="hidden lg:block relative" ref={hamburgerRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDesktopHamburgerOpen(!desktopHamburgerOpen)}
                  className="p-2"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                {desktopHamburgerOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-background p-2 shadow-xl z-50">
                    <div className="space-y-1">
                      <Link to="/impact-ledger" onClick={() => setDesktopHamburgerOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          {t("nav_impact")}
                        </Button>
                      </Link>
                      
                      <Link to="/partner-entry" onClick={() => setDesktopHamburgerOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Add your experience
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background">
              <div className="flex flex-col h-full">
                {/* Top: search */}
                <div className="border-b border-border p-4">
                  <AISearchComponent 
                    variant="mobile" 
                    className="w-full"
                    onClose={() => {}}
                  />
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
                  
                  {/* Marketplace with dropdown */}
                  <div className="space-y-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setOpenMenu(openMenu === "mobile-marketplace" ? null : "mobile-marketplace")}
                    >
                      {t("nav_marketplace")}
                    </button>
                    {openMenu === "mobile-marketplace" && (
                      <div className="ml-4 space-y-1">
                        <div className="text-xs font-medium text-muted-foreground px-3 py-1">Destinations</div>
                        {DESTINATIONS.map((dest) => (
                          <Link
                            key={dest.slug}
                            to={`/destinations/${dest.slug}`}
                            className="block px-3 py-1 text-sm hover:bg-muted rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dest.label}
                          </Link>
                        ))}
                        <div className="text-xs font-medium text-muted-foreground px-3 py-1 mt-2">Themes</div>
                        {THEMES.map((theme) => (
                          <Link
                            key={theme.slug}
                            to={`/listings?theme=${encodeURIComponent(theme.label)}`}
                            className="block px-3 py-1 text-sm hover:bg-muted rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
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
        </div>
      </header>

      <CartDrawer />
    </>
  );
}