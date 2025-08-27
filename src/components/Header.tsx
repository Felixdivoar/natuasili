import { Button } from "@/components/ui/button";
import { Leaf, Search, User, Heart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 site-header">
      <div className="container mx-auto px-4">
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
          <nav className="hidden xl:flex items-center space-x-4 xl:space-x-6 primary-menu">
            <li><Link to="/impact-ledger" className="text-foreground hover:text-primary transition-colors text-sm py-1.5 px-2">
              Impact Ledger
            </Link></li>
            <li><Link to="/marketplace" className="text-foreground hover:text-primary transition-colors text-sm py-1.5 px-2">
              Marketplace
            </Link></li>
            <li><Link to="/dashboard" className="text-foreground hover:text-primary transition-colors text-sm py-1.5 px-2">
              My Dashboard
            </Link></li>
          </nav>

          {/* Mobile Navigation Menu - Show on tablet and mobile (≤1024px) */}
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
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-2 space-y-1">
                  <Link 
                    to="/impact-ledger" 
                    className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Impact Ledger
                  </Link>
                  <Link 
                    to="/marketplace" 
                    className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Marketplace
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex text-xs">
              <User className="w-4 h-4 mr-1" />
              <Link to="/dashboard">Sign In</Link>
            </Button>
            <Button variant="outline" size="sm" className="md:hidden p-2">
              <User className="w-4 h-4" />
            </Button>
            <Link to="/partner-dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary-hover text-xs px-2 sm:px-3">
                <span className="hidden sm:inline">Partner With Us</span>
                <span className="sm:hidden">Partner</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;