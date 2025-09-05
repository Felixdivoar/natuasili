import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PARTNERS, EXPERIENCES } from "@/data/partners";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useHtmlLang } from "@/hooks/useHtmlLang";
import T from "@/i18n/T";
import DynamicTranslated from "@/i18n/DynamicTranslated";

import nairobiDestination from "@/assets/destinations/nairobi-destination.jpg";

const NairobiDestination = () => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  
  usePageTitle("title_destinations");
  useHtmlLang();
  
  // Get Nairobi-related partners and experiences
  const nairobiPartners = PARTNERS.filter(partner => 
    partner.location.toLowerCase().includes('nairobi')
  );

  const nairobiExperiences = EXPERIENCES.filter(experience => 
    experience.destination === 'nairobi'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <img
          src={nairobiDestination}
          alt={t("dest_nairobi_title")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <T k="dest_nairobi_title" />
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              <T k="dest_nairobi_subtitle" />
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-conservation hover:bg-conservation/90">
                <Link to="/listings?destination=nairobi">
                  <T k="dest_explore_experiences" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-black bg-white hover:bg-white hover:text-black active:text-black focus:text-black" asChild>
                <Link to="/impact-ledger">
                  <T k="dest_view_urban_impact" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">8</div>
                <div className="text-sm text-muted-foreground"><T k="dest_urban_partners" /></div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">12</div>
                <div className="text-sm text-muted-foreground"><T k="dest_active_projects" /></div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">12,000</div>
                <div className="text-sm text-muted-foreground"><T k="dest_hectares_protected" /></div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">25</div>
                <div className="text-sm text-muted-foreground"><T k="dest_communities_involved" /></div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4"><T k="dest_about_nairobi" /></h2>
              <DynamicTranslated 
                text="Nairobi is unique as one of the world's only capital cities with a national park within its boundaries. The Nairobi Conservation Area encompasses not just the famous national park, but also critical urban forests like Karura, community conservancies, and green corridors that connect fragmented habitats."
                className="text-muted-foreground mb-6"
              />
              
              <DynamicTranslated 
                text="Urban conservation in Nairobi faces unique challenges and opportunities. The proximity of wildlife to over 4 million residents creates both human-wildlife conflict and unprecedented opportunities for conservation education and community engagement. Initiatives here serve as models for urban conservation across Africa."
                className="text-muted-foreground mb-6"
              />

              <h3 className="text-xl font-semibold mb-4"><T k="dest_conservation_highlights" /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2"><T k="dest_urban_wildlife_corridors" /></h4>
                  <DynamicTranslated 
                    text="Creating safe passages for wildlife movement between protected areas and reducing human-wildlife conflict."
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2"><T k="dest_forest_restoration" /></h4>
                  <DynamicTranslated 
                    text="Restoration of degraded urban forests and establishment of new green spaces for biodiversity and carbon sequestration."
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2"><T k="dest_environmental_education" /></h4>
                  <DynamicTranslated 
                    text="Engaging urban communities and schools in conservation through hands-on environmental education programs."
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2"><T k="dest_research_monitoring" /></h4>
                  <DynamicTranslated 
                    text="Long-term research on urban ecology and wildlife behavior in human-dominated landscapes."
                    className="text-sm text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              <T k="dest_urban_conservation_partners" />
            </h2>
            <DynamicTranslated 
              text="Meet the organizations pioneering urban conservation in Kenya's capital city."
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nairobiPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-conservation/90 text-white">
                      {partner.themes[0]}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {partner.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <DynamicTranslated 
                    text={partner.description}
                    className="text-sm text-muted-foreground mb-4 line-clamp-3"
                  />
                  <Button size="sm" asChild className="w-full">
                    <Link to={`/partners/${partner.slug}`}>
                      <T k="dest_view_partner" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              <T k="dest_featured_experiences" />
            </h2>
            <DynamicTranslated 
              text="Discover unique urban conservation experiences in Kenya's vibrant capital city."
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nairobiExperiences.slice(0, 6).map((experience) => (
              <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  {experience.images[0] && (
                    <img
                      src={experience.images[0]}
                      alt={experience.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 text-foreground">
                      {formatPrice(experience.priceKESAdult)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    <DynamicTranslated text={experience.title} />
                  </h3>
                  <DynamicTranslated 
                    text={experience.description}
                    className="text-sm text-muted-foreground mb-4 line-clamp-3"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      8 <T k="max_guests" />
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/listings/${experience.slug}`}>
                        <T k="book_now_button" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/listings?destination=nairobi">
                <T k="dest_view_all_experiences" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NairobiDestination;