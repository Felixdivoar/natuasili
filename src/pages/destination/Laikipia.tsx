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

const laikipiaDestination = "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png";

const LaikipiaDestination = () => {
  const { formatPrice } = useCurrency();
  const { partners: laikipiaPartners, loading: partnersLoading } = usePartners('laikipia');
  
  const laikipiaExperiences = EXPERIENCES.filter(experience => 
    experience.destination === 'laikipia'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Redesigned */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={laikipiaDestination}
            alt="Laikipia Plateau"
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
              <span className="text-white text-sm font-medium">Central Highlands, Kenya</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Laikipia Plateau
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              Private and community conservancies protecting wildlife on Kenya's central highlands
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Link to="/listings?destination=laikipia">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-foreground backdrop-blur-sm transition-all hover:scale-105" asChild>
                <Link to="/impact-ledger">
                  View Impact
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
                <div className="text-3xl font-bold text-conservation mb-2">{laikipiaPartners.length}</div>
                <div className="text-sm text-muted-foreground">Conservation Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">{laikipiaExperiences.length}</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">11,000</div>
                <div className="text-sm text-muted-foreground">Hectares Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">20</div>
                <div className="text-sm text-muted-foreground">Communities Involved</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Laikipia Plateau</h2>
              <p className="text-muted-foreground mb-6">
                The Laikipia Plateau spans over 9,500 square kilometers of Kenya's central highlands, representing one of Africa's most successful examples of landscape-scale conservation. This region demonstrates how private conservancies, community lands, and government protected areas can work together to protect wildlife and ecosystems.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Home to the largest population of endangered black rhinos in East Africa and the second-largest elephant population in Kenya, Laikipia shows that conservation and sustainable land use can coexist. The plateau's diverse ecosystems support over 7,000 elephants, alongside lions, wild dogs, and Grevy's zebras.
              </p>

              <h3 className="text-xl font-semibold mb-4">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Private Conservancies</h4>
                  <p className="text-sm text-muted-foreground">Over 50 private conservancies working together as the Laikipia Wildlife Forum to coordinate conservation efforts.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Wildlife Research</h4>
                  <p className="text-sm text-muted-foreground">Leading research on elephant ecology, predator-prey dynamics, and conservation genetics.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Community Partnerships</h4>
                  <p className="text-sm text-muted-foreground">Collaborative relationships between private conservancies and surrounding pastoral communities.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Rhino Sanctuary</h4>
                  <p className="text-sm text-muted-foreground">The largest black rhino sanctuary in East Africa with a growing population of this critically endangered species.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners */}
      {laikipiaPartners.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Laikipia Conservation Partners
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the organizations protecting Kenya's highland ecosystems through innovative conservation partnerships.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {laikipiaPartners.map((partner) => (
                  <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-[16/10] relative">
                      <img
                        src={partner.logo_image_url || '/img/ph1.jpg'}
                        alt={partner.name}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = '/img/ph1.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-foreground text-background">
                          Partner
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {partner.location_text || 'Laikipia'}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {partner.short_bio || partner.tagline || 'Conservation partner protecting Kenya\'s highland ecosystems through innovative partnerships.'}
                      </p>
                      <Button size="sm" asChild className="w-full">
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

      {/* Featured Experiences */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Laikipia Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge conservation on Kenya's most innovative landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laikipiaExperiences.slice(0, 6).map((experience) => (
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
                    {experience.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {experience.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      8 max
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

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/listings?destination=laikipia">
                View All Laikipia Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LaikipiaDestination;