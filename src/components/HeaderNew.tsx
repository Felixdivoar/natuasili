import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, ChevronDown, Globe, ShoppingCart, LogOut, MessageCircle } from "lucide-react";
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
import NotificationBell from "@/components/NotificationBell";

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
  const { itemCount, setOpen } = useMultiCart();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<null | "marketplace">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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

              {/* Currency Selector */}
              <div className="hidden md:block">
                <CurrencySelector />
              </div>

              {/* Desktop Hamburger Menu */}
              <div className="hidden md:block relative" ref={hamburgerRef}>
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
                      {!user ? (
                        <>
                          <Link to="/auth" onClick={() => setDesktopHamburgerOpen(false)}>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <User className="w-4 h-4 mr-2" />
                              Sign In / Sign Up
                            </Button>
                          </Link>
                        </>
                      ) : null}
                      
                      <Link to="/partners" onClick={() => setDesktopHamburgerOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Partners
                        </Button>
                      </Link>
                      
                      <Link to="/refer-partner" onClick={() => setDesktopHamburgerOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Refer a Partner
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => {
                          setDesktopHamburgerOpen(false);
                          document.dispatchEvent(new CustomEvent('asili-chat:toggle'));
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        AsiliChat
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign In/Up or Avatar */}
              {!loading && (
                user && profile ? (
                  <AvatarMenu profile={profile} />
                ) : (
                  <Link to="/auth" className="hidden">
                    <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{t("nav_signin")}</span>
                    </Button>
                  </Link>
                )
              )}

              {/* Notifications Bell - Only show for authenticated users */}
              {!loading && user && (
                <NotificationBell />
              )}

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-medium rounded-full px-1.5 py-0.5 bg-primary text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </button>

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

                  {/* Mobile Auth Actions */}
                  <div className="pt-4 border-t border-border">
                    {!loading && (
                      user && profile ? (
                        <div className="space-y-2">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md w-full text-left text-destructive"
                          >
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link 
                            to="/auth" 
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Sign In / Sign Up
                          </Link>
                        </div>
                      )
                    )}
                    
                    <div className="pt-2 space-y-1">
                      <Link 
                        to="/partners" 
                        className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Partners
                      </Link>
                      
                      <Link 
                        to="/refer-partner" 
                        className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Refer a Partner
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          document.dispatchEvent(new CustomEvent('asili-chat:toggle'));
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md w-full text-left"
                      >
                        <MessageCircle className="w-4 h-4" />
                        AsiliChat
                      </button>
                    </div>
                  </div>

                 {/* Mobile Currency & Search */}
                 <div className="pt-4 border-t border-border md:hidden">
                   <div className="space-y-2">
                     <button
                       onClick={() => {
                         setMobileSearchOpen(true);
                         setIsMobileMenuOpen(false);
                       }}
                       className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md w-full text-left"
                     >
                       <Search className="w-4 h-4" />
                       Search
                     </button>
                     <div className="px-3 py-2">
                       <CurrencySelector />
                     </div>
                   </div>
                 </div>

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
      <CartDrawer />
    </>
  );
}