import { Button } from "@/components/ui/button";
import { Leaf, Search, User, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import CurrencySelector from "@/components/CurrencySelector";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NatuAsili</h1>
              <p className="text-xs text-muted-foreground">Conservation Impact Hub</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/impact-ledger" className="text-foreground hover:text-primary transition-colors">
              Impact Ledger
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              My Dashboard
            </Link>
            <Link to="/partners" className="text-foreground hover:text-primary transition-colors">
              Partners
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <CurrencySelector />
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="w-4 h-4 mr-2" />
              Saved
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
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