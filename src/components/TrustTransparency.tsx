import { Shield, DollarSign, BarChart3, Heart } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const TrustTransparency = () => {
  const { t } = useI18n();

  const trustPoints = [
    {
      icon: Shield,
      title: t("Verified Partners", "Verified Partners"),
      description: t("All conservation partners undergo rigorous verification for credibility and impact", "All conservation partners undergo rigorous verification for credibility and impact")
    },
    {
      icon: DollarSign,
      title: t("90/10 Split", "90/10 Split"),
      description: t("90% of your booking goes directly to conservation work, 10% covers platform operations", "90% of your booking goes directly to conservation work, 10% covers platform operations")
    },
    {
      icon: BarChart3,
      title: t("Full Transparency", "Full Transparency"),
      description: t("Track exactly how your contributions are used through our Impact Ledger", "Track exactly how your contributions are used through our Impact Ledger")
    },
    {
      icon: Heart,
      title: t("Real Impact", "Real Impact"),
      description: t("Every booking funds ranger patrols, habitat restoration, and community programs", "Every booking funds ranger patrols, habitat restoration, and community programs")
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("Your booking funds conservation", "Your booking funds conservation")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("We believe in complete transparency. See exactly how your travel creates lasting conservation impact across Kenya.", "We believe in complete transparency. See exactly how your travel creates lasting conservation impact across Kenya.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <point.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{point.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        {/* 90/10 Split Visualization */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-background rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {t("Where Your Money Goes", "Where Your Money Goes")}
            </h3>
            <div className="flex items-center mb-4">
              <div className="flex-1 h-8 bg-primary rounded-l-lg flex items-center justify-center text-white text-sm font-medium">
                90% {t("Conservation", "Conservation")}
              </div>
              <div className="w-20 h-8 bg-muted rounded-r-lg flex items-center justify-center text-foreground text-xs font-medium">
                10% {t("Platform", "Platform")}
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t("Example: KES 10,000 booking → KES 9,000 to conservation work, KES 1,000 to platform & operations", "Example: KES 10,000 booking → KES 9,000 to conservation work, KES 1,000 to platform & operations")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustTransparency;