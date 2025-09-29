import { Card, CardContent } from "@/components/ui/card";
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
import BookNowButton from "@/components/BookNowButton";

const NairobiDestination = () => {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  usePageTitle("title_destinations");
  useHtmlLang();

  const { partners: nairobiPartners, loading: partnersLoading } = usePartners('nairobi');
  const nairobiExperiences = EXPERIENCES.filter(experience => experience.destination === 'nairobi');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Redesigned */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={nairobiDestination}
            alt={t("dest_nairobi_title")}
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-4">
              <MapPin className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Nairobi, Kenya</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              <T k="dest_nairobi_title" />
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              <T k="dest_nairobi_subtitle" />
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Link to="/listings?destination=nairobi">
                  <T k="dest_explore_experiences" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-foreground backdrop-blur-sm transition-all hover:scale-105" asChild>
                <Link to="/impact-ledger">
                  <T k="dest_view_urban_impact" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section - Redesigned */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">{nairobiPartners.length}</div>
                <div className="text-sm text-muted-foreground"><T k="dest_urban_partners" /></div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">12</div>
                <div className="text-sm text-muted-foreground"><T k="dest_active_projects" /></div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">12,000</div>
                <div className="text-sm text-muted-foreground"><T k="dest_hectares_protected" /></div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <TreePine className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">25</div>
                <div className="text-sm text-muted-foreground"><T k="dest_communities_involved" /></div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  <T k="dest_about_nairobi" />
                </h2>
                <DynamicTranslated 
                  text="Nairobi is unique as one of the world's only capital cities with a national park within its boundaries. The Nairobi Conservation Area encompasses not just the famous national park, but also critical urban forests like Karura, community conservancies, and green corridors that connect fragmented habitats." 
                  className="text-lg text-muted-foreground leading-relaxed" 
                />
              </div>

              {/* Conservation Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground"><T k="dest_urban_wildlife_corridors" /></h4>
                  </div>
                  <DynamicTranslated text="Creating safe passages for wildlife movement between protected areas and reducing human-wildlife conflict." className="text-muted-foreground leading-relaxed" />
                </div>
                
                <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TreePine className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground"><T k="dest_forest_restoration" /></h4>
                  </div>
                  <DynamicTranslated text="Restoration of degraded urban forests and establishment of new green spaces for biodiversity and carbon sequestration." className="text-muted-foreground leading-relaxed" />
                </div>
                
                <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground"><T k="dest_environmental_education" /></h4>
                  </div>
                  <DynamicTranslated text="Engaging urban communities and schools in conservation through hands-on environmental education programs." className="text-muted-foreground leading-relaxed" />
                </div>
                
                <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground"><T k="dest_research_monitoring" /></h4>
                  </div>
                  <DynamicTranslated text="Long-term research on urban ecology and wildlife behavior in human-dominated landscapes." className="text-muted-foreground leading-relaxed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners - Redesigned */}
      {nairobiPartners.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Partners</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                <T k="dest_urban_conservation_partners" />
              </h2>
              <DynamicTranslated text="Meet the organizations pioneering urban conservation in Kenya's capital city." className="text-lg text-muted-foreground max-w-2xl mx-auto" />
            </div>

            {partnersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse overflow-hidden">
                    <div className="aspect-[4/3] bg-muted" />
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                      <div className="h-4 bg-muted rounded mb-4" />
                      <div className="h-9 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nairobiPartners.map((partner) => (
                  <Card key={partner.id} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                      <img
                        src={partner.logo_image_url || '/img/ph1.jpg'}
                        alt={partner.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = '/img/ph1.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground border-0 shadow-lg">
                          Partner
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {partner.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4 mr-1 text-primary" />
                          {partner.location_text || 'Nairobi'}
                        </div>
                      </div>
                      <DynamicTranslated 
                        text={partner.short_bio || partner.tagline || 'Conservation partner pioneering urban conservation in Kenya\'s capital city.'} 
                        className="text-sm text-muted-foreground line-clamp-3 leading-relaxed" 
                      />
                      <Button size="sm" asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
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

      {/* Featured Experiences - Redesigned */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-2">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Experiences</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              <T k="dest_featured_experiences" />
            </h2>
            <DynamicTranslated text="Discover unique urban conservation experiences in Kenya's vibrant capital city." className="text-lg text-muted-foreground max-w-2xl mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nairobiExperiences.slice(0, 6).map((experience) => (
              <Card key={experience.id} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  {experience.images[0] && (
                    <img
                      src={experience.images[0]}
                      alt={experience.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-primary text-primary-foreground border-0 shadow-lg text-base px-3 py-1">
                      {formatPrice(experience.priceKESAdult)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    <DynamicTranslated text={experience.title} />
                  </h3>
                  <DynamicTranslated 
                    text={experience.description} 
                    className="text-sm text-muted-foreground line-clamp-3 leading-relaxed" 
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>8 <T k="max_guests" /></span>
                    </div>
                    <BookNowButton 
                      href={`/listings/${experience.slug}`}
                      label={t("book_now_button")}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="group">
              <Link to="/listings?destination=nairobi" className="flex items-center gap-2">
                <T k="dest_view_all_experiences" />
                <span className="group-hover:translate-x-1 transition-transform">→</span>
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
