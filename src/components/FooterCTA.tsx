import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const FooterCTA = () => {
  const { t } = useI18n();

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t("Ready to make an impact?", "Ready to make an impact?")}
        </h2>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
          {t("Join thousands of travelers funding conservation across Kenya. Every booking makes a difference.", "Join thousands of travelers funding conservation across Kenya. Every booking makes a difference.")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/search">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-8 py-3">
              {t("Explore Experiences", "Explore Experiences")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/partner-entry">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/70 text-white hover:bg-white hover:text-foreground font-semibold px-8 py-3"
            >
              {t("Partner With Us", "Partner With Us")}
            </Button>
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="email"
                  placeholder={t("Your email", "Your email")}
                  className="w-full pl-10 pr-4 py-2 rounded bg-white/90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-foreground">
                {t("Subscribe", "Subscribe")}
              </Button>
            </div>
            <p className="text-white/70 text-xs mt-2">
              {t("Get impact stories and exclusive experiences", "Get impact stories and exclusive experiences")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;