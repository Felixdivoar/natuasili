import { Search, Calendar, MapPin, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";

const HowItWorks = () => {
  const { t } = useI18n();

  const steps = [
    {
      icon: Search,
      title: t("Choose Experience", "Choose Experience"),
      description: t("Browse authentic conservation experiences across Kenya, from wildlife tracking to community projects", "Browse authentic conservation experiences across Kenya, from wildlife tracking to community projects")
    },
    {
      icon: Calendar,
      title: t("Book", "Book"),
      description: t("Secure your spot with our simple booking process. 90% goes directly to conservation work", "Secure your spot with our simple booking process. 90% goes directly to conservation work")
    },
    {
      icon: MapPin,
      title: t("Experience", "Experience"),
      description: t("Join verified conservation partners for an authentic experience that makes a real difference", "Join verified conservation partners for an authentic experience that makes a real difference")
    },
    {
      icon: BarChart3,
      title: t("Track Your Impact", "Track Your Impact"),
      description: t("See exactly how your contribution is used through our transparent Impact Ledger", "See exactly how your contribution is used through our transparent Impact Ledger")
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("How It Works", "How It Works")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("Four simple steps to create meaningful conservation impact through authentic travel experiences", "Four simple steps to create meaningful conservation impact through authentic travel experiences")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow relative">
              <CardContent className="p-6">
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;