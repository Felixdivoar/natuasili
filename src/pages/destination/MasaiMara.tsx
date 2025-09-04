import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

import masaiMaraDestination from "@/assets/destinations/masai-mara-destination.jpg";

const MasaiMaraDestination = () => {
  const { formatPrice } = useCurrency();
  // Get Maasai Mara-related partners and experiences
  const maraPartners = mockProjects.filter(project => 
    project.location_text.toLowerCase().includes('mara') || 
    project.name.toLowerCase().includes('mara') ||
    project.name.toLowerCase().includes('maasai')
  );

  const maraExperiences = mockExperiences.filter(experience => 
    experience.location_text.toLowerCase().includes('mara') ||
    experience.location_text.toLowerCase().includes('maasai')
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <img
          src={masaiMaraDestination}
          alt="Maasai Mara Ecosystem"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Maasai Mara Ecosystem
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Protecting the world-famous migration route and supporting Maasai communities through conservation tourism.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-conservation hover:bg-conservation/90">
                <Link to="/listings?destination=masai-mara">
                  Explore experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link to="/impact-ledger">
                  View conservation impact
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
                <div className="text-3xl font-bold text-conservation mb-2">10</div>
                <div className="text-sm text-muted-foreground">Conservation Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">15</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">15,000</div>
                <div className="text-sm text-muted-foreground">Hectares Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">30</div>
                <div className="text-sm text-muted-foreground">Communities Involved</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Maasai Mara</h2>
              <p className="text-muted-foreground mb-6">
                The Maasai Mara is perhaps Kenya's most famous conservation area, home to the spectacular Great Migration where over two million wildebeest, zebra, and gazelle traverse the landscape annually. This UNESCO World Heritage site represents one of Africa's last great wildlife strongholds.
              </p>
              
              <p className="text-muted-foreground mb-6">
                The ecosystem extends far beyond the national reserve boundaries, encompassing community conservancies that are owned and managed by local Maasai communities. These conservancies play a crucial role in wildlife conservation while providing sustainable livelihoods for traditional pastoralist communities.
              </p>

              <h3 className="text-xl font-semibold mb-4">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Great Migration</h4>
                  <p className="text-sm text-muted-foreground">Supporting the annual migration of over 2 million animals across the Mara-Serengeti ecosystem.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Community Conservancies</h4>
                  <p className="text-sm text-muted-foreground">Over 300,000 acres of community-owned land dedicated to wildlife conservation.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Anti-Poaching</h4>
                  <p className="text-sm text-muted-foreground">24/7 ranger patrols protecting rhinos, elephants, and other endangered species.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Research & Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Scientific research on predator-prey dynamics and ecosystem health monitoring.</p>
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
              Conservation Partners in Maasai Mara
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the organizations working to protect one of the world's most important wildlife ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maraPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  <img
                    src={partner.hero_image}
                    alt={partner.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-conservation/90 text-white">
                      {partner.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {partner.location_text}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {partner.bio}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild className="flex-1">
                      <Link to={`/partners/${partner.slug}`}>
                        View Partner
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/listings?partner=${partner.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Experiences
                      </Link>
                    </Button>
                  </div>
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
              Featured Maasai Mara Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the wonder of the Great Migration while supporting critical conservation efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maraExperiences.slice(0, 6).map((experience) => (
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
                      {formatPrice(experience.base_price)}
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
                      {experience.capacity} max
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/experience/${experience.slug}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/listings?destination=masai-mara">
                View all Maasai Mara experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MasaiMaraDestination;