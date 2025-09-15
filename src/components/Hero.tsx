import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TreePine, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  overlay?: boolean;
  compact?: boolean;
  showStats?: boolean;
  children?: React.ReactNode;
}
const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage = "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png",
  overlay = true,
  compact = false,
  showStats = true,
  children
}) => {
  const {
    formatPrice
  } = useCurrency();
  const {
    t
  } = useI18n();
  const {
    totalConservationFunding,
    totalExperiences,
    totalTravelers,
    loading
  } = useImpactMetrics();
  const heroTitle = title || t("hero_title");
  const heroSubtitle = subtitle || t("hero_sub");
  return <section className={`hero-full hero ${compact ? 'data-hero-compact' : ''}`} style={{
    backgroundImage: `url(${backgroundImage})`
  }} data-hero={compact ? "compact" : undefined}>
      {overlay && <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent"></div>}
      
      <div className="hero-inner relative z-10">
        {children ? children : <div className="max-w-4xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {heroTitle}
            </h1>
            
            <p className="text-lg lg:text-2xl mb-8 lg:mb-12 text-white/90 leading-relaxed md:text-base">
              {heroSubtitle}
            </p>

              {showStats && <div className="flex flex-wrap gap-6 lg:gap-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-wildlife rounded-full flex items-center justify-center">
                      <TreePine className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold">
                        {loading ? "..." : `${totalExperiences}+`}
                      </div>
                      <div className="text-xs lg:text-sm text-white/80">{t("hero_stat_conservation")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-livelihoods rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold">
                        {loading ? "..." : `${totalTravelers}+`}
                      </div>
                      <div className="text-xs lg:text-sm text-white/80">{t("hero_stat_travelers")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-education rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-bold whitespace-nowrap price">
                        {loading ? "..." : formatPrice(totalConservationFunding)}
                      </div>
                      <div className="text-xs lg:text-sm text-white/80">{t("hero_stat_impact")}</div>
                    </div>
                  </div>
                </div>}
          </div>}
      </div>
    </section>;
};
export default Hero;