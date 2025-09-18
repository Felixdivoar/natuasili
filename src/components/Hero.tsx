import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TreePine, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import retetiMainImage from "@/assets/reteti-main.jpg";
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
  
  const heroImages = [
    { src: backgroundImage, alt: "Conservation experiences in Kenya" },
    { src: retetiMainImage, alt: "Reteti Elephant Sanctuary experience" }
  ];

  if (children) {
    return (
      <section className={`hero-full hero ${compact ? 'data-hero-compact' : ''}`} 
               style={{ backgroundImage: `url(${backgroundImage})` }} 
               data-hero={compact ? "compact" : undefined}>
        {overlay && <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent"></div>}
        <div className="hero-inner relative z-10">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 lg:py-20 px-4 bg-background ${compact ? 'py-8 lg:py-12' : ''}`}>
      <div className="w-full mx-auto">
        {/* Mobile: Stack image on top, text below */}
        <div className="flex flex-col lg:hidden gap-8">
          {/* Image Carousel - Mobile */}
          <div className="w-full">
            <Card className="overflow-hidden shadow-lg">
              <Carousel className="w-full">
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] w-full">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </Card>
          </div>
          
          {/* Text Content - Mobile */}
          <div className="w-full text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-foreground">
              {heroTitle}
            </h1>
            
            <p className="text-lg mb-8 text-muted-foreground leading-relaxed">
              {heroSubtitle}
            </p>

            {showStats && (
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-wildlife rounded-full flex items-center justify-center">
                    <TreePine className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      {loading ? "..." : `${totalExperiences}+`}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("hero_stat_conservation")}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-livelihoods rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      {loading ? "..." : `${totalTravelers}+`}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("hero_stat_travelers")}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-education rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold whitespace-nowrap price text-foreground">
                      {loading ? "..." : formatPrice(totalConservationFunding)}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("hero_stat_impact")}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop & Tablet: Side by side layout */}
        <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Desktop/Tablet */}
          <div className="lg:col-span-2 xl:col-span-1">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-foreground">
              {heroTitle}
            </h1>
            
            <p className="text-lg xl:text-xl mb-8 lg:mb-12 text-muted-foreground leading-relaxed">
              {heroSubtitle}
            </p>

            {showStats && (
              <div className="flex flex-wrap gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-wildlife rounded-full flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {loading ? "..." : `${totalExperiences}+`}
                    </div>
                    <div className="text-sm text-muted-foreground">{t("hero_stat_conservation")}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-livelihoods rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {loading ? "..." : `${totalTravelers}+`}
                    </div>
                    <div className="text-sm text-muted-foreground">{t("hero_stat_travelers")}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-education rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold whitespace-nowrap price text-foreground">
                      {loading ? "..." : formatPrice(totalConservationFunding)}
                    </div>
                    <div className="text-sm text-muted-foreground">{t("hero_stat_impact")}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Image Carousel - Desktop/Tablet */}
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="overflow-hidden shadow-xl">
              <Carousel className="w-full">
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] w-full">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;