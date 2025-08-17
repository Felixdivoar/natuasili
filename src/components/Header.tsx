import { Button } from "@/components/ui/button";
import { Leaf, Search, User, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import CurrencySelector from "@/components/CurrencySelector";
const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
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
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link to="/about" className="text-foreground hover:text-primary transition-colors text-sm">
              About
            </Link>
            <Link to="/impact-ledger" className="text-foreground hover:text-primary transition-colors text-sm">
              Impact Ledger
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors text-sm">
              Marketplace
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors text-sm">
              My Dashboard
            </Link>
            <Link to="/partners" className="text-foreground hover:text-primary transition-colors text-sm">
              Partners
            </Link>
          </nav>

          {/* Mobile Navigation Menu */}
          <div className="flex lg:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer p-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-5 h-0.5 bg-foreground"></div>
                  <div className="w-5 h-0.5 bg-foreground"></div>
                  <div className="w-5 h-0.5 bg-foreground"></div>
                </div>
              </summary>
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-2 space-y-1">
                  <Link to="/about" className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                    About
                  </Link>
                  <Link to="/impact-ledger" className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                    Impact Ledger
                  </Link>
                  <Link to="/marketplace" className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                    Marketplace
                  </Link>
                  <Link to="/dashboard" className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                    My Dashboard
                  </Link>
                  <Link to="/partners" className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
                    Partners
                  </Link>
                </div>
              </div>
            </details>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <CurrencySelector />
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <User className="w-4 h-4 mr-2" />
              <Link to="/dashboard">Sign In</Link>
            </Button>
            <Button variant="outline" size="sm" className="sm:hidden">
              <User className="w-4 h-4" />
            </Button>
            <Link to="/partner-dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary-hover text-xs sm:text-sm px-2 sm:px-3">
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