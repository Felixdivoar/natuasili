import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { DESTINATIONS_INFO } from "@/data/destinationData";

// Modern icon components with black and white design
const ModernLeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2c5.5 0 10 4.5 10 10 0 3-1.3 5.7-3.4 7.6L12 22l-6.6-2.4C3.3 17.7 2 15 2 12 2 6.5 6.5 2 12 2z" fill="#000000"/>
    <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="#ffffff"/>
    <path d="M12 8v8M8 12h8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ModernUsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" fill="#000000"/>
    <circle cx="15" cy="7" r="4" fill="#000000"/>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="#ffffff"/>
    <path d="M13 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="#ffffff"/>
  </svg>
);

const ModernBookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#000000" strokeWidth="2"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="#000000"/>
    <path d="M8 7h8M8 11h6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ModernElephantIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 3c4.97 0 9 4.03 9 9 0 2.5-1.02 4.77-2.67 6.42" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 12c0-4.97 4.03-9 9-9" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="14" r="2" fill="#000000"/>
    <circle cx="8" cy="14" r="0.8" fill="#ffffff"/>
    <path d="M16 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#000000"/>
    <path d="M10 17l2 2 2-2" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2" stroke="#000000" strokeWidth="1.5"/>
  </svg>
);

const ModernTrendingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M3 17l6-6 4 4 8-8" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="21" cy="7" r="3" fill="#000000"/>
    <circle cx="21" cy="7" r="1.5" fill="#ffffff"/>
    <path d="M16 12l5-5v5" fill="#000000"/>
  </svg>
);

const ModernMapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#000000"/>
    <circle cx="12" cy="10" r="3" fill="#ffffff"/>
    <circle cx="12" cy="10" r="1" fill="#000000"/>
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
      icon: ModernLeafIcon,
      value: "0", // Placeholder until updated
      label: t("stat_hectares"),
      color: "bg-habitat",
      description: t("stat_hectares_desc")
    },
    {
      icon: ModernUsersIcon,
      value: "0", // Placeholder for communities supported
      label: t("stat_communities"),
      color: "bg-livelihoods",
      description: t("stat_communities_desc")
    },
    {
      icon: ModernBookIcon,
      value: "0", // Placeholder for students educated
      label: t("stat_students"),
      color: "bg-education",
      description: t("stat_education_desc")
    },
    {
      icon: ModernElephantIcon,
      value: "0", // Placeholder for species monitored
      label: t("stat_species"),
      color: "bg-wildlife",
      description: t("stat_species_desc")
    },
    {
      icon: ModernTrendingIcon,
      value: formatPrice(totalConservationFunding || 0), // Real data: conservation funding
      label: t("stat_funds"),
      color: "bg-accent",
      description: t("stat_funds_desc")
    },
    {
      icon: ModernMapIcon,
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
          <p className="text-lg text-black/70 max-w-2xl mx-auto">
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