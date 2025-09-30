import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EXPERIENCES } from "@/data/partners";
import { useCurrency } from "@/contexts/CurrencyContext";
import BookNowButton from "@/components/BookNowButton";

const masaiMaraDestination = "/lovable-uploads/e6151cde-ba00-40f3-9644-e9e41db45d3c.png";

const MasaiMaraDestination = () => {
  const { formatPrice } = useCurrency();
  
  const maraExperiences = EXPERIENCES.filter(experience => 
    experience.destination === 'masai-mara'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Redesigned */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={masaiMaraDestination}
            alt="Maasai Mara"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        </div>
        
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-16 lg:pb-24">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
                Maasai Mara
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                Witness the Great Migration and experience the world's most renowned wildlife spectacle
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-white text-foreground hover:bg-white/90">
                  <Link to="/browse?destination=masai-mara">Explore Experiences</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-foreground mb-2">{maraExperiences.length}</div>
                <div className="text-sm text-muted-foreground">Experiences</div>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-foreground mb-2">1,500</div>
                <div className="text-sm text-muted-foreground">Square Km</div>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-foreground mb-2">95+</div>
                <div className="text-sm text-muted-foreground">Species</div>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-foreground mb-2">1.3M</div>
                <div className="text-sm text-muted-foreground">Annual Migration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Focus */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Conservation Priorities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Protecting one of the world's most important wildlife ecosystems
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TreePine className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Great Migration Protection</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Safeguarding the annual wildebeest migration and its critical crossing points.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Anti-Poaching Efforts</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  24/7 ranger patrols and wildlife monitoring to protect big cats and elephants.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Community Conservation</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Supporting Maasai communities in sustainable land use and wildlife coexistence.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Research & Monitoring</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Scientific research on predator-prey dynamics and ecosystem health monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover unique conservation experiences in the Maasai Mara
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {maraExperiences.slice(0, 6).map((experience) => (
              <Card key={experience.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img
                    src={experience.images[0]}
                    alt={experience.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  {experience.themes && experience.themes[0] && (
                    <Badge className="mb-3">{experience.themes[0]}</Badge>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {experience.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    Maasai Mara
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">From</div>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(experience.priceKESAdult)}
                      </div>
                    </div>
                    <Button asChild>
                      <Link to={`/experience/${experience.slug}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild variant="outline">
              <Link to="/browse?destination=masai-mara">View All Experiences</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MasaiMaraDestination;
