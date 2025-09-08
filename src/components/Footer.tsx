import { Button } from "@/components/ui/button";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import visaLogo from "@/assets/visa-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import mpesaLogo from "@/assets/mpesa-logo.png";

const Footer = () => {
  const { t } = useI18n();
  
  return (
    <footer className="bg-foreground text-white site-footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Quick Links - Alphabetically Organized */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer_explore")}</h4>
            <ul className="space-y-2 text-sm footer-explore">
              <li><Link to="/about" className="text-white/80 hover:text-accent transition-colors">{t("footer_about")}</Link></li>
              <li><Link to="/destinations" className="text-white/80 hover:text-accent transition-colors">{t("footer_destinations")}</Link></li>
              <li><Link to="/marketplace" className="text-white/80 hover:text-accent transition-colors">{t("footer_marketplace")}</Link></li>
              <li><Link to="/privacy-policy" className="text-white/80 hover:text-accent transition-colors">{t("footer_privacy")}</Link></li>
            </ul>
          </div>

          {/* Resources - Alphabetically Organized */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer_resources")}</h4>
            <ul className="space-y-2 text-sm footer-links">
              <li><Link to="/blog" className="text-white/80 hover:text-accent transition-colors">Blog & Insights</Link></li>
              <li><a 
                href="https://open.spotify.com/show/7oKIRbsUqrDwiH47E5VZvf?si=qhIVTrJLSSKf3jChj0POyA&nd=1&flow_ctx=3b79f64c-906a-4fa4-b0b7-6e45d375433b%3A1697319493" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-accent transition-colors flex items-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                Conservation Voices
              </a></li>
              <li><Link to="/impact-ledger" className="text-white/80 hover:text-accent transition-colors">Impact Tracker</Link></li>
              <li><Link to="/partner-with-us" className="text-white/80 hover:text-accent transition-colors">Partner With Us</Link></li>
              <li><a href="mailto:support@natuasili.com" className="text-white/80 hover:text-accent transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer_contact")}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent" />
                <span className="text-white/80">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-white/80">hello@natuasili.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-white/80">+254 700 123 456</span>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button variant="ghost" size="sm" className="p-2 text-white hover:text-accent" asChild>
                  <a href="https://instagram.com/natuasili" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-white hover:text-accent" asChild>
                  <a href="https://linkedin.com/company/natuasili" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="font-semibold mb-4">{t("footer_we_accept")}</h4>
            <div className="flex items-center justify-center gap-6">
              <img src={visaLogo} alt="Visa" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src={mastercardLogo} alt="Mastercard" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src={mpesaLogo} alt="M-Pesa" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className="text-sm text-white/60 text-center">
            © 2024 <span translate="no">NatuAsili</span>. {t("footer_copyright").replace(/^© \d{4} NatuAsili\. /, "")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;