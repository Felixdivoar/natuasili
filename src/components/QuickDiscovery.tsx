import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/I18nContext";

// Import destination images
import masaiMaraImg from "@/assets/destinations/masai-mara-destination.jpg";
import samburuImg from "@/assets/destinations/samburu-destination.jpg";
import laikipiaiImg from "@/assets/destinations/laikipia-destination.jpg";
import coastImg from "@/assets/destinations/coast-destination.jpg";
import nairobiImg from "@/assets/destinations/nairobi-destination.jpg";

const QuickDiscovery = () => {
  const { t } = useI18n();

  const destinations = [
    { name: t("Maasai Mara", "Maasai Mara"), image: masaiMaraImg, link: "/destinations/masai-mara", price: "from KES 8,500" },
    { name: t("Samburu", "Samburu"), image: samburuImg, link: "/destinations/samburu", price: "from KES 6,200" },
    { name: t("Laikipia", "Laikipia"), image: laikipiaiImg, link: "/destinations/laikipia", price: "from KES 12,000" },
    { name: t("Coast", "Coast"), image: coastImg, link: "/destinations/coast", price: "from KES 4,800" },
    { name: t("Nairobi", "Nairobi"), image: nairobiImg, link: "/destinations/nairobi", price: "from KES 3,500" }
  ];

  const impacts = [
    { name: t("Rhino Conservation", "Rhino Conservation"), icon: "🦏", link: "/search?impact=rhino" },
    { name: t("Elephant Protection", "Elephant Protection"), icon: "🐘", link: "/search?impact=elephant" },
    { name: t("Forest Restoration", "Forest Restoration"), icon: "🌳", link: "/search?impact=forest" },
    { name: t("Marine Protection", "Marine Protection"), icon: "🌊", link: "/search?impact=marine" },
    { name: t("Community Support", "Community Support"), icon: "🏘️", link: "/search?impact=community" },
    { name: t("Wildlife Research", "Wildlife Research"), icon: "🔬", link: "/search?impact=research" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Explore by Destination */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("Explore by Destination", "Explore by Destination")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("Discover conservation experiences across Kenya's most iconic regions", "Discover conservation experiences across Kenya's most iconic regions")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {destinations.map((destination, index) => (
              <Link key={index} to={destination.link} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className="aspect-square relative">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm mb-1">{destination.name}</h3>
                      <p className="text-white/80 text-xs">{destination.price}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Explore by Impact */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("Explore by Impact", "Explore by Impact")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("Choose the conservation cause closest to your heart", "Choose the conservation cause closest to your heart")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {impacts.map((impact, index) => (
              <Link key={index} to={impact.link}>
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="mr-2">{impact.icon}</span>
                  {impact.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickDiscovery;