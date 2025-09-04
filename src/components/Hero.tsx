import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TreePine, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";

const heroImage = "/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png";

const Hero = () => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  
  return (
    <div className="hero-inner relative z-10">
      <div className="max-w-2xl text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          {t("hero_title")}
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
          {t("hero_sub")}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-wildlife rounded-full flex items-center justify-center">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">150+</div>
              <div className="text-sm text-white/80">{t("hero_stat_conservation")}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-livelihoods rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm text-white/80">{t("hero_stat_travelers")}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-education rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold whitespace-nowrap price">{formatPrice(580000)}</div>
              <div className="text-sm text-white/80">{t("hero_stat_impact")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;