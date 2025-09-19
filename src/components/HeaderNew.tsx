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
  { label: "Nairobi", slug: "nairobi", image: "/src/assets/destinations/nairobi-destination.jpg", desc: "Urban wildlife sanctuary" },
  { label: "Samburu", slug: "samburu", image: "/src/assets/destinations/samburu-destination.jpg", desc: "Unique species and cultural encounters" },
  { label: "Laikipia", slug: "laikipia", image: "/src/assets/destinations/laikipia-destination.jpg", desc: "Community-owned conservation ranches" },
  { label: "Masai Mara", slug: "masai-mara", image: "/src/assets/destinations/masai-mara-destination.jpg", desc: "Great Migration and Big Five experiences" },
  { label: "Coastal Kenya", slug: "coast", image: "/src/assets/destinations/coast-destination.jpg", desc: "Coral reefs and marine conservation" },
];

const THEMES = [
  { label: "Wildlife Conservation", slug: "wildlife-conservation", desc: "Protect endangered species and habitats", icon: "🦏" },
  { label: "Marine Conservation", slug: "marine-conservation", desc: "Ocean and coral reef protection programs", icon: "🐢" },
  { label: "Community Tourism", slug: "community-tourism", desc: "Support local communities and cultural heritage", icon: "🏘️" },
  { label: "Conservation Education", slug: "conservation-education", desc: "Learn through hands-on research experiences", icon: "🎓" },
  { label: "Sustainable Safari", slug: "sustainable-safari", desc: "Low-impact wildlife viewing experiences", icon: "🦓" },
  { label: "Photography Tours", slug: "photography-tours", desc: "Capture conservation stories through lens", icon: "📸" },
  { label: "Volunteer Programs", slug: "volunteer-programs", desc: "Hands-on conservation project participation", icon: "🤝" },
  { label: "Research Expeditions", slug: "research-expeditions", desc: "Citizen science and wildlife monitoring", icon: "🔬" },
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
      {/* Full-width header container */}
      <header className="w-full bg-background border-b border-border sticky top-0 z-50" style={{ height: '60px' }}>
        {/* Constrained inner content */}
        <div className="w-full px-4 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left cluster - Logo only */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="NatuAsili" 
                  className="h-8 w-auto object-contain !filter-none !brightness-100 !invert-0" 
                />
              </Link>
            </div>

            {/* Center cluster - Search (perfectly centered) */}
            <div className="flex-1 flex justify-center px-4 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:px-0">
              {/* Mobile Search button (centered) */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
              </div>
              {/* Desktop Search (perfectly centered) */}
              <div className="hidden md:block w-[200px] lg:w-[240px] xl:w-[260px]">
                {desktopSearchOpen ? (
                  <AISearchComponent
                    variant="desktop"
                    className="w-full"
                    onClose={() => setDesktopSearchOpen(false)}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDesktopSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg w-full justify-start"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Right cluster - Marketplace, Currency, Auth, Hamburger (in that order) */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0 shrink-0" ref={menuRef}>
              
              {/* Marketplace Mega Menu - desktop/laptop only */}
              <div className="hidden lg:block relative">
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
                    className="absolute right-0 mt-2 w-[720px] rounded-xl border bg-background p-6 shadow-xl z-50"
                    onMouseEnter={() => setOpenMenu("marketplace")}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {/* Destinations */}
                      <div>
                        <h3 className="font-medium mb-4 text-muted-foreground">{t("nav_destinations")}</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {DESTINATIONS.map((dest) => (
                            <Link
                              key={dest.slug}
                              to={`/destinations/${dest.slug}`}
                              className="block p-3 hover:bg-muted rounded-lg transition-colors border-l-2 border-transparent hover:border-primary"
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="font-medium text-sm">{dest.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{dest.desc}</div>
                            </Link>
                          ))}
                          <div className="pt-2 border-t">
                            <Link
                              to="/destinations"
                              className="block p-2 text-center text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              onClick={() => setOpenMenu(null)}
                            >
                              View All Destinations →
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Conservation Themes */}
                      <div>
                        <h3 className="font-medium mb-4 text-muted-foreground">{t("nav_themes")}</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {THEMES.map((theme) => (
                          <Link
                              key={theme.slug}
                              to={`/listings?theme=${encodeURIComponent(theme.label)}`}
                              className="block p-3 hover:bg-muted rounded-lg transition-colors border-l-2 border-transparent hover:border-secondary"
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="flex items-center gap-2 font-medium text-sm">
                                <span className="text-base">{theme.icon}</span>
                                {theme.label}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{theme.desc}</div>
                            </Link>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Currency Selector - desktop/laptop only */}
              <div className="hidden lg:block">
                <CurrencySelector />
              </div>

              {/* Sign In/Up or Avatar - desktop/laptop only */}
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

              {/* Desktop Hamburger Menu - far right */}
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
                          📊 {t("nav_impact")}
                        </Button>
                      </Link>
                      
                      <Link to="/partner-entry" onClick={() => setDesktopHamburgerOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          🏕️ List Your Experience
                        </Button>
                      </Link>
                      
                       <hr className="my-2" />
                       
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="w-full justify-start"
                         onClick={() => {
                           console.log('Desktop AsiliChat button clicked');
                           const event = new CustomEvent('asili-chat:toggle');
                           document.dispatchEvent(event);
                           console.log('Desktop AsiliChat event dispatched');
                           setDesktopHamburgerOpen(false);
                         }}
                       >
                         🤖 AsiliChat AI
                       </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu - far right on mobile */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

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
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-border">
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
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="px-3 py-2">
                      <CurrencySelector />
                    </div>
                  </div>
                </nav>

                {/* Bottom: Auth CTAs */}
                <div className="border-t border-border p-4 space-y-3 mt-auto">
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

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-background">
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <AISearchComponent
                  variant="mobile"
                  className="w-full"
                  onClose={() => setMobileSearchOpen(false)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
                className="md:hidden p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <CartDrawer />
    </>
  );
}