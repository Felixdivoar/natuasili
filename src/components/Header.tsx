import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, ChevronDown, MapPin, Heart, Calendar, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import { useI18n } from "@/contexts/I18nContext";
const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [destinationMenuOpen, setDestinationMenuOpen] = useState(false);
  const [experienceMenuOpen, setExperienceMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setDestinationMenuOpen(false);
        setExperienceMenuOpen(false);
      }
    };

    if (isMobileMenuOpen || destinationMenuOpen || experienceMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, destinationMenuOpen, experienceMenuOpen]);

  const destinations = [
    { name: t("Maasai Mara", "Maasai Mara"), link: "/destinations/masai-mara", price: "from KES 8,500" },
    { name: t("Samburu", "Samburu"), link: "/destinations/samburu", price: "from KES 6,200" },
    { name: t("Laikipia", "Laikipia"), link: "/destinations/laikipia", price: "from KES 12,000" },
    { name: t("Coastal Kenya", "Coastal Kenya"), link: "/destinations/coast", price: "from KES 4,800" },
    { name: t("Nairobi", "Nairobi"), link: "/destinations/nairobi", price: "from KES 3,500" }
  ];

  const themes = [
    { name: t("Wildlife Conservation", "Wildlife Conservation"), icon: "🦁", link: "/search?theme=wildlife" },
    { name: t("Marine Conservation", "Marine Conservation"), icon: "🐢", link: "/search?theme=marine" },
    { name: t("Community Projects", "Community Projects"), icon: "🏘️", link: "/search?theme=community" },
    { name: t("Cultural Experiences", "Cultural Experiences"), icon: "🎭", link: "/search?theme=culture" }
  ];

  const impacts = [
    { name: t("Rhino Conservation", "Rhino Conservation"), badge: "🦏", link: "/search?impact=rhino" },
    { name: t("Elephant Protection", "Elephant Protection"), badge: "🐘", link: "/search?impact=elephant" },
    { name: t("Forest Restoration", "Forest Restoration"), badge: "🌳", link: "/search?impact=forest" },
    { name: t("Marine Protection", "Marine Protection"), badge: "🌊", link: "/search?impact=marine" }
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 site-header header-compact">
      <div className="nav-inner">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="NatuAsili" 
              className="h-6 sm:h-7 md:h-8 w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-none" 
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 primary-menu">
            {/* Destinations Mega Menu */}
            <div className="relative" ref={menuRef}>
              <button
                className="nav-link text-foreground hover:text-primary transition-colors text-sm flex items-center px-3 py-2"
                onMouseEnter={() => setDestinationMenuOpen(true)}
                onMouseLeave={() => setDestinationMenuOpen(false)}
              >
                {t("Destinations", "Destinations")}
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              
              {destinationMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-[600px] bg-background border border-border rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setDestinationMenuOpen(true)}
                  onMouseLeave={() => setDestinationMenuOpen(false)}
                >
                  <div className="grid grid-cols-3 gap-6 p-6">
                    <div>
                      <h3 className="font-medium text-sm mb-3 text-muted-foreground">{t("Top Regions", "Top Regions")}</h3>
                      <div className="space-y-2">
                        {destinations.map((dest, idx) => (
                          <Link 
                            key={idx}
                            to={dest.link}
                            className="block hover:text-primary transition-colors"
                          >
                            <div className="text-sm font-medium">{dest.name}</div>
                            <div className="text-xs text-muted-foreground">{dest.price}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-3 text-muted-foreground">{t("Themes", "Themes")}</h3>
                      <div className="space-y-2">
                        {themes.map((theme, idx) => (
                          <Link 
                            key={idx}
                            to={theme.link}
                            className="flex items-center space-x-2 hover:text-primary transition-colors"
                          >
                            <span>{theme.icon}</span>
                            <span className="text-sm">{theme.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-3 text-muted-foreground">{t("Impact Focus", "Impact Focus")}</h3>
                      <div className="space-y-2">
                        {impacts.map((impact, idx) => (
                          <Link 
                            key={idx}
                            to={impact.link}
                            className="flex items-center space-x-2 hover:text-primary transition-colors"
                          >
                            <span>{impact.badge}</span>
                            <span className="text-sm">{impact.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Experiences Mega Menu */}
            <div className="relative">
              <button
                className="nav-link text-foreground hover:text-primary transition-colors text-sm flex items-center px-3 py-2"
                onMouseEnter={() => setExperienceMenuOpen(true)}
                onMouseLeave={() => setExperienceMenuOpen(false)}
              >
                {t("Experiences", "Experiences")}
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              
              {experienceMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-[500px] bg-background border border-border rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setExperienceMenuOpen(true)}
                  onMouseLeave={() => setExperienceMenuOpen(false)}
                >
                  <div className="grid grid-cols-2 gap-6 p-6">
                    <div>
                      <h3 className="font-medium text-sm mb-3 text-muted-foreground">{t("Activity Types", "Activity Types")}</h3>
                      <div className="space-y-2">
                        <Link to="/search?activity=tracking" className="block text-sm hover:text-primary transition-colors">{t("Wildlife Tracking", "Wildlife Tracking")}</Link>
                        <Link to="/search?activity=education" className="block text-sm hover:text-primary transition-colors">{t("Conservation Education", "Conservation Education")}</Link>
                        <Link to="/search?activity=community" className="block text-sm hover:text-primary transition-colors">{t("Community Projects", "Community Projects")}</Link>
                        <Link to="/search?activity=workshop" className="block text-sm hover:text-primary transition-colors">{t("Cultural Workshops", "Cultural Workshops")}</Link>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm mb-3 text-muted-foreground">{t("Duration", "Duration")}</h3>
                      <div className="space-y-2">
                        <Link to="/search?duration=half-day" className="block text-sm hover:text-primary transition-colors">{t("Half Day (2-4 hours)", "Half Day (2-4 hours)")}</Link>
                        <Link to="/search?duration=full-day" className="block text-sm hover:text-primary transition-colors">{t("Full Day (5-8 hours)", "Full Day (5-8 hours)")}</Link>
                        <Link to="/search?duration=multi-day" className="block text-sm hover:text-primary transition-colors">{t("Multi-day", "Multi-day")}</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" className="nav-link text-foreground hover:text-primary transition-colors text-sm px-3 py-2">
              {t("Impact Stories", "Impact Stories")}
            </Link>
            <Link to="/partners" className="nav-link text-foreground hover:text-primary transition-colors text-sm px-3 py-2">
              {t("Partners", "Partners")}
            </Link>
            <Link to="/about" className="nav-link text-foreground hover:text-primary transition-colors text-sm px-3 py-2">
              {t("About", "About")}
            </Link>
          </nav>

          {/* Search - Prominent GYG style */}
          <div className="hidden lg:flex items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                if (query?.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                }
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                name="search"
                type="text"
                placeholder={t("Where to? What impact?", "Where to? What impact?")}
                className="pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
              />
            </form>
          </div>

          {/* Mobile Navigation Menu */}
          <div className="flex xl:hidden relative hamburger-toggle" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            {isMobileMenuOpen && (
              <div className="fixed inset-0 top-14 bg-background border-t border-border z-50 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* Mobile Search */}
                  <div className="lg:hidden">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const query = formData.get('search') as string;
                        if (query?.trim()) {
                          window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className="relative"
                    >
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        name="search"
                        type="text"
                        placeholder={t("Where to? What impact?", "Where to? What impact?")}
                        className="pl-10 pr-4 py-3 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                      />
                    </form>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="space-y-3">
                    <Link 
                      to="/destinations" 
                      className="flex items-center px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MapPin className="w-5 h-5 mr-3" />
                      {t("Destinations", "Destinations")}
                    </Link>
                    <Link 
                      to="/search" 
                      className="flex items-center px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Compass className="w-5 h-5 mr-3" />
                      {t("Experiences", "Experiences")}
                    </Link>
                    <Link 
                      to="/blog" 
                      className="flex items-center px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5 mr-3" />
                      {t("Impact Stories", "Impact Stories")}
                    </Link>
                    <Link 
                      to="/partners" 
                      className="flex items-center px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      {t("Partners", "Partners")}
                    </Link>
                    <Link 
                      to="/about" 
                      className="flex items-center px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("About", "About")}
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      {t("My Dashboard", "My Dashboard")}
                    </Link>
                  </div>

                  {/* Mobile Controls at bottom */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <CurrencySelector />
                      <select 
                        value={lang} 
                        onChange={e => setLang(e.target.value as any)}
                        className="border border-border rounded px-3 py-2 bg-background"
                      >
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="de">DE</option>
                        <option value="es">ES</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <div className="hidden sm:block xl:hidden">
              <CurrencySelector />
            </div>
            
            {/* Language Selector - Desktop only */}
            <div className="hidden xl:block">
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value as any)}
                className="text-xs border border-border rounded px-2 py-1 bg-background"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="es">ES</option>
              </select>
            </div>
            
            <Button variant="outline" size="sm" className="hidden md:flex text-xs">
              <User className="w-4 h-4 mr-1" />
              <Link to="/dashboard">{t("Sign In", "Sign In")}</Link>
            </Button>
            <Button variant="outline" size="sm" className="md:hidden p-2">
              <User className="w-4 h-4" />
            </Button>
            <Link to="/partner-entry">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-2 sm:px-3">
                <span className="hidden sm:inline">{t("Partner With Us", "Partner With Us")}</span>
                <span className="sm:hidden">{t("Partner", "Partner")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;