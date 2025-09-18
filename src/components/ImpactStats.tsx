import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users2, BookOpen, Sparkles, TrendingUp, MapPin } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { DESTINATIONS_INFO } from "@/data/destinationData";

const ImpactStats = () => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  const { totalConservationFunding, totalExperiences, totalPartners, totalTravelers, transparencyRate, loading } = useImpactMetrics();
  
  // Get realtime destinations count
  const destinationsCount = Object.keys(DESTINATIONS_INFO).length;
  
  const stats = [
    {
      icon: Leaf,
      value: "45,000", // Keep static for now as it represents hectares protected
      label: t("stat_hectares"),
      color: "bg-habitat",
      description: t("stat_hectares_desc")
    },
    {
      icon: Users2,
      value: "0", // Placeholder for communities supported
      label: t("stat_communities"),
      color: "bg-livelihoods",
      description: t("stat_communities_desc")
    },
    {
      icon: BookOpen,
      value: "0", // Placeholder for students educated
      label: t("stat_students"),
      color: "bg-education",
      description: t("stat_education_desc")
    },
    {
      icon: Sparkles,
      value: "0", // Placeholder for species monitored
      label: t("stat_species"),
      color: "bg-wildlife",
      description: t("stat_species_desc")
    },
    {
      icon: TrendingUp,
      value: loading ? formatPrice(0) : formatPrice(totalConservationFunding), // Real data: conservation funding
      label: t("stat_funds"),
      color: "bg-accent",
      description: t("stat_funds_desc")
    },
    {
      icon: MapPin,
      value: destinationsCount.toString(), // Real data: count of destinations/counties
      label: t("stat_counties"),
      color: "bg-primary",
      description: t("stat_counties_desc")
    }
  ];
  return <section id="impact" className="bg-background py-[20px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("impact_title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("impact_subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default ImpactStats;