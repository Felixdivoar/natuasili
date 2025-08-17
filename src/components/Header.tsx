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
            <img src={logoImage} alt="NatuAsili" className="h-12" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/impact-ledger" className="text-foreground hover:text-primary transition-colors">
              Impact Ledger
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              My Dashboard
            </Link>
            <Link to="/partners" className="text-foreground hover:text-primary transition-colors">
              Partners
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <CurrencySelector />
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              <Link to="/dashboard">Sign In</Link>
            </Button>
            <Link to="/partner-dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;