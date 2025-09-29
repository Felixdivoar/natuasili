import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EXPERIENCES } from "@/data/partners";
import { useCurrency } from "@/contexts/CurrencyContext";
import BookNowButton from "@/components/BookNowButton";
import { usePartners } from "@/hooks/usePartners";
const samburuDestination = "/lovable-uploads/01b8fcc6-ad62-462a-aad8-c45697827e2e.png";
const SamburuDestination = () => {
  const {
    formatPrice
  } = useCurrency();
  const { partners: samburuPartners, loading: partnersLoading } = usePartners('samburu');
  
  const samburuExperiences = EXPERIENCES.filter(experience => 
    experience.destination === 'northern-kenya'
  );
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Modern & Responsive */}
      <section className="relative h-[70vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] w-full overflow-hidden">
        <img 
          src={samburuDestination} 
          alt="Samburu Ecosystem" 
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Samburu Ecosystem
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Community conservancies protecting unique northern Kenya wildlife and supporting traditional pastoralist communities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                <Link to="/listings?destination=samburu">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/80 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all" asChild>
                <Link to="/impact-ledger">
                  View Impact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section - Modern Stats */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">{samburuPartners.length}</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Conservation Partners</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/10">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2">{samburuExperiences.length}</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Active Projects</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/10">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mb-2">8,500</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Hectares Protected</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">18</div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">Communities Involved</div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">About Samburu</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The Samburu ecosystem represents one of Kenya's most unique and biodiverse regions, home to species found nowhere else in the world. The iconic "Samburu Special Five" - Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk - thrive in this arid landscape alongside the "Big Five."
              </p>
              
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Community conservancies have become the backbone of conservation in this region, with local Samburu communities leading efforts to protect wildlife while maintaining their traditional pastoralist lifestyle. These conservancies cover vast areas outside the national reserve, creating crucial wildlife corridors and breeding grounds.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold mb-8 text-center">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-lg mb-3 text-primary">Wildlife Research</h4>
                  <p className="text-muted-foreground leading-relaxed">Ongoing studies of elephant behavior and migration patterns provide crucial data for conservation planning.</p>
                </div>
                <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-lg mb-3 text-primary">Community Conservancies</h4>
                  <p className="text-muted-foreground leading-relaxed">Local communities receive direct benefits from tourism while protecting critical wildlife habitat.</p>
                </div>
                <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-lg mb-3 text-primary">Cultural Tourism</h4>
                  <p className="text-muted-foreground leading-relaxed">Authentic cultural experiences help preserve Samburu traditions while generating community income.</p>
                </div>
                <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-lg mb-3 text-primary">Anti-Poaching</h4>
                  <p className="text-muted-foreground leading-relaxed">Community rangers patrol vast areas, providing real-time intelligence on wildlife movements and threats.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners - Modern Design */}
      {samburuPartners.length > 0 && (
        <section className="py-16 lg:py-20 bg-gradient-to-br from-muted/20 to-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Conservation Partners in Samburu
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Meet the organizations working tirelessly to protect Samburu's unique ecosystem and support local communities.
              </p>
            </div>

            {partnersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[16/10] bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {samburuPartners.map(partner => (
                  <Card key={partner.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={partner.logo_image_url || '/img/ph1.jpg'} 
                        alt={partner.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = '/img/ph1.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          Partner
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{partner.name}</CardTitle>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{partner.location_text || 'Samburu'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                        {partner.short_bio || partner.tagline || 'Conservation partner dedicated to protecting Samburu\'s unique ecosystem and supporting local communities.'}
                      </p>
                      <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                        <Link to={`/partner/${partner.slug}`}>
                          View Partner
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
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Featured Samburu Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in authentic conservation experiences while supporting local communities and wildlife protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samburuExperiences.slice(0, 6).map(experience => (
              <Card key={experience.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card overflow-hidden">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {experience.images[0] && (
                    <img 
                      src={experience.images[0]} 
                      alt={experience.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      {formatPrice(experience.priceKESAdult)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {experience.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {experience.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">8 max</span>
                    </div>
                    <BookNowButton 
                      href={`/experience/${experience.slug}`}
                      label="Book Now"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
              <Link to="/listings?destination=samburu">
                View All Samburu Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default SamburuDestination;