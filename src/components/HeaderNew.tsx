import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import CurrencySelector from "@/components/CurrencySelector";
import AISearchComponent from "@/components/AISearchComponent";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarMenu } from "@/components/auth/AvatarMenu";
import CartDrawer from "@/components/CartDrawer";

export default function HeaderNew() {
  const { user, profile, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Winalist-style Full-Width Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/lovable-uploads/3ed5daa6-7ee7-4b1c-92f1-5c5a6c82cbd5.png" 
              alt="NatuAsili" 
              className="h-8 lg:h-10" 
            />
          </Link>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 justify-center mx-8">
            {isSearchOpen ? (
              <AISearchComponent
                variant="desktop"
                className="w-full max-w-lg"
                onClose={() => setIsSearchOpen(false)}
              />
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-full max-w-lg px-4 py-3 text-left text-muted-foreground bg-background border rounded-full hover:border-primary transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search locations or experiences...</span>
              </button>
            )}
          </div>

          {/* Right: Currency, Login, Menu (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            <CurrencySelector />
            
            {!loading && (
              user && profile ? (
                <AvatarMenu profile={profile} />
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Log in</span>
                  </Button>
                </Link>
              )
            )}
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-accent rounded-lg"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile: Search Icon + Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setMobileSearchOpen(true)}
              className="p-2 hover:bg-accent rounded-lg"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-accent rounded-lg"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Menu Dropdown */}
      {isMobileMenuOpen && !window.matchMedia('(max-width: 1024px)').matches && (
        <div className="absolute right-6 top-16 mt-2 w-64 rounded-lg border bg-background p-4 shadow-xl z-50">
          <div className="space-y-3">
            <Link
              to="/marketplace"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            
            <Link
              to="/impact-ledger"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact Ledger
            </Link>
            
            <Link
              to="/partner-entry"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              List Your Experience
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start p-0 text-sm font-medium hover:text-primary"
              onClick={() => {
                const event = new CustomEvent('asili-chat:toggle');
                document.dispatchEvent(event);
                setIsMobileMenuOpen(false);
              }}
            >
              AsiliChat AI
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && window.matchMedia('(max-width: 1024px)').matches && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <img 
              src="/lovable-uploads/3ed5daa6-7ee7-4b1c-92f1-5c5a6c82cbd5.png" 
              alt="NatuAsili" 
              className="h-8" 
            />
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-accent rounded-lg"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
            {/* Main Navigation */}
            <div className="space-y-4">
              <Link
                to="/marketplace"
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              
              <Link
                to="/impact-ledger"
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Impact Ledger
              </Link>
              
              <Link
                to="/partner-entry"
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                List Your Experience
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start p-0 text-lg font-medium hover:text-primary"
                onClick={() => {
                  const event = new CustomEvent('asili-chat:toggle');
                  document.dispatchEvent(event);
                  setIsMobileMenuOpen(false);
                }}
              >
                AsiliChat AI
              </Button>
            </div>

            {/* Mobile Currency & Auth */}
            <div className="border-t pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <CurrencySelector />
              </div>
              
              <div className="pt-4">
                {!loading && (
                  user && profile ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Signed in as {profile.email}</div>
                      <Link
                        to="/dashboard"
                        className="block text-sm text-primary hover:underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="block w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full">
                        Log in
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center p-4 border-b">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setMobileSearchOpen(false)}
              className="mr-2 p-2"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <AISearchComponent
                variant="mobile"
                className="w-full"
                onClose={() => setMobileSearchOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}