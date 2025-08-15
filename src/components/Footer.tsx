import { Button } from "@/components/ui/button";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import visaLogo from "@/assets/visa-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import mpesaLogo from "@/assets/mpesa-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">NatuAsili</h3>
                <p className="text-xs text-white/70">Conservation Impact Hub</p>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Connecting travelers with authentic conservation experiences 
              across Kenya. Creating impact that matters.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2 text-white hover:text-accent">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-white hover:text-accent">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-white hover:text-accent">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-white hover:text-accent">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#experiences" className="text-white/80 hover:text-accent transition-colors">Experiences</a></li>
              <li><a href="#projects" className="text-white/80 hover:text-accent transition-colors">Conservation Projects</a></li>
              <li><a href="#impact" className="text-white/80 hover:text-accent transition-colors">Impact Stories</a></li>
              <li><a href="#about" className="text-white/80 hover:text-accent transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold mb-4">For Partners</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Become a Partner</a></li>
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Partner Resources</a></li>
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Impact Reporting</a></li>
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
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
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="font-semibold mb-4">We Accept</h4>
            <div className="flex items-center justify-center gap-6">
              <img src={visaLogo} alt="Visa" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src={mastercardLogo} alt="Mastercard" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              <img src={mpesaLogo} alt="M-Pesa" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className="text-sm text-white/60 text-center">
            © 2024 NatuAsili. All rights reserved. Built for conservation impact.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;