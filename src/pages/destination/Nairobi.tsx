import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EXPERIENCES } from "@/data/partners";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useHtmlLang } from "@/hooks/useHtmlLang";
import T from "@/i18n/T";
import DynamicTranslated from "@/i18n/DynamicTranslated";
import nairobiDestination from "@/assets/destinations/nairobi-destination.jpg";
import { usePartners } from "@/hooks/usePartners";
const NairobiDestination = () => {
  const {
    formatPrice
  } = useCurrency();
  const {
    t
  } = useI18n();
  usePageTitle("title_destinations");
  useHtmlLang();

  const { partners: nairobiPartners, loading: partnersLoading } = usePartners('nairobi');
  const nairobiExperiences = EXPERIENCES.filter(experience => experience.destination === 'nairobi');
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Mobile-First & Modern */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] w-full bg-gray-900">
        <img 
          src={nairobiDestination} 
          alt={t("dest_nairobi_title")} 
          className="w-full h-full object-cover" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              <T k="dest_nairobi_title" />
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              <T k="dest_nairobi_subtitle" />
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 transition-all duration-300">
                <Link to="/listings?destination=nairobi">
                  <T k="dest_explore_experiences" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/80 text-white bg-transparent hover:bg-white/10 transition-all duration-300" asChild>
                <Link to="/impact-ledger">
                  <T k="dest_view_urban_impact" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section - Modern Design */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
              <div className="text-center p-4 md:p-6 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-conservation mb-2">{nairobiPartners.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground"><T k="dest_urban_partners" /></div>
              </div>
              <div className="text-center p-4 md:p-6 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-conservation mb-2">12</div>
                <div className="text-xs md:text-sm text-muted-foreground"><T k="dest_active_projects" /></div>
              </div>
              <div className="text-center p-4 md:p-6 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-conservation mb-2">12,000</div>
                <div className="text-xs md:text-sm text-muted-foreground"><T k="dest_hectares_protected" /></div>
              </div>
              <div className="text-center p-4 md:p-6 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-conservation mb-2">25</div>
                <div className="text-xs md:text-sm text-muted-foreground"><T k="dest_communities_involved" /></div>
              </div>
            </div>

            {/* About Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center"><T k="dest_about_nairobi" /></h2>
              <div className="space-y-6 text-center md:text-left">
                <DynamicTranslated 
                  text="Nairobi is unique as one of the world's only capital cities with a national park within its boundaries. The Nairobi Conservation Area encompasses not just the famous national park, but also critical urban forests like Karura, community conservancies, and green corridors that connect fragmented habitats." 
                  className="text-muted-foreground text-base md:text-lg leading-relaxed" 
                />
                
                <DynamicTranslated 
                  text="Urban conservation in Nairobi faces unique challenges and opportunities. The proximity of wildlife to over 4 million residents creates both human-wildlife conflict and unprecedented opportunities for conservation education and community engagement. Initiatives here serve as models for urban conservation across Africa." 
                  className="text-muted-foreground text-base md:text-lg leading-relaxed" 
                />
              </div>

              {/* Conservation Highlights */}
              <div className="mt-10 md:mt-12">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-center"><T k="dest_conservation_highlights" /></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300">
                    <h4 className="font-semibold mb-3 text-foreground"><T k="dest_urban_wildlife_corridors" /></h4>
                    <DynamicTranslated text="Creating safe passages for wildlife movement between protected areas and reducing human-wildlife conflict." className="text-sm md:text-base text-muted-foreground leading-relaxed" />
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300">
                    <h4 className="font-semibold mb-3 text-foreground"><T k="dest_forest_restoration" /></h4>
                    <DynamicTranslated text="Restoration of degraded urban forests and establishment of new green spaces for biodiversity and carbon sequestration." className="text-sm md:text-base text-muted-foreground leading-relaxed" />
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300">
                    <h4 className="font-semibold mb-3 text-foreground"><T k="dest_environmental_education" /></h4>
                    <DynamicTranslated text="Engaging urban communities and schools in conservation through hands-on environmental education programs." className="text-sm md:text-base text-muted-foreground leading-relaxed" />
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300">
                    <h4 className="font-semibold mb-3 text-foreground"><T k="dest_research_monitoring" /></h4>
                    <DynamicTranslated text="Long-term research on urban ecology and wildlife behavior in human-dominated landscapes." className="text-sm md:text-base text-muted-foreground leading-relaxed" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners - Modern Design */}
      {nairobiPartners.length > 0 && (
        <section className="bg-muted/20 py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                <T k="dest_urban_conservation_partners" />
              </h2>
              <DynamicTranslated text="Meet the organizations pioneering urban conservation in Kenya's capital city." className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto" />
            </div>

            {partnersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse overflow-hidden">
                    <div className="aspect-[4/3] bg-muted" />
                    <CardHeader className="p-4 md:p-6">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </div>
                      <div className="h-9 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
                {nairobiPartners.map(partner => (
                  <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={partner.logo_image_url || '/img/ph1.jpg'} 
                        alt={partner.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = '/img/ph1.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-foreground border-0">
                          Partner
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-lg md:text-xl leading-tight">{partner.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{partner.location_text || 'Nairobi'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <DynamicTranslated 
                        text={partner.short_bio || partner.tagline || 'Conservation partner pioneering urban conservation in Kenya\'s capital city.'} 
                        className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3 leading-relaxed" 
                      />
                      <Button size="sm" asChild className="w-full">
                        <Link to={`/partner/${partner.slug}`}>
                          <T k="dest_view_partner" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Experiences - Modern Design */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              <T k="dest_featured_experiences" />
            </h2>
            <DynamicTranslated text="Discover unique urban conservation experiences in Kenya's vibrant capital city." className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {nairobiExperiences.slice(0, 6).map(experience => (
              <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {experience.images[0] && (
                    <img 
                      src={experience.images[0]} 
                      alt={experience.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 text-foreground border-0">
                      {formatPrice(experience.priceKESAdult)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-semibold text-lg md:text-xl mb-3 line-clamp-2 leading-tight">
                    <DynamicTranslated text={experience.title} />
                  </h3>
                  <DynamicTranslated 
                    text={experience.description} 
                    className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3 leading-relaxed" 
                  />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>8 <T k="max_guests" /></span>
                    </div>
                    <Button size="sm" asChild className="hover:bg-primary/90 transition-colors">
                      <Link to={`/listings/${experience.slug}`}>
                        <T k="book_now_button" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Button size="lg" variant="outline" asChild className="hover:bg-muted/50 transition-colors">
              <Link to="/listings?destination=nairobi">
                <T k="dest_view_all_experiences" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default NairobiDestination;