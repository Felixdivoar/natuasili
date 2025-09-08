import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, ChevronDown, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import AISearchComponent from "@/components/AISearchComponent";
import { useI18n } from "@/i18n/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarMenu } from "@/components/auth/AvatarMenu";
import { getDashboardPath } from "@/lib/auth";

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
  const [openMenu, setOpenMenu] = useState<null | "marketplace">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Analytics: track search opens
    if (mobileSearchOpen) {
      console.log("Analytics: search_opened", { platform: "mobile" });
    }
    if (desktopSearchOpen) {
      console.log("Analytics: search_opened", { platform: "desktop" });
    }
  }, [mobileSearchOpen, desktopSearchOpen]);

  return (
    <>
      {/* Full-width header container */}
      <header className="w-full bg-background border-b border-border sticky top-0 z-50" style={{ height: '60px' }}>
        {/* Constrained inner content */}
        <div className="max-w-[1150px] mx-auto px-4 h-full">
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
                <Link 
                  to="/impact-ledger" 
                  className="text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
                >
                  {t("nav_impact")}
                </Link>
                
                <Link 
                  to="/partners" 
                  className="text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
                >
                  {t("nav_partners")}
                </Link>
                
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

            {/* Right cluster - AI Search + Currency + Language + Auth + CTA */}
            <div className="flex items-center gap-4">
              
              {/* Desktop AI Search */}
              <div className="hidden md:block">
                {desktopSearchOpen ? (
                  <AISearchComponent 
                    variant="desktop" 
                    className="min-w-[280px]"
                    onClose={() => setDesktopSearchOpen(false)}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDesktopSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg min-w-[160px] justify-start"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                  </Button>
                )}
              </div>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-2"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Currency Selector */}
              <div className="hidden md:block">
                <CurrencySelector />
              </div>

              {/* Sign In/Up or Avatar */}
              {!loading && (
                user && profile ? (
                  <AvatarMenu profile={profile} />
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{t("nav_signin")}</span>
                    </Button>
                  </Link>
                )
              )}

              {/* Partner CTA */}
              <Link to="/partner-with-us">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  <span className="hidden sm:inline">{t("nav_partner")}</span>
                  <span className="sm:hidden">Partner</span>
                </Button>
              </Link>

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
                  to="/marketplace" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav_marketplace")}
                </Link>
                
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
                      to={`/listings?theme=${encodeURIComponent(theme.label)}`}
                      className="block px-6 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {theme.label}
                    </Link>
                  ))}
                </div>

                <div className="md:hidden pt-2 border-t">
                  <CurrencySelector />
                </div>

                {/* Mobile Auth Section */}
                {!loading && (
                  user && profile ? (
                    <div className="md:hidden pt-2 border-t space-y-2">
                      <div className="px-3 py-2 text-sm">
                        <div className="font-medium">{profile.first_name || 'User'}</div>
                        <div className="text-xs text-muted-foreground capitalize">{profile.role}</div>
                      </div>
                      <Link 
                        to={getDashboardPath(profile.role)}
                        className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile"
                        className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={async () => {
                          await signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md text-red-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="md:hidden w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        {t("nav_signin")}
                      </Button>
                    </Link>
                  )
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Mobile AI Search Overlay */}
      <AISearchComponent 
        variant="mobile" 
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </>
  );
}