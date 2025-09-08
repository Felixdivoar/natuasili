"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

export default function MobileHeader() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";

  return (
    <header className="mobile-header xl:hidden" aria-label="Mobile header">
      <Link to="/" aria-label="Home" className="mh-logo">
        <img 
          src={logoImage} 
          alt="NatuAsili" 
          className="h-8 w-auto object-contain"
        />
      </Link>
      
      <Link to="/partner-entry" className="mh-cta">
        {t("nav_partner")}
      </Link>
      
      <Button 
        variant="ghost"
        size="sm"
        className="mh-burger p-2" 
        aria-label="Open menu" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="w-5 h-5" />
      </Button>
      
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-menu-content">
            <Link 
              to="/impact-ledger" 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav_impact")}
            </Link>
            <Link 
              to="/partners" 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav_partners")}
            </Link>
            <Link 
              to="/experiences" 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav_marketplace")}
            </Link>
            <Link 
              to="/destinations/nairobi" 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Nairobi
            </Link>
            <Link 
              to="/destinations/coast" 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Coastal Kenya
            </Link>
            <Link 
              to="/destinations/samburu" 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Samburu
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}