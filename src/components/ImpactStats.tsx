import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users2, BookOpen, TrendingUp, MapPin } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { DESTINATIONS_INFO } from "@/data/destinationData";

// Simple elephant icon component
const ElephantIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c4.97 0 9 4.03 9 9 0 2.48-1.02 4.73-2.67 6.38l-1.41-1.41A7 7 0 1 0 5 12c0-1.11.26-2.16.72-3.09L4.31 7.5A9 9 0 0 0 3 12c0 4.97 4.03 9 9 9 2.48 0 4.73-1.02 6.38-2.67l1.41 1.41A8.96 8.96 0 0 1 12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9z"/>
    <circle cx="8.5" cy="10.5" r="1.5"/>
    <path d="M16 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
    <path d="M10 16h4c0 1.1-.9 2-2 2s-2-.9-2-2z"/>
  </svg>
);

const ImpactStats = () => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  const { totalConservationFunding, totalExperiences, totalPartners, totalTravelers, transparencyRate, loading } = useImpactMetrics();
  
  // Get realtime destinations count
  const destinationsCount = Object.keys(DESTINATIONS_INFO).length;
  
  const stats = [
    {
      icon: Leaf,
      value: "0", // Placeholder until updated
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
      icon: ElephantIcon,
      value: "0", // Placeholder for species monitored
      label: t("stat_species"),
      color: "bg-wildlife",
      description: t("stat_species_desc")
    },
    {
      icon: TrendingUp,
      value: formatPrice(totalConservationFunding || 0), // Real data: conservation funding
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
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{t("impact_title")}</h2>
          <p className="text-base font-light text-black/70 max-w-2xl mx-auto">
            {t("impact_subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-black mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-black/70">
                  {stat.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default ImpactStats;