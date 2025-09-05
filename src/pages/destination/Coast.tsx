import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

import coastDestination from "@/assets/destinations/coast-destination.jpg";

const CoastDestination = () => {
  const { formatPrice } = useCurrency();
  // Get Coast-related partners and experiences
  const coastPartners = mockProjects.filter(project => 
    project.location_text.toLowerCase().includes('coast') || 
    project.name.toLowerCase().includes('coast') ||
    project.name.toLowerCase().includes('marine') ||
    project.name.toLowerCase().includes('mangrove')
  );

  const coastExperiences = mockExperiences.filter(experience => 
    experience.location_text.toLowerCase().includes('coast') ||
    experience.location_text.toLowerCase().includes('marine') ||
    experience.location_text.toLowerCase().includes('diani') ||
    experience.location_text.toLowerCase().includes('watamu')
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <img
          src={coastDestination}
          alt="Coastal Conservation Zone"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Coastal Conservation Zone
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Marine and coastal ecosystem protection including mangrove restoration and community-based fisheries management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-conservation hover:bg-conservation/90">
                <Link to="/listings?destination=coast">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link to="/impact-ledger">
                  View Marine Impact
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
                <div className="text-3xl font-bold text-conservation mb-2">7</div>
                <div className="text-sm text-muted-foreground">Marine Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">11</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">6,500</div>
                <div className="text-sm text-muted-foreground">Hectares Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">22</div>
                <div className="text-sm text-muted-foreground">Coastal Communities</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Kenya's Coast</h2>
              <p className="text-muted-foreground mb-6">
                Kenya's coastline stretches for over 400 kilometers along the Indian Ocean, encompassing some of the most biodiverse marine ecosystems in the Western Indian Ocean. This region is home to pristine coral reefs, extensive mangrove forests, and critical breeding grounds for marine species.
              </p>
              
              <p className="text-muted-foreground mb-6">
                The coastal conservation zone includes multiple marine protected areas, community conservancies, and collaborative fisheries management programs. Local communities, including the Mijikenda peoples, are at the forefront of conservation efforts, combining traditional knowledge with modern science to protect marine resources.
              </p>

              <h3 className="text-xl font-semibold mb-4">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Mangrove Restoration</h4>
                  <p className="text-sm text-muted-foreground">Community-led restoration of critical mangrove habitats that protect coastlines and support fisheries.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Marine Conservation</h4>
                  <p className="text-sm text-muted-foreground">Protection of coral reefs and marine life through community conservancies and marine protected areas.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Sustainable Fisheries</h4>
                  <p className="text-sm text-muted-foreground">Community-based fisheries management ensuring long-term sustainability of marine resources.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Turtle Conservation</h4>
                  <p className="text-sm text-muted-foreground">Protection of critical nesting sites for endangered sea turtle species along Kenya's beaches.</p>
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
              Marine Conservation Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the organizations protecting Kenya's precious marine ecosystems and supporting coastal communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coastPartners.map((partner) => (
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
                  <Button size="sm" asChild className="w-full">
                    <Link to={`/partners/${partner.slug}`}>
                      View Partner
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
              Featured Coastal Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dive into marine conservation while experiencing the beauty of Kenya's coastal waters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coastExperiences.slice(0, 6).map((experience) => (
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
                      <Link to={`/listings/${experience.slug}`}>
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
              <Link to="/listings?destination=coast">
                View All Coastal Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoastDestination;