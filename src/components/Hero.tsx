import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TreePine, Award, Search, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
const heroImage = "/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";

const Hero = () => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="hero-full hero-section relative min-h-[85vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/30 overlay"></div>
      </div>

      {/* Content */}
      <div className="hero-inner relative">
        <div className="max-w-3xl text-white">
          {/* Big Value Prop */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t("Travel that funds", "Travel that funds")}
            <span className="text-accent block">{t("conservation", "conservation")}</span>
          </h1>
          
          {/* Subhead with 90/10 split */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/95 leading-relaxed font-medium">
            {t("90% to partner initiatives, 10% platform & ops.", "90% to partner initiatives, 10% platform & ops.")}
          </p>

          <p className="text-lg md:text-xl mb-10 text-white/85 leading-relaxed max-w-2xl">
            {t("Connect with Kenya's conservation heroes. Join authentic experiences that protect wildlife, empower communities, and create lasting impact.", "Connect with Kenya's conservation heroes. Join authentic experiences that protect wildlife, empower communities, and create lasting impact.")}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/search">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-8 py-3 text-lg">
                {t("Explore Experiences", "Explore Experiences")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/partners">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/70 text-white hover:bg-white hover:text-foreground font-semibold px-8 py-3 text-lg"
              >
                {t("See Partners", "See Partners")}
              </Button>
            </Link>
          </div>

          {/* Mini Search Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-12 border border-white/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Where do you want to make an impact?", "Where do you want to make an impact?")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-0 bg-white/90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-foreground px-6">
                <Search className="w-4 h-4 mr-2" />
                {t("Search", "Search")}
              </Button>
            </form>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-wrap gap-6 lg:gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold">150+</div>
                <div className="text-sm text-white/80">{t("Conservation Projects", "Conservation Projects")}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold">2,500+</div>
                <div className="text-sm text-white/80">{t("Travelers Connected", "Travelers Connected")}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold whitespace-nowrap price">{formatPrice(580000)}</div>
                <div className="text-sm text-white/80">{t("Impact Generated", "Impact Generated")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;