import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import { useI18n } from "@/i18n/I18nProvider";

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

export default function HeaderCompact() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<null | "marketplace">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <header className="w-full bg-background border-b border-border sticky top-0 z-50" style={{ height: '60px' }}>
        <div className="max-w-screen-2xl mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left cluster */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="NatuAsili" 
                  className="h-8 w-auto object-contain" 
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6" ref={menuRef}>
                <Link to="/impact-ledger" className="text-foreground hover:text-primary transition-colors text-sm py-2">
                  Impact Ledger
                </Link>
                <Link to="/partners" className="text-foreground hover:text-primary transition-colors text-sm py-2">
                  Partners
                </Link>
                
                {/* Marketplace Mega Menu */}
                <div className="relative">
                  <button
                    className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-sm py-2"
                    onMouseEnter={() => setOpenMenu("marketplace")}
                    onFocus={() => setOpenMenu("marketplace")}
                  >
                    Marketplace
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {openMenu === "marketplace" && (
                    <div 
                      className="absolute left-0 mt-2 w-[780px] rounded-xl border bg-background p-6 shadow-xl z-50"
                      onMouseEnter={() => setOpenMenu("marketplace")}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <div className="grid grid-cols-2 gap-8">
                        {/* Destinations */}
                        <div>
                          <h3 className="font-medium mb-4 text-muted-foreground">Destinations</h3>
                          <div className="space-y-2">
                            {DESTINATIONS.map((dest) => (
                              <Link
                                key={dest.slug}
                                to={`/destinations/${dest.slug}`}
                                className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <img 
                                  src={dest.image} 
                                  alt={dest.label}
                                  className="w-12 h-8 object-cover rounded"
                                />
                                <div>
                                  <div className="font-medium text-sm">{dest.label}</div>
                                  <div className="text-xs text-muted-foreground">Kenya</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Themes */}
                        <div>
                          <h3 className="font-medium mb-4 text-muted-foreground">Themes</h3>
                          <div className="space-y-2">
                            {THEMES.map((theme) => (
                              <Link
                                key={theme.slug}
                                to={`/themes/${theme.slug}`}
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

            {/* Right cluster */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <CurrencySelector />
              </div>

              {/* Desktop Search */}
              <div className="hidden md:block relative" ref={searchRef}>
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      name="search"
                      type="text"
                      placeholder="Search experiences..."
                      className="w-60 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                    <Button type="submit" size="sm" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setSearchOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(true)}
                    className="p-2"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Sign In/Up */}
              <Button variant="outline" size="sm" className="hidden md:flex">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>

              {/* Partner CTA */}
              <Link to="/partner-entry">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <span className="hidden sm:inline">Partner With Us</span>
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
                  Impact Ledger
                </Link>
                <Link 
                  to="/partners" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Partners
                </Link>
                <Link 
                  to="/experiences" 
                  className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                
                <div className="space-y-1">
                  <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Destinations
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
                    Themes
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

              </nav>
            </div>
          )}
        </div>
      </header>

    </>
  );
}